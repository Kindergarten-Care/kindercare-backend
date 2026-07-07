import pool from '../../../config/db.js';
import httpStatus from 'http-status';

const unixNow = () => Math.floor(Date.now() / 1000);

/**
 * Get MonthlySchedule by class/month/year
 * @returns {Promise<Object|null>}
 */
export const getMonthlySchedule = async (classId, month, year) => {
  const [rows] = await pool.query(
    `SELECT * FROM MonthlySchedules WHERE ClassID = ? AND Month = ? AND Year = ?`,
    [classId, month, year]
  );
  if (rows.length === 0) return null;
  const r = rows[0];
  return {
    monthlyScheduleId: r.MonthlyScheduleID,
    classId: r.ClassID,
    month: r.Month,
    year: r.Year,
    monthTheme: r.MonthTheme,
    approvedStatus: r.ApprovedStatus,
    isActive: Boolean(r.IsActive),
    createdAt: r.CreatedAt,
    updatedAt: r.UpdatedAt,
  };
};

/**
 * Upsert MonthlySchedule (creates with ApprovedStatus=0, IsActive=0)
 * @returns {Promise<{ monthlyScheduleId: number, action: string }>}
 */
export const upsertMonthlySchedule = async (classId, month, year, monthTheme) => {
  const [existing] = await pool.query(
    `SELECT MonthlyScheduleID FROM MonthlySchedules WHERE ClassID = ? AND Month = ? AND Year = ?`,
    [classId, month, year]
  );

  if (existing.length > 0) {
    const id = existing[0].MonthlyScheduleID;
    await pool.query(
      `UPDATE MonthlySchedules SET MonthTheme = ?, UpdatedAt = ? WHERE MonthlyScheduleID = ?`,
      [monthTheme, unixNow(), id]
    );
    return { monthlyScheduleId: id, action: 'Updated' };
  }

  const [[{ nextId }]] = await pool.query(
    'SELECT IFNULL(MAX(MonthlyScheduleID), 0) + 1 AS nextId FROM MonthlySchedules'
  );
  await pool.query(
    `INSERT INTO MonthlySchedules
       (MonthlyScheduleID, ClassID, Month, Year, MonthTheme, ApprovedStatus, IsActive, CreatedAt, UpdatedAt)
     VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)`,
    [nextId, classId, month, year, monthTheme, unixNow(), unixNow()]
  );
  return { monthlyScheduleId: nextId, action: 'Created' };
};

/**
 * Get full monthly schedule with all weekly schedules and their details.
 * JOIN MS -> WS -> WSD.
 * Returns { monthlySchedule, weeks: [{ weeklyScheduleId, weekOrder, weekTheme, status, createdAt, updatedAt, items: [...] }] }
 * @returns {Promise<Object|null>}
 */
export const getMonthlyScheduleWithWeeks = async (classId, month, year) => {
  const ms = await getMonthlySchedule(classId, month, year);
  if (!ms) return null;

  const [weeks] = await pool.query(
    `SELECT * FROM WeeklySchedules WHERE MonthlyScheduleID = ? ORDER BY WeekOrder ASC`,
    [ms.monthlyScheduleId]
  );

  const weekList = [];
  for (const w of weeks) {
    const [items] = await pool.query(
      `SELECT * FROM WeeklyScheduleDetails
       WHERE WeeklyScheduleID = ?
       ORDER BY FIELD(DayOfWeek,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'), StartTime ASC`,
      [w.WeeklyScheduleID]
    );

    weekList.push({
      weeklyScheduleId: w.WeeklyScheduleID,
      monthlyScheduleId: w.MonthlyScheduleID,
      weekOrder: w.WeekOrder,
      weekTheme: w.WeekTheme,
      status: w.ApprovedStatus ?? 0,
      createdAt: w.CreatedAt,
      updatedAt: w.UpdatedAt,
      items: items.map(item => ({
        scheduleDetailId: item.ScheduleDetailID,
        dayOfWeek: item.DayOfWeek,
        startTime: item.StartTime,
        endTime: item.EndTime,
        activityName: item.ActivityName,
        activityType: item.ActivityType,
        details: item.Details,
        location: item.Location,
        orderIndex: item.OrderIndex ?? 0,
      })),
    });
  }

  return { ...ms, weeks: weekList };
};

/**
 * Get single WeeklySchedule by ID with its details.
 * @returns {Promise<Object|null>}
 */
export const getWeeklyScheduleById = async (weeklyScheduleId) => {
  const [weeks] = await pool.query(
    `SELECT * FROM WeeklySchedules WHERE WeeklyScheduleID = ?`,
    [weeklyScheduleId]
  );
  if (weeks.length === 0) return null;
  const w = weeks[0];

  const [items] = await pool.query(
    `SELECT * FROM WeeklyScheduleDetails
     WHERE WeeklyScheduleID = ?
     ORDER BY FIELD(DayOfWeek,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'), StartTime ASC`,
    [weeklyScheduleId]
  );

  return {
    weeklyScheduleId: w.WeeklyScheduleID,
    monthlyScheduleId: w.MonthlyScheduleID,
    weekOrder: w.WeekOrder,
    weekTheme: w.WeekTheme,
    status: w.ApprovedStatus ?? 0,
    createdAt: w.CreatedAt,
    updatedAt: w.UpdatedAt,
    items: items.map(item => ({
      scheduleDetailId: item.ScheduleDetailID,
      dayOfWeek: item.DayOfWeek,
      startTime: item.StartTime,
      endTime: item.EndTime,
      activityName: item.ActivityName,
      activityType: item.ActivityType,
      details: item.Details,
      location: item.Location,
      orderIndex: item.OrderIndex ?? 0,
    })),
  };
};

/**
 * Upsert WeeklySchedule and replace its details.
 * Creates WS row if not exists, clears and re-inserts WSD rows.
 * @returns {Promise<{ weeklyScheduleId: number, action: string }>}
 */
export const saveWeeklySchedule = async (monthlyScheduleId, weekOrder, weekTheme, items) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Upsert WS
    const [[existing]] = await connection.query(
      `SELECT WeeklyScheduleID FROM WeeklySchedules WHERE MonthlyScheduleID = ? AND WeekOrder = ?`,
      [monthlyScheduleId, weekOrder]
    );

    let wsId;
    let action = 'Created';
    if (existing) {
      wsId = existing.WeeklyScheduleID;
      action = 'Updated';
      await connection.query(
        `UPDATE WeeklySchedules SET WeekTheme = ?, UpdatedAt = ? WHERE WeeklyScheduleID = ?`,
        [weekTheme, unixNow(), wsId]
      );
    } else {
      const [[{ nextId }]] = await connection.query(
        'SELECT IFNULL(MAX(WeeklyScheduleID), 0) + 1 AS nextId FROM WeeklySchedules'
      );
      wsId = nextId;
      await connection.query(
        `INSERT INTO WeeklySchedules (WeeklyScheduleID, MonthlyScheduleID, WeekOrder, WeekTheme, CreatedAt, UpdatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [wsId, monthlyScheduleId, weekOrder, weekTheme, unixNow(), unixNow()]
      );
    }

    // Clear existing details
    await connection.query(`DELETE FROM WeeklyScheduleDetails WHERE WeeklyScheduleID = ?`, [wsId]);

    // Insert new details
    if (items && items.length > 0) {
      const [[idRow]] = await connection.query(
        'SELECT IFNULL(MAX(ScheduleDetailID), 0) + 1 AS nextId FROM WeeklyScheduleDetails'
      );
      let nextId = idRow.nextId;

      const values = items.map(item => [
        nextId++,
        wsId,
        item.dayOfWeek,
        item.startTime,
        item.endTime,
        item.activityName,
        item.details || null,
        item.location || null,
        item.activityType || 'other',
        item.orderIndex ?? 0,
      ]);

      await connection.query(
        `INSERT INTO WeeklyScheduleDetails
           (ScheduleDetailID, WeeklyScheduleID, DayOfWeek, StartTime, EndTime, ActivityName, Details, Location, ActivityType, OrderIndex)
         VALUES ?`,
        [values]
      );
    }

    await connection.commit();
    return { weeklyScheduleId: wsId, action };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

/**
 * Delete WeeklySchedule (cascade delete details via FK, then delete WS)
 */
export const deleteWeeklySchedule = async (weeklyScheduleId) => {
  await pool.query(`DELETE FROM WeeklyScheduleDetails WHERE WeeklyScheduleID = ?`, [weeklyScheduleId]);
  await pool.query(`DELETE FROM WeeklySchedules WHERE WeeklyScheduleID = ?`, [weeklyScheduleId]);
  return { success: true };
};

/**
 * Submit weekly schedule for approval (set ApprovedStatus=1)
 */
export const submitForApproval = async (weeklyScheduleId) => {
  await pool.query(
    `UPDATE WeeklySchedules SET ApprovedStatus = 1, UpdatedAt = ? WHERE WeeklyScheduleID = ?`,
    [unixNow(), weeklyScheduleId]
  );
  return { success: true };
};

/**
 * Withdraw weekly schedule (set ApprovedStatus=0)
 */
export const withdrawTemplate = async (weeklyScheduleId) => {
  await pool.query(
    `UPDATE WeeklySchedules SET ApprovedStatus = 0, UpdatedAt = ? WHERE WeeklyScheduleID = ?`,
    [unixNow(), weeklyScheduleId]
  );
  return { success: true };
};

/**
 * Parse and validate CSV rows into WSD format.
 * @param {string} csvText - raw CSV content
 * @returns {{ items: Array, errors: string[] }}
 */
export const parseCSVPreview = (csvText) => {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return { items: [], errors: ['File CSV trống hoặc không có dữ liệu'] };
  }

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const dayIdx = headers.indexOf('dayofweek');
  const startIdx = headers.indexOf('starttime');
  const endIdx = headers.indexOf('endtime');
  const nameIdx = headers.indexOf('activityname');
  const typeIdx = headers.indexOf('activitytype');
  const detailsIdx = headers.indexOf('details');
  const locIdx = headers.indexOf('location');

  const errors = [];
  const items = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(',');
    const day = cols[dayIdx]?.trim();
    const start = cols[startIdx]?.trim();
    const end = cols[endIdx]?.trim();
    const name = cols[nameIdx]?.trim().replace(/^"|"$/g, '');
    const type = (cols[typeIdx]?.trim() || 'other').toLowerCase();
    const details = cols[detailsIdx]?.trim().replace(/^"|"$/g, '') || null;
    const location = cols[locIdx]?.trim().replace(/^"|"$/g, '') || null;

    if (!day || !start || !end || !name) {
      errors.push(`Dòng ${i + 1}: thiếu thông tin bắt buộc (DayOfWeek, StartTime, EndTime, ActivityName)`);
      continue;
    }
    if (!['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].includes(day)) {
      errors.push(`Dòng ${i + 1}: DayOfWeek "${day}" không hợp lệ`);
      continue;
    }
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(start)) {
      errors.push(`Dòng ${i + 1}: StartTime "${start}" không đúng định dạng HH:MM`);
      continue;
    }
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(end)) {
      errors.push(`Dòng ${i + 1}: EndTime "${end}" không đúng định dạng HH:MM`);
      continue;
    }

    items.push({
      dayOfWeek: day,
      startTime: start.length === 5 ? start + ':00' : start,
      endTime: end.length === 5 ? end + ':00' : end,
      activityName: name,
      activityType: ['pickup','meal','study','nap','play','dropoff','other'].includes(type) ? type : 'other',
      details,
      location,
      orderIndex: i - 1,
    });
  }

  return { items, errors };
};

/**
 * Import CSV into a WeeklySchedule (clears existing, inserts new).
 * @returns {Promise<{ success: number, failed: number, errors: string[] }>}
 */
export const importFromCSV = async (weeklyScheduleId, csvText) => {
  const { items, errors } = parseCSVPreview(csvText);
  if (errors.length > 0 && items.length === 0) {
    return { success: 0, failed: 1, errors };
  }

  const ws = await getWeeklyScheduleById(weeklyScheduleId);
  if (!ws) {
    return { success: 0, failed: 1, errors: ['Không tìm thấy thời khóa biểu'] };
  }

  await saveWeeklySchedule(ws.monthlyScheduleId, ws.weekOrder, ws.weekTheme, items);
  return { success: 1, failed: 0, errors };
};
