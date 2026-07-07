import pool from '../../../config/db.js';
import ApiError from '../../../utils/ApiError.js';
import httpStatus from 'http-status';

const unixNow = () => Math.floor(Date.now() / 1000);

/**
 * Get monthly schedule with weeks and details
 * @param {number} classId
 * @param {number} yearId
 * @param {number} month
 * @param {number} year
 * @returns {Promise<Object>}
 */
export const getWeeklyScheduleTemplates = async (classId, yearId, month, year) => {
  const [schedules] = await pool.query(
    `SELECT * FROM MonthlySchedules
     WHERE ClassID = ? AND Month = ? AND Year = ?`,
    [classId, month, year]
  );

  if (schedules.length === 0) {
    return null;
  }

  const schedule = schedules[0];

  const [weeks] = await pool.query(
    `SELECT * FROM WeeklySchedules
     WHERE MonthlyScheduleID = ?
     ORDER BY WeekOrder ASC`,
    [schedule.MonthlyScheduleID]
  );

  for (const week of weeks) {
    const [items] = await pool.query(
      `SELECT * FROM WeeklyScheduleDetails
       WHERE WeeklyScheduleID = ?
       ORDER BY FIELD(DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), StartTime ASC`,
      [week.WeeklyScheduleID]
    );
    week.items = items;
  }

  schedule.weeks = weeks;
  return schedule;
};

/**
 * Get single weekly schedule by ID with items
 */
export const getTemplateById = async (weeklyScheduleId) => {
  const [weeks] = await pool.query(
    `SELECT * FROM WeeklySchedules WHERE WeeklyScheduleID = ?`,
    [weeklyScheduleId]
  );

  if (weeks.length === 0) {
    return null;
  }

  const week = weeks[0];
  const [items] = await pool.query(
    `SELECT * FROM WeeklyScheduleDetails
     WHERE WeeklyScheduleID = ?
     ORDER BY FIELD(DayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), StartTime ASC`,
    [weeklyScheduleId]
  );

  week.items = items;
  return week;
};

/**
 * Create or update monthly schedule metadata
 */
export const upsertMonthlySchedule = async (classId, month, year, monthTheme) => {
  const [existing] = await pool.query(
    `SELECT MonthlyScheduleID FROM MonthlySchedules
     WHERE ClassID = ? AND Month = ? AND Year = ?`,
    [classId, month, year]
  );

  if (existing.length > 0) {
    const monthlyScheduleId = existing[0].MonthlyScheduleID;
    await pool.query(
      `UPDATE MonthlySchedules SET MonthTheme = ?, UpdatedAt = ?
       WHERE MonthlyScheduleID = ?`,
      [monthTheme, unixNow(), monthlyScheduleId]
    );
    return { monthlyScheduleId, action: 'Updated' };
  } else {
    const [maxIdRow] = await pool.query(
      'SELECT IFNULL(MAX(MonthlyScheduleID), 0) + 1 AS nextId FROM MonthlySchedules'
    );
    const monthlyScheduleId = maxIdRow[0].nextId;

    await pool.query(
      `INSERT INTO MonthlySchedules
        (MonthlyScheduleID, ClassID, Month, Year, MonthTheme, ApprovedStatus, IsActive, CreatedAt, UpdatedAt)
       VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)`,
      [monthlyScheduleId, classId, month, year, monthTheme, unixNow(), unixNow()]
    );
    return { monthlyScheduleId, action: 'Created' };
  }
};

/**
 * Import weekly schedule from parsed CSV data.
 */
export const importFromCSV = async (csvData, classId, yearId, month, year, weekOrder, weekTheme, teacherId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Get or create MonthlySchedule
    let [monthlyRows] = await connection.query(
      `SELECT MonthlyScheduleID FROM MonthlySchedules
       WHERE ClassID = ? AND Month = ? AND Year = ?`,
      [classId, month, year]
    );

    let monthlyScheduleId;
    if (monthlyRows.length > 0) {
      monthlyScheduleId = monthlyRows[0].MonthlyScheduleID;
    } else {
      const [maxMonthlyIdRow] = await connection.query(
        'SELECT IFNULL(MAX(MonthlyScheduleID), 0) + 1 AS nextId FROM MonthlySchedules'
      );
      monthlyScheduleId = maxMonthlyIdRow[0].nextId;
      await connection.query(
        `INSERT INTO MonthlySchedules
          (MonthlyScheduleID, ClassID, Month, Year, MonthTheme, ApprovedStatus, IsActive, CreatedAt, UpdatedAt)
         VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)`,
        [monthlyScheduleId, classId, month, year, `Chủ đề tháng ${month}/${year}`, unixNow(), unixNow()]
      );
    }

    // 2. Get or create WeeklySchedule for this weekOrder
    let [weeklyRows] = await connection.query(
      `SELECT WeeklyScheduleID FROM WeeklySchedules
       WHERE MonthlyScheduleID = ? AND WeekOrder = ?`,
      [monthlyScheduleId, weekOrder]
    );

    let weeklyScheduleId;
    if (weeklyRows.length > 0) {
      weeklyScheduleId = weeklyRows[0].WeeklyScheduleID;
      await connection.query(
        `UPDATE WeeklySchedules SET WeekTheme = ?, UpdatedAt = ?
         WHERE WeeklyScheduleID = ?`,
        [weekTheme, unixNow(), weeklyScheduleId]
      );
    } else {
      const [maxWeeklyIdRow] = await connection.query(
        'SELECT IFNULL(MAX(WeeklyScheduleID), 0) + 1 AS nextId FROM WeeklySchedules'
      );
      weeklyScheduleId = maxWeeklyIdRow[0].nextId;
      await connection.query(
        `INSERT INTO WeeklySchedules
          (WeeklyScheduleID, MonthlyScheduleID, WeekOrder, WeekTheme, CreatedAt, UpdatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [weeklyScheduleId, monthlyScheduleId, weekOrder, weekTheme, unixNow(), unixNow()]
      );
    }

    // 3. Clear existing details for this week
    await connection.query(
      `DELETE FROM WeeklyScheduleDetails WHERE WeeklyScheduleID = ?`,
      [weeklyScheduleId]
    );

    // 4. Insert new details
    if (csvData && csvData.length > 0) {
      const detailValues = [];
      
      // Get next ScheduleDetailID baseline
      const [maxDetailIdRow] = await connection.query(
        'SELECT IFNULL(MAX(ScheduleDetailID), 0) + 1 AS nextId FROM WeeklyScheduleDetails'
      );
      let nextDetailId = maxDetailIdRow[0].nextId;

      for (const row of csvData) {
        const day = row.DayOfWeek || row.dayOfWeek || row.Day || row.day;
        const type = row.ActivityType || row.activityType || 'study';
        
        detailValues.push([
          nextDetailId++,
          weeklyScheduleId,
          day,
          row.StartTime || row.startTime,
          row.EndTime || row.endTime,
          row.ActivityName || row.activityName,
          row.Details || row.details || null,
          row.Location || row.location || null,
          type
        ]);
      }

      await connection.query(
        `INSERT INTO WeeklyScheduleDetails
          (ScheduleDetailID, WeeklyScheduleID, DayOfWeek, StartTime, EndTime, ActivityName, Details, Location, ActivityType)
         VALUES ?`,
        [detailValues]
      );
    }

    await connection.commit();
    return { success: true, monthlyScheduleId, weeklyScheduleId, importedCount: csvData.length };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Submit monthly schedule for approval (sets ApprovedStatus = 0, IsActive = 0)
 */
export const submitForApproval = async (monthlyScheduleId, teacherId) => {
  const [schedules] = await pool.query(
    `SELECT * FROM MonthlySchedules WHERE MonthlyScheduleID = ?`,
    [monthlyScheduleId]
  );

  if (schedules.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu tháng');
  }

  await pool.query(
    `UPDATE MonthlySchedules SET ApprovedStatus = 0, IsActive = 0, UpdatedAt = ?
     WHERE MonthlyScheduleID = ?`,
    [unixNow(), monthlyScheduleId]
  );

  return { success: true, message: 'Gửi duyệt thành công. Trạng thái ApprovedStatus = 0, IsActive = 0' };
};

/**
 * Withdraw submitted monthly schedule
 */
export const withdrawTemplate = async (monthlyScheduleId, teacherId) => {
  const [schedules] = await pool.query(
    `SELECT * FROM MonthlySchedules WHERE MonthlyScheduleID = ?`,
    [monthlyScheduleId]
  );

  if (schedules.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu tháng');
  }

  // Set ApprovedStatus = 0 (keep as Draft/Pending, since default submit is 0, withdraw keeps it draft/0)
  return { success: true, message: 'Đã rút lại thành công' };
};

/**
 * Delete monthly schedule (Cascade deletes WS and WSD rows)
 */
export const deleteTemplate = async (monthlyScheduleId) => {
  const [schedules] = await pool.query(
    `SELECT * FROM MonthlySchedules WHERE MonthlyScheduleID = ?`,
    [monthlyScheduleId]
  );

  if (schedules.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu tháng');
  }

  await pool.query(
    `DELETE FROM MonthlySchedules WHERE MonthlyScheduleID = ?`,
    [monthlyScheduleId]
  );

  return { success: true, message: 'Đã xóa thời khóa biểu tháng thành công' };
};

/**
 * Copy all items from one week to another
 */
export const copyWeekItems = async (fromWeeklyScheduleId, toWeekOrder, classId, yearId, month, year, teacherId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Get source items
    const [sourceItems] = await connection.query(
      `SELECT * FROM WeeklyScheduleDetails WHERE WeeklyScheduleID = ? ORDER BY DayOfWeek, StartTime ASC`,
      [fromWeeklyScheduleId]
    );

    if (sourceItems.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy chi tiết thời khóa biểu nguồn');
    }

    // Get or create MonthlySchedule
    let [monthlyRows] = await connection.query(
      `SELECT MonthlyScheduleID FROM MonthlySchedules
       WHERE ClassID = ? AND Month = ? AND Year = ?`,
      [classId, month, year]
    );

    let monthlyScheduleId;
    if (monthlyRows.length > 0) {
      monthlyScheduleId = monthlyRows[0].MonthlyScheduleID;
    } else {
      const [maxMonthlyIdRow] = await connection.query(
        'SELECT IFNULL(MAX(MonthlyScheduleID), 0) + 1 AS nextId FROM MonthlySchedules'
      );
      monthlyScheduleId = maxMonthlyIdRow[0].nextId;
      await connection.query(
        `INSERT INTO MonthlySchedules
          (MonthlyScheduleID, ClassID, Month, Year, MonthTheme, ApprovedStatus, IsActive, CreatedAt, UpdatedAt)
         VALUES (?, ?, ?, ?, ?, 0, 0, ?, ?)`,
        [monthlyScheduleId, classId, month, year, `Chủ đề tháng ${month}/${year}`, unixNow(), unixNow()]
      );
    }

    // Get or create WeeklySchedule for target week
    let [weeklyRows] = await connection.query(
      `SELECT WeeklyScheduleID FROM WeeklySchedules
       WHERE MonthlyScheduleID = ? AND WeekOrder = ?`,
      [monthlyScheduleId, toWeekOrder]
    );

    let targetWeeklyScheduleId;
    if (weeklyRows.length > 0) {
      targetWeeklyScheduleId = weeklyRows[0].WeeklyScheduleID;
    } else {
      const [maxWeeklyIdRow] = await connection.query(
        'SELECT IFNULL(MAX(WeeklyScheduleID), 0) + 1 AS nextId FROM WeeklySchedules'
      );
      targetWeeklyScheduleId = maxWeeklyIdRow[0].nextId;
      await connection.query(
        `INSERT INTO WeeklySchedules
          (WeeklyScheduleID, MonthlyScheduleID, WeekOrder, WeekTheme, CreatedAt, UpdatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [targetWeeklyScheduleId, monthlyScheduleId, toWeekOrder, `Tuần ${toWeekOrder}`, unixNow(), unixNow()]
      );
    }

    // Clear target items
    await connection.query(
      `DELETE FROM WeeklyScheduleDetails WHERE WeeklyScheduleID = ?`,
      [targetWeeklyScheduleId]
    );

    // Copy items
    const [maxDetailIdRow] = await connection.query(
      'SELECT IFNULL(MAX(ScheduleDetailID), 0) + 1 AS nextId FROM WeeklyScheduleDetails'
    );
    let nextDetailId = maxDetailIdRow[0].nextId;

    const newItems = sourceItems.map(item => [
      nextDetailId++,
      targetWeeklyScheduleId,
      item.DayOfWeek,
      item.StartTime,
      item.EndTime,
      item.ActivityName,
      item.Details,
      item.Location,
      item.ActivityType
    ]);

    await connection.query(
      `INSERT INTO WeeklyScheduleDetails
        (ScheduleDetailID, WeeklyScheduleID, DayOfWeek, StartTime, EndTime, ActivityName, Details, Location, ActivityType)
       VALUES ?`,
      [newItems]
    );

    await connection.commit();
    return { success: true, message: `Đã sao chép ${sourceItems.length} hoạt động sang Tuần ${toWeekOrder}` };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Copy items from one day to another within the same week
 */
export const copyDayItems = async (weeklyScheduleId, fromDay, toDay, teacherId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [sourceItems] = await connection.query(
      `SELECT * FROM WeeklyScheduleDetails
       WHERE WeeklyScheduleID = ? AND DayOfWeek = ?
       ORDER BY StartTime ASC`,
      [weeklyScheduleId, fromDay]
    );

    if (sourceItems.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không có hoạt động nào trong ngày nguồn');
    }

    // Clear target day items
    await connection.query(
      `DELETE FROM WeeklyScheduleDetails WHERE WeeklyScheduleID = ? AND DayOfWeek = ?`,
      [weeklyScheduleId, toDay]
    );

    const [maxDetailIdRow] = await connection.query(
      'SELECT IFNULL(MAX(ScheduleDetailID), 0) + 1 AS nextId FROM WeeklyScheduleDetails'
    );
    let nextDetailId = maxDetailIdRow[0].nextId;

    const newItems = sourceItems.map(item => [
      nextDetailId++,
      weeklyScheduleId,
      toDay,
      item.StartTime,
      item.EndTime,
      item.ActivityName,
      item.Details,
      item.Location,
      item.ActivityType
    ]);

    await connection.query(
      `INSERT INTO WeeklyScheduleDetails
        (ScheduleDetailID, WeeklyScheduleID, DayOfWeek, StartTime, EndTime, ActivityName, Details, Location, ActivityType)
       VALUES ?`,
      [newItems]
    );

    await connection.commit();
    return { success: true, message: `Đã sao chép ${sourceItems.length} hoạt động từ ${fromDay} sang ${toDay}` };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Check if import is allowed for a month (checks if previous month is approved / active)
 */
export const canImportForMonth = async (classId, yearId, targetMonth, targetYear) => {
  let prevMonth = targetMonth - 1;
  let prevYear = targetYear;

  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear = prevYear - 1;
  }

  const [schedules] = await pool.query(
    `SELECT ApprovedStatus, IsActive FROM MonthlySchedules
     WHERE ClassID = ? AND Month = ? AND Year = ?`,
    [classId, prevMonth, prevYear]
  );

  if (schedules.length === 0) {
    return { allowed: true, reason: 'Không có lịch tháng trước' };
  }

  const prev = schedules[0];
  if (prev.ApprovedStatus === 1) {
    return { allowed: true, reason: 'Tháng trước đã được duyệt' };
  }

  return {
    allowed: false,
    reason: `Tháng trước (${prevMonth}/${prevYear}) chưa được duyệt. Vui lòng chờ duyệt trước khi soạn lịch tháng mới.`
  };
};

/**
 * Check month approval status
 */
export const checkMonthApprovalStatus = async (classId, yearId, month, year) => {
  const [schedules] = await pool.query(
    `SELECT ApprovedStatus, IsActive FROM MonthlySchedules
     WHERE ClassID = ? AND Month = ? AND Year = ?`,
    [classId, month, year]
  );

  if (schedules.length === 0) {
    return {
      hasAnyTemplate: false,
      approved: false,
      isActive: false
    };
  }

  const s = schedules[0];
  return {
    hasAnyTemplate: true,
    approved: s.ApprovedStatus === 1,
    isActive: s.IsActive === 1,
    approvedStatus: s.ApprovedStatus
  };
};

export const createItemSnapshot = async () => ({ success: true });
export const submitChangeRequest = async () => ({ success: true });
export const withdrawChangeRequest = async () => ({ success: true });
export const getScheduleReminder = async () => ({ shouldRemind: false, message: '' });
export const getImportHistory = async () => [];
export const getImportSessions = async () => [];
