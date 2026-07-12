import pool from '../../../config/db.js';
import httpStatus from 'http-status';

const unixNow = () => Math.floor(Date.now() / 1000);

const VALID_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const VALID_ACTIVITY_TYPES = ['pickup', 'meal', 'study', 'nap', 'play', 'dropoff', 'other'];

/**
 * Calculate weeks in a month. A week starts on Monday and ends on Friday.
 * @returns {Array<{ weekOrder: number, startDate: string, endDate: string, label: string }>}
 */
export const getWeeksInMonth = (year, month) => {
  // month is 1-12
  const firstOfMonth = new Date(year, month - 1, 1);
  const lastOfMonth = new Date(year, month, 0);
  const weeks = [];

  // Find first Monday on or before day 1 (start of week 1)
  let cursor = new Date(firstOfMonth);
  const dow = cursor.getDay(); // 0=Sun, 1=Mon, ...
  if (dow !== 1) {
    const offset = dow === 0 ? -6 : 1 - dow;
    cursor.setDate(cursor.getDate() + offset);
  }

  let weekOrder = 1;
  while (cursor <= lastOfMonth) {
    const start = new Date(cursor);
    const end = new Date(cursor);
    end.setDate(end.getDate() + 4); // Friday

    // Skip weeks that are entirely outside the month (e.g. July Monday in June week)
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);
    if (end >= monthStart && start <= monthEnd) {
      const fmt = (d) => `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
      weeks.push({
        weekOrder,
        startDate: fmt(start),
        endDate: fmt(end),
        label: `Tuần ${weekOrder} (${fmt(start)} - ${fmt(end)})`,
      });
      weekOrder += 1;
    }

    cursor.setDate(cursor.getDate() + 7);
  }

  return weeks;
};

// ── MonthlySchedule (MS) ───────────────────────────────────────────────────────

export const getMonthlySchedule = async (classId, month, year) => {
  const [rows] = await pool.query(
    `SELECT MonthlyScheduleID, ClassID, Month, Year, MonthTheme, CreatedAt, UpdatedAt
     FROM MonthlySchedules
     WHERE ClassID = ? AND Month = ? AND Year = ?`,
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
    createdAt: r.CreatedAt,
    updatedAt: r.UpdatedAt,
  };
};

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
       (MonthlyScheduleID, ClassID, Month, Year, MonthTheme, CreatedAt, UpdatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [nextId, classId, month, year, monthTheme, unixNow(), unixNow()]
  );
  return { monthlyScheduleId: nextId, action: 'Created' };
};

// ── WeeklySchedule (WS) ────────────────────────────────────────────────────────

export const getWeeklySchedule = async (monthlyScheduleId, weekOrder) => {
  const [rows] = await pool.query(
    `SELECT WeeklyScheduleID, MonthlyScheduleID, WeekOrder, WeekTheme, CreatedAt, UpdatedAt
     FROM WeeklySchedules
     WHERE MonthlyScheduleID = ? AND WeekOrder = ?`,
    [monthlyScheduleId, weekOrder]
  );
  if (rows.length === 0) return null;
  const w = rows[0];
  const items = await getDetailsByWsId(w.WeeklyScheduleID);
  return {
    weeklyScheduleId: w.WeeklyScheduleID,
    monthlyScheduleId: w.MonthlyScheduleID,
    weekOrder: w.WeekOrder,
    weekTheme: w.WeekTheme,
    createdAt: w.CreatedAt,
    updatedAt: w.UpdatedAt,
    items,
  };
};

export const getWeeklyScheduleById = async (weeklyScheduleId) => {
  const [rows] = await pool.query(
    `SELECT WeeklyScheduleID, MonthlyScheduleID, WeekOrder, WeekTheme, CreatedAt, UpdatedAt
     FROM WeeklySchedules WHERE WeeklyScheduleID = ?`,
    [weeklyScheduleId]
  );
  if (rows.length === 0) return null;
  const w = rows[0];
  const items = await getDetailsByWsId(w.WeeklyScheduleID);
  return {
    weeklyScheduleId: w.WeeklyScheduleID,
    monthlyScheduleId: w.MonthlyScheduleID,
    weekOrder: w.WeekOrder,
    weekTheme: w.WeekTheme,
    createdAt: w.CreatedAt,
    updatedAt: w.UpdatedAt,
    items,
  };
};

export const getWeeksByMonthly = async (monthlyScheduleId) => {
  const [rows] = await pool.query(
    `SELECT WeeklyScheduleID, MonthlyScheduleID, WeekOrder, WeekTheme, CreatedAt, UpdatedAt
     FROM WeeklySchedules
     WHERE MonthlyScheduleID = ?
     ORDER BY WeekOrder ASC`,
    [monthlyScheduleId]
  );
  const out = [];
  for (const w of rows) {
    const items = await getDetailsByWsId(w.WeeklyScheduleID);
    out.push({
      weeklyScheduleId: w.WeeklyScheduleID,
      monthlyScheduleId: w.MonthlyScheduleID,
      weekOrder: w.WeekOrder,
      weekTheme: w.WeekTheme,
      createdAt: w.CreatedAt,
      updatedAt: w.UpdatedAt,
      items,
    });
  }
  return out;
};

const getDetailsByWsId = async (wsId) => {
  const [items] = await pool.query(
    `SELECT ScheduleDetailID, WeeklyScheduleID, DayOfWeek, StartTime, EndTime,
            ActivityName, Details, Location, ActivityType
     FROM WeeklyScheduleDetails
     WHERE WeeklyScheduleID = ?
     ORDER BY FIELD(DayOfWeek,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'),
              StartTime ASC`,
    [wsId]
  );
  return items.map((item) => ({
    scheduleDetailId: item.ScheduleDetailID,
    weeklyScheduleId: item.WeeklyScheduleID,
    dayOfWeek: item.DayOfWeek,
    startTime: typeof item.StartTime === 'string' ? item.StartTime : item.StartTime.toString(),
    endTime: typeof item.EndTime === 'string' ? item.EndTime : item.EndTime.toString(),
    activityName: item.ActivityName,
    details: item.Details,
    location: item.Location,
    activityType: item.ActivityType,
  }));
};

export const saveWeeklySchedule = async (monthlyScheduleId, weekOrder, weekTheme, items) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

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
        `INSERT INTO WeeklySchedules
           (WeeklyScheduleID, MonthlyScheduleID, WeekOrder, WeekTheme, CreatedAt, UpdatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [wsId, monthlyScheduleId, weekOrder, weekTheme, unixNow(), unixNow()]
      );
    }

    await connection.query(`DELETE FROM WeeklyScheduleDetails WHERE WeeklyScheduleID = ?`, [wsId]);

    if (items && items.length > 0) {
      const values = items.map((item) => [
        wsId,
        item.dayOfWeek,
        item.startTime,
        item.endTime,
        item.activityName,
        item.details || null,
        item.location || null,
        item.activityType || 'other',
      ]);

      await connection.query(
        `INSERT INTO WeeklyScheduleDetails
           (WeeklyScheduleID, DayOfWeek, StartTime, EndTime, ActivityName, Details, Location, ActivityType)
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

export const deleteWeeklySchedule = async (weeklyScheduleId) => {
  await pool.query(`DELETE FROM WeeklyScheduleDetails WHERE WeeklyScheduleID = ?`, [weeklyScheduleId]);
  await pool.query(`DELETE FROM WeeklySchedules WHERE WeeklyScheduleID = ?`, [weeklyScheduleId]);
  return { success: true };
};

// ── CSV helpers (used by preview + import) ────────────────────────────────────

const parseTime = (raw) => {
  if (!raw) return null;
  const t = String(raw).trim();
  if (/^\d{2}:\d{2}$/.test(t)) return `${t}:00`;
  if (/^\d{2}:\d{2}:\d{2}$/.test(t)) return t;
  return null;
};

/**
 * Parse CSV text into items. Each row represents one WSD.
 * Expected header (case-insensitive, flexible): WeekOrder, DayOfWeek, StartTime, EndTime,
 *   ActivityName, ActivityType, Details, Location
 * - weekOrder is required so we know which WS to write to.
 * - rows without a valid weekOrder are skipped with an error message.
 */
export const parseCSVPreview = (csvText) => {
  const result = { items: [], errors: [], byWeek: {}, totalRows: 0 };
  const text = csvText.replace(/^\uFEFF/, '').trim();
  if (!text) {
    return { ...result, errors: ['File CSV trống'] };
  }

  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) {
    return { ...result, errors: ['File CSV phải có header và ít nhất 1 dòng dữ liệu'] };
  }

  const splitRow = (line) => {
    // Simple CSV split supporting quoted fields with commas inside.
    const out = [];
    let cur = '';
    let inQuote = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuote && line[i + 1] === '"') {
          cur += '"';
          i += 1;
        } else {
          inQuote = !inQuote;
        }
      } else if (ch === ',' && !inQuote) {
        out.push(cur);
        cur = '';
      } else {
        cur += ch;
      }
    }
    out.push(cur);
    return out.map((s) => s.trim());
  };

  const headers = splitRow(lines[0]).map((h) => h.toLowerCase());
  const idx = (name) => headers.indexOf(name);
  const weekIdx = idx('weekorder');
  const dayIdx = idx('dayofweek');
  const startIdx = idx('starttime');
  const endIdx = idx('endtime');
  const nameIdx = idx('activityname');
  const typeIdx = idx('activitytype');
  const detailsIdx = idx('details');
  const locIdx = idx('location');

  const required = { weekorder: weekIdx, dayofweek: dayIdx, starttime: startIdx, endtime: endIdx, activityname: nameIdx };
  const missing = Object.entries(required).filter(([, v]) => v === -1).map(([k]) => k);
  if (missing.length > 0) {
    return { ...result, errors: [`CSV thiếu cột bắt buộc: ${missing.join(', ')}`] };
  }

  const items = [];
  const errors = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = splitRow(lines[i]);
    const rowNum = i + 1;
    const weekOrder = parseInt(cols[weekIdx], 10);
    const day = (cols[dayIdx] || '').trim();
    const start = parseTime(cols[startIdx]);
    const end = parseTime(cols[endIdx]);
    const name = (cols[nameIdx] || '').replace(/^"|"$/g, '').trim();
    const type = (cols[typeIdx] || 'other').toLowerCase().trim();
    const details = cols[detailsIdx] ? cols[detailsIdx].replace(/^"|"$/g, '').trim() : null;
    const location = cols[locIdx] ? cols[locIdx].replace(/^"|"$/g, '').trim() : null;

    if (!weekOrder || weekOrder < 1) {
      errors.push(`Dòng ${rowNum}: WeekOrder không hợp lệ`);
      continue;
    }
    if (!VALID_WEEKDAYS.includes(day)) {
      errors.push(`Dòng ${rowNum}: DayOfWeek "${day}" không hợp lệ (chỉ Mon-Fri)`);
      continue;
    }
    if (!start) {
      errors.push(`Dòng ${rowNum}: StartTime "${cols[startIdx]}" không đúng định dạng HH:MM`);
      continue;
    }
    if (!end) {
      errors.push(`Dòng ${rowNum}: EndTime "${cols[endIdx]}" không đúng định dạng HH:MM`);
      continue;
    }
    if (!name) {
      errors.push(`Dòng ${rowNum}: thiếu ActivityName`);
      continue;
    }
    const activityType = VALID_ACTIVITY_TYPES.includes(type) ? type : 'other';

    items.push({
      weekOrder,
      dayOfWeek: day,
      startTime: start,
      endTime: end,
      activityName: name,
      activityType,
      details: details || null,
      location: location || null,
    });
  }

  const byWeek = {};
  for (const it of items) {
    if (!byWeek[it.weekOrder]) byWeek[it.weekOrder] = [];
    byWeek[it.weekOrder].push(it);
  }

  return { items, errors, byWeek, totalRows: items.length };
};

/**
 * Import CSV directly into WeeklyScheduleDetails.
 * - Looks up each WeekOrder to find its WeeklyScheduleID.
 * - Rows whose WeekOrder does not match any existing WS are skipped with an error.
 */
export const importFromCSV = async (monthlyScheduleId, csvText) => {
  const { items, errors, byWeek, totalRows } = parseCSVPreview(csvText);

  if (totalRows === 0) {
    return { success: 0, failed: errors.length, errors: errors.length ? errors : ['Không có dòng hợp lệ'] };
  }

  // Find existing WS rows for this MS
  const [wsRows] = await pool.query(
    `SELECT WeeklyScheduleID, WeekOrder, WeekTheme FROM WeeklySchedules WHERE MonthlyScheduleID = ?`,
    [monthlyScheduleId]
  );
  const wsByWeek = new Map(wsRows.map((w) => [w.WeekOrder, w]));

  const connection = await pool.getConnection();
  let totalSuccess = 0;
  const failedRows = [...errors];

  try {
    await connection.beginTransaction();

    for (const [weekOrderStr, weekItems] of Object.entries(byWeek)) {
      const weekOrder = parseInt(weekOrderStr, 10);
      let ws = wsByWeek.get(weekOrder);
      if (!ws) {
        const [[{ nextId }]] = await connection.query(
          'SELECT IFNULL(MAX(WeeklyScheduleID), 0) + 1 AS nextId FROM WeeklySchedules'
        );
        await connection.query(
          `INSERT INTO WeeklySchedules
             (WeeklyScheduleID, MonthlyScheduleID, WeekOrder, WeekTheme, CreatedAt, UpdatedAt)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [nextId, monthlyScheduleId, weekOrder, `Tuần ${weekOrder}`, unixNow(), unixNow()]
        );
        ws = { WeeklyScheduleID: nextId, WeekOrder: weekOrder };
      }

      // Replace details for this week
      await connection.query(`DELETE FROM WeeklyScheduleDetails WHERE WeeklyScheduleID = ?`, [ws.WeeklyScheduleID]);

      const values = weekItems.map((it) => [
        ws.WeeklyScheduleID,
        it.dayOfWeek,
        it.startTime,
        it.endTime,
        it.activityName,
        it.details,
        it.location,
        it.activityType,
      ]);
      await connection.query(
        `INSERT INTO WeeklyScheduleDetails
           (WeeklyScheduleID, DayOfWeek, StartTime, EndTime, ActivityName, Details, Location, ActivityType)
         VALUES ?`,
        [values]
      );

      totalSuccess += weekItems.length;
    }

    await connection.commit();
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }

  return { success: totalSuccess, failed: failedRows.length, errors: failedRows };
};

export { VALID_WEEKDAYS, VALID_ACTIVITY_TYPES };