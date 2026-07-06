import pool from '../../../config/db.js';
import ApiError from '../../../utils/ApiError.js';
import httpStatus from 'http-status';

const unixNow = () => Math.floor(Date.now() / 1000);

/**
 * Get weekly schedule templates for a class and month
 * @param {number} classId
 * @param {number} yearId
 * @param {number} month
 * @param {number} year
 * @returns {Promise<Array>}
 */
export const getWeeklyScheduleTemplates = async (classId, yearId, month, year) => {
  const [templates] = await pool.query(
    `SELECT t.*,
            (SELECT COUNT(*) FROM WeeklyScheduleItems i WHERE i.TemplateID = t.TemplateID) as itemCount
     FROM WeeklyScheduleTemplates t
     WHERE t.ClassID = ? AND t.YearID = ? AND t.Month = ? AND t.Year = ?
     ORDER BY t.WeekNumber ASC`,
    [classId, yearId, month, year]
  );

  for (const template of templates) {
    const [items] = await pool.query(
      `SELECT * FROM WeeklyScheduleItems
       WHERE TemplateID = ?
       ORDER BY DayOfWeek, OrderIndex`,
      [template.TemplateID]
    );
    template.items = items;
  }

  return templates;
};

/**
 * Get single template by ID with items
 */
export const getTemplateById = async (templateId) => {
  const [templates] = await pool.query(
    `SELECT * FROM WeeklyScheduleTemplates WHERE TemplateID = ?`,
    [templateId]
  );

  if (templates.length === 0) {
    return null;
  }

  const template = templates[0];
  const [items] = await pool.query(
    `SELECT * FROM WeeklyScheduleItems
     WHERE TemplateID = ?
     ORDER BY DayOfWeek, OrderIndex`,
    [templateId]
  );

  template.items = items;
  return template;
};

/**
 * Create or update a weekly schedule template with items
 */
export const upsertWeeklyTemplate = async (data, teacherId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      classId,
      yearId,
      month,
      year,
      weekNumber,
      weekTheme,
      weekStartDate,
      weekEndDate,
      status,
      items
    } = data;

    const [existing] = await connection.query(
      `SELECT TemplateID FROM WeeklyScheduleTemplates
       WHERE ClassID = ? AND YearID = ? AND Month = ? AND Year = ? AND WeekNumber = ?`,
      [classId, yearId, month, year, weekNumber]
    );

    let templateId;

    if (existing.length > 0) {
      templateId = existing[0].TemplateID;

      await connection.query(
        `UPDATE WeeklyScheduleTemplates SET
          WeekTheme = ?, WeekStartDate = ?, WeekEndDate = ?, Status = ?, UpdatedAt = ?
         WHERE TemplateID = ?`,
        [weekTheme || null, weekStartDate || null, weekEndDate || null, status || 'Draft', unixNow(), templateId]
      );

      await connection.query(
        `DELETE FROM WeeklyScheduleItems WHERE TemplateID = ?`,
        [templateId]
      );
    } else {
      const [maxIdRow] = await connection.query(
        'SELECT IFNULL(MAX(TemplateID), 0) + 1 AS nextId FROM WeeklyScheduleTemplates'
      );
      templateId = maxIdRow[0].nextId;

      await connection.query(
        `INSERT INTO WeeklyScheduleTemplates
          (TemplateID, ClassID, TeacherID, YearID, Month, Year, WeekNumber, WeekTheme, WeekStartDate, WeekEndDate, Status, CreatedAt, UpdatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft', ?, ?)`,
        [templateId, classId, teacherId, yearId, month, year, weekNumber, weekTheme || null, weekStartDate || null, weekEndDate || null, unixNow(), unixNow()]
      );
    }

    if (items && items.length > 0) {
      const itemValues = items.map((item, idx) => [
        templateId,
        item.dayOfWeek,
        item.startTime,
        item.endTime,
        item.activityName,
        item.activityType || 'other',
        item.details || null,
        item.location || null,
        item.orderIndex ?? idx,
        unixNow(),
        unixNow()
      ]);

      await connection.query(
        `INSERT INTO WeeklyScheduleItems
          (TemplateID, DayOfWeek, StartTime, EndTime, ActivityName, ActivityType, Details, Location, OrderIndex, CreatedAt, UpdatedAt)
         VALUES ?`,
        [itemValues]
      );
    }

    await connection.commit();

    const action = existing.length > 0 ? 'Updated' : 'Created';
    await logHistory(connection, templateId, action, existing.length > 0 ? existing[0].Status : null, status || 'Draft', teacherId, 'Teacher');

    return { templateId, action };

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Import weekly schedules from parsed CSV data
 */
export const importFromCSV = async (csvData, classId, yearId, month, year, teacherId) => {
  const connection = await pool.getConnection();
  const results = {
    success: 0,
    failed: 0,
    errors: [],
    templateIds: []
  };

  try {
    await connection.beginTransaction();

    const weekGroups = {};
    for (const row of csvData) {
      const weekNum = parseInt(row.Week);
      if (!weekGroups[weekNum]) {
        weekGroups[weekNum] = [];
      }
      weekGroups[weekNum].push(row);
    }

    for (const [weekNum, items] of Object.entries(weekGroups)) {
      try {
        const weekStartDate = items[0]?.WeekStartDate || null;
        const weekEndDate = items[0]?.WeekEndDate || null;
        const weekTheme = items[0]?.WeekTheme || `Tuần ${weekNum}`;

        const [existing] = await connection.query(
          `SELECT TemplateID FROM WeeklyScheduleTemplates
           WHERE ClassID = ? AND YearID = ? AND Month = ? AND Year = ? AND WeekNumber = ?`,
          [classId, yearId, month, year, parseInt(weekNum)]
        );

        let templateId;

        if (existing.length > 0) {
          templateId = existing[0].TemplateID;
          await connection.query(
            `UPDATE WeeklyScheduleTemplates SET
              WeekTheme = ?, WeekStartDate = ?, WeekEndDate = ?, Status = 'Draft', UpdatedAt = ?
             WHERE TemplateID = ?`,
            [weekTheme, weekStartDate, weekEndDate, unixNow(), templateId]
          );
          await connection.query(
            `DELETE FROM WeeklyScheduleItems WHERE TemplateID = ?`,
            [templateId]
          );
        } else {
          const [maxIdRow] = await connection.query(
            'SELECT IFNULL(MAX(TemplateID), 0) + 1 AS nextId FROM WeeklyScheduleTemplates'
          );
          templateId = maxIdRow[0].nextId;
          await connection.query(
            `INSERT INTO WeeklyScheduleTemplates
              (TemplateID, ClassID, TeacherID, YearID, Month, Year, WeekNumber, WeekTheme, WeekStartDate, WeekEndDate, Status, CreatedAt, UpdatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft', ?, ?)`,
            [templateId, classId, teacherId, yearId, month, year, parseInt(weekNum), weekTheme, weekStartDate, weekEndDate, unixNow(), unixNow()]
          );
        }

        let orderIndex = 0;

        for (const item of items) {
          await connection.query(
            `INSERT INTO WeeklyScheduleItems
              (TemplateID, DayOfWeek, StartTime, EndTime, ActivityName, ActivityType, Details, Location, OrderIndex, CreatedAt, UpdatedAt)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              templateId,
              item.Day,
              item.StartTime,
              item.EndTime,
              item.ActivityName,
              item.ActivityType || 'other',
              item.Details || null,
              item.Location || null,
              orderIndex++,
              unixNow(),
              unixNow()
            ]
          );
        }

        results.success++;
        results.templateIds.push(templateId);

      } catch (err) {
        results.failed++;
        results.errors.push(`Week ${weekNum}: ${err.message}`);
      }
    }

    await connection.commit();
    return results;

  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Submit template for approval
 */
export const submitForApproval = async (templateId, teacherId) => {
  const connection = await pool.getConnection();
  try {
    const [templates] = await connection.query(
      `SELECT * FROM WeeklyScheduleTemplates WHERE TemplateID = ?`,
      [templateId]
    );

    if (templates.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu');
    }

    const template = templates[0];
    const allowedStatuses = ['Draft', 'RevisionRequested'];

    if (!allowedStatuses.includes(template.Status)) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Không thể gửi duyệt khi trạng thái là "${template.Status}"`);
    }

    await connection.query(
      `UPDATE WeeklyScheduleTemplates SET Status = 'Submitted', SubmittedAt = ?, UpdatedAt = ? WHERE TemplateID = ?`,
      [unixNow(), unixNow(), templateId]
    );

    await logHistory(connection, templateId, 'Submitted', template.Status, 'Submitted', teacherId, 'Teacher');

    return { success: true, message: 'Đã gửi duyệt thành công' };

  } finally {
    connection.release();
  }
};

/**
 * Withdraw submitted template
 */
export const withdrawTemplate = async (templateId, teacherId) => {
  const connection = await pool.getConnection();
  try {
    const [templates] = await connection.query(
      `SELECT * FROM WeeklyScheduleTemplates WHERE TemplateID = ?`,
      [templateId]
    );

    if (templates.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu');
    }

    const template = templates[0];

    if (template.Status !== 'Submitted') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Chỉ có thể rút lại khi đang chờ duyệt');
    }

    await connection.query(
      `UPDATE WeeklyScheduleTemplates SET Status = 'Draft', SubmittedAt = NULL, UpdatedAt = ? WHERE TemplateID = ?`,
      [unixNow(), templateId]
    );

    await logHistory(connection, templateId, 'ReSubmitted', 'Submitted', 'Draft', teacherId, 'Teacher');

    return { success: true, message: 'Đã rút lại thành công' };

  } finally {
    connection.release();
  }
};

/**
 * Read current items of a template as plain JSON-serializable objects.
 * Used by snapshot creation.
 */
const readTemplateItems = async (connection, templateId) => {
  const [items] = await connection.query(
    `SELECT DayOfWeek, StartTime, EndTime, ActivityName, ActivityType, Details, Location, OrderIndex
     FROM WeeklyScheduleItems
     WHERE TemplateID = ?
     ORDER BY DayOfWeek, OrderIndex, ItemID`,
    [templateId]
  );
  return items;
};

/**
 * Capture the current state of a template's items as a snapshot so the
 * original schedule can be restored later if the teacher withdraws the
 * change request. Idempotent: if a snapshot already exists for this
 * template that has not been restored, update its reason and re-capture
 * items from the live table (which holds the approved originals until the
 * teacher edits them).
 */
export const createItemSnapshot = async (templateId, teacherId, reason) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [templates] = await connection.query(
      `SELECT TemplateID, Status, HasPendingChangeRequest FROM WeeklyScheduleTemplates WHERE TemplateID = ?`,
      [templateId]
    );

    if (templates.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu');
    }

    const items = await readTemplateItems(connection, templateId);
    const itemsJson = JSON.stringify(items);

    const [existing] = await connection.query(
      `SELECT SnapshotID FROM WeeklyScheduleItemSnapshots
       WHERE TemplateID = ? AND RestoredAt IS NULL
       ORDER BY SnapshotID DESC LIMIT 1`,
      [templateId]
    );

    let snapshotId;

    if (existing.length > 0) {
      snapshotId = existing[0].SnapshotID;
      await connection.query(
        `UPDATE WeeklyScheduleItemSnapshots
         SET Reason = ?, ItemsJSON = ?, CreatedBy = ?, CreatedAt = ?
         WHERE SnapshotID = ?`,
        [reason, itemsJson, teacherId, unixNow(), snapshotId]
      );
    } else {
      const [maxId] = await connection.query(
        'SELECT IFNULL(MAX(SnapshotID), 0) + 1 AS nextId FROM WeeklyScheduleItemSnapshots'
      );
      snapshotId = maxId[0].nextId;

      await connection.query(
        `INSERT INTO WeeklyScheduleItemSnapshots
          (SnapshotID, TemplateID, Reason, ItemsJSON, CreatedBy, CreatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [snapshotId, templateId, reason, itemsJson, teacherId, unixNow()]
      );
    }

    await connection.commit();

    return { snapshotId, itemCount: items.length };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Submit a change request against a template that has already been
 * approved (or needs revision). Captures the current items as the
 * "original" snapshot if no snapshot exists yet, then transitions the
 * template to Submitted so the principal can review the changes plus
 * the reason supplied by the teacher.
 */
export const submitChangeRequest = async (templateId, teacherId, reason) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [templates] = await connection.query(
      `SELECT * FROM WeeklyScheduleTemplates WHERE TemplateID = ? FOR UPDATE`,
      [templateId]
    );

    if (templates.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu');
    }

    const template = templates[0];

    if (template.HasPendingChangeRequest && template.Status === 'Submitted') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Đã có yêu cầu thay đổi đang chờ duyệt');
    }

    const allowed = ['Approved', 'RevisionRequested', 'Draft'];
    if (!allowed.includes(template.Status)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Không thể gửi yêu cầu thay đổi khi trạng thái là "${template.Status}"`
      );
    }

    // Ensure there is an active snapshot capturing the items that were live
    // BEFORE the teacher opened the edit modal. If one already exists, keep it.
    const [existingSnapshots] = await connection.query(
      `SELECT SnapshotID FROM WeeklyScheduleItemSnapshots
       WHERE TemplateID = ? AND RestoredAt IS NULL
       ORDER BY SnapshotID DESC LIMIT 1`,
      [templateId]
    );

    if (existingSnapshots.length === 0) {
      const items = await readTemplateItems(connection, templateId);
      const [maxId] = await connection.query(
        'SELECT IFNULL(MAX(SnapshotID), 0) + 1 AS nextId FROM WeeklyScheduleItemSnapshots'
      );
      const snapshotId = maxId[0].nextId;

      await connection.query(
        `INSERT INTO WeeklyScheduleItemSnapshots
          (SnapshotID, TemplateID, Reason, ItemsJSON, CreatedBy, CreatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [snapshotId, templateId, reason, JSON.stringify(items), teacherId, unixNow()]
      );
    }

    await connection.query(
      `UPDATE WeeklyScheduleTemplates
       SET Status = 'Submitted',
           HasPendingChangeRequest = 1,
           PendingChangeReason = ?,
           SubmittedAt = ?,
           UpdatedAt = ?
       WHERE TemplateID = ?`,
      [reason, unixNow(), unixNow(), templateId]
    );

    await logHistory(
      connection,
      templateId,
      'ChangeRequestSubmitted',
      template.Status,
      'Submitted',
      teacherId,
      'Teacher'
    );

    await connection.commit();

    return {
      success: true,
      message: 'Đã gửi yêu cầu thay đổi thành công',
      templateId,
      reason,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Withdraw a pending change request. If restoreOriginal=true, the live
 * items are replaced with the snapshot's items and the template returns
 * to its previous status (Approved). If false, the edits are kept and
 * the template falls back to Draft so the teacher can keep iterating.
 */
export const withdrawChangeRequest = async (templateId, teacherId, restoreOriginal = true) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [templates] = await connection.query(
      `SELECT * FROM WeeklyScheduleTemplates WHERE TemplateID = ? FOR UPDATE`,
      [templateId]
    );

    if (templates.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu');
    }

    const template = templates[0];

    if (!template.HasPendingChangeRequest || template.Status !== 'Submitted') {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Không có yêu cầu thay đổi nào đang chờ xử lý cho thời khóa biểu này'
      );
    }

    const [snapshots] = await connection.query(
      `SELECT * FROM WeeklyScheduleItemSnapshots
       WHERE TemplateID = ? AND RestoredAt IS NULL
       ORDER BY SnapshotID DESC LIMIT 1`,
      [templateId]
    );

    if (snapshots.length === 0) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Không tìm thấy snapshot để khôi phục'
      );
    }

    const snapshot = snapshots[0];
    let snapshotItems;
    try {
      snapshotItems = typeof snapshot.ItemsJSON === 'string'
        ? JSON.parse(snapshot.ItemsJSON)
        : snapshot.ItemsJSON;
    } catch (err) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Snapshot bị lỗi, không thể khôi phục');
    }

    if (restoreOriginal) {
      // Wipe current items and re-insert from snapshot
      await connection.query(
        `DELETE FROM WeeklyScheduleItems WHERE TemplateID = ?`,
        [templateId]
      );

      if (Array.isArray(snapshotItems) && snapshotItems.length > 0) {
        const values = snapshotItems.map((it, idx) => [
          templateId,
          it.DayOfWeek,
          it.StartTime,
          it.EndTime,
          it.ActivityName,
          it.ActivityType || 'other',
          it.Details || null,
          it.Location || null,
          it.OrderIndex ?? idx,
          unixNow(),
          unixNow(),
        ]);

        await connection.query(
          `INSERT INTO WeeklyScheduleItems
            (TemplateID, DayOfWeek, StartTime, EndTime, ActivityName, ActivityType, Details, Location, OrderIndex, CreatedAt, UpdatedAt)
           VALUES ?`,
          [values]
        );
      }
    }

    const nextStatus = restoreOriginal ? 'Approved' : 'Draft';

    await connection.query(
      `UPDATE WeeklyScheduleTemplates
       SET Status = ?,
           HasPendingChangeRequest = 0,
           PendingChangeReason = NULL,
           SubmittedAt = NULL,
           UpdatedAt = ?
       WHERE TemplateID = ?`,
      [nextStatus, unixNow(), templateId]
    );

    await connection.query(
      `UPDATE WeeklyScheduleItemSnapshots
       SET RestoredAt = ?, RestoredBy = ?
       WHERE SnapshotID = ?`,
      [unixNow(), teacherId, snapshot.SnapshotID]
    );

    await logHistory(
      connection,
      templateId,
      restoreOriginal ? 'ChangeRequestWithdrawnAndRestored' : 'ChangeRequestWithdrawnKeepChanges',
      'Submitted',
      nextStatus,
      teacherId,
      'Teacher'
    );

    await connection.commit();

    return {
      success: true,
      message: restoreOriginal
        ? 'Đã rút yêu cầu và khôi phục lịch ban đầu'
        : 'Đã rút yêu cầu thay đổi, giữ nguyên các chỉnh sửa',
      templateId,
      restored: restoreOriginal,
      itemCount: Array.isArray(snapshotItems) ? snapshotItems.length : 0,
    };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Delete a template
 */
export const deleteTemplate = async (templateId) => {
  const connection = await pool.getConnection();
  try {
    const [templates] = await connection.query(
      `SELECT * FROM WeeklyScheduleTemplates WHERE TemplateID = ?`,
      [templateId]
    );

    if (templates.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu');
    }

    const template = templates[0];

    if (template.Status !== 'Draft') {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Chỉ có thể xóa khi ở trạng thái nháp');
    }

    await connection.query(
      `DELETE FROM WeeklyScheduleTemplates WHERE TemplateID = ?`,
      [templateId]
    );

    return { success: true, message: 'Đã xóa thời khóa biểu' };

  } finally {
    connection.release();
  }
};

/**
 * Copy all items from one template to another week
 */
export const copyWeekItems = async (fromTemplateId, toWeekNumber, classId, yearId, month, year, teacherId) => {
  const connection = await pool.getConnection();
  try {
    // Get source template with items
    const [sourceTemplates] = await connection.query(
      `SELECT * FROM WeeklyScheduleTemplates WHERE TemplateID = ?`,
      [fromTemplateId]
    );

    if (sourceTemplates.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu nguồn');
    }

    const sourceTemplate = sourceTemplates[0];
    const [sourceItems] = await connection.query(
      `SELECT * FROM WeeklyScheduleItems WHERE TemplateID = ? ORDER BY DayOfWeek, OrderIndex`,
      [fromTemplateId]
    );

    // Find or create target template
    const [existing] = await connection.query(
      `SELECT TemplateID FROM WeeklyScheduleTemplates
       WHERE ClassID = ? AND YearID = ? AND Month = ? AND Year = ? AND WeekNumber = ?`,
      [classId, yearId, month, year, toWeekNumber]
    );

    let targetTemplateId;

    if (existing.length > 0) {
      targetTemplateId = existing[0].TemplateID;
      // Clear existing items
      await connection.query(`DELETE FROM WeeklyScheduleItems WHERE TemplateID = ?`, [targetTemplateId]);
    } else {
      // Create new template
      const [maxIdRow] = await connection.query(
        'SELECT IFNULL(MAX(TemplateID), 0) + 1 AS nextId FROM WeeklyScheduleTemplates'
      );
      targetTemplateId = maxIdRow[0].nextId;

      const weekDates = getWeekDates(year, month, toWeekNumber);

      await connection.query(
        `INSERT INTO WeeklyScheduleTemplates
          (TemplateID, ClassID, TeacherID, YearID, Month, Year, WeekNumber, WeekTheme, WeekStartDate, WeekEndDate, Status, CreatedAt, UpdatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft', ?, ?)`,
        [
          targetTemplateId, classId, teacherId, yearId, month, year, toWeekNumber,
          sourceTemplate.WeekTheme || `Tuần ${toWeekNumber}`,
          weekDates.start, weekDates.end,
          unixNow(), unixNow()
        ]
      );
    }

    // Copy items
    if (sourceItems.length > 0) {
      const itemValues = sourceItems.map(item => [
        targetTemplateId,
        item.DayOfWeek,
        item.StartTime,
        item.EndTime,
        item.ActivityName,
        item.ActivityType,
        item.Details,
        item.Location,
        item.OrderIndex,
        unixNow(),
        unixNow()
      ]);

      await connection.query(
        `INSERT INTO WeeklyScheduleItems
          (TemplateID, DayOfWeek, StartTime, EndTime, ActivityName, ActivityType, Details, Location, OrderIndex, CreatedAt, UpdatedAt)
         VALUES ?`,
        [itemValues]
      );
    }

    await logHistory(connection, targetTemplateId, 'CopiedFromWeek', null, 'Draft', teacherId, 'Teacher');

    return {
      success: true,
      message: `Đã sao chép ${sourceItems.length} hoạt động sang Tuần ${toWeekNumber}`,
      targetTemplateId
    };

  } finally {
    connection.release();
  }
};

/**
 * Copy items from one day to another within the same template
 */
export const copyDayItems = async (templateId, fromDay, toDay, teacherId) => {
  const connection = await pool.getConnection();
  try {
    // Get source items
    const [sourceItems] = await connection.query(
      `SELECT * FROM WeeklyScheduleItems
       WHERE TemplateID = ? AND DayOfWeek = ?
       ORDER BY OrderIndex`,
      [templateId, fromDay]
    );

    if (sourceItems.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không có hoạt động nào trong ngày nguồn');
    }

    // Delete existing target day items
    await connection.query(
      `DELETE FROM WeeklyScheduleItems WHERE TemplateID = ? AND DayOfWeek = ?`,
      [templateId, toDay]
    );

    // Get max order index for target day
    const [maxOrder] = await connection.query(
      `SELECT IFNULL(MAX(OrderIndex), -1) + 1 AS nextOrder FROM WeeklyScheduleItems WHERE TemplateID = ? AND DayOfWeek = ?`,
      [templateId, toDay]
    );
    let orderIndex = maxOrder[0].nextOrder;

    // Copy items
    for (const item of sourceItems) {
      await connection.query(
        `INSERT INTO WeeklyScheduleItems
          (TemplateID, DayOfWeek, StartTime, EndTime, ActivityName, ActivityType, Details, Location, OrderIndex, CreatedAt, UpdatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          templateId, toDay,
          item.StartTime, item.EndTime, item.ActivityName, item.ActivityType,
          item.Details, item.Location, orderIndex++,
          unixNow(), unixNow()
        ]
      );
    }

    return {
      success: true,
      message: `Đã sao chép ${sourceItems.length} hoạt động từ ${fromDay} sang ${toDay}`
    };

  } finally {
    connection.release();
  }
};

/**
 * Helper: Get week dates
 */
const getWeekDates = (year, month, weekNumber) => {
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);

  // Find first Monday of the month
  let firstMonday = firstDayOfMonth.getDate();
  const dayOfWeek = firstDayOfMonth.getDay();

  if (dayOfWeek === 0) {
    firstMonday = firstDayOfMonth.getDate() + 1;
  } else if (dayOfWeek > 1) {
    firstMonday = firstDayOfMonth.getDate() + (8 - dayOfWeek);
  }

  const weekStartDay = firstMonday + (weekNumber - 1) * 7;
  const weekEndDay = weekStartDay + 4;

  const pad = (n) => String(n).padStart(2, '0');

  return {
    start: `${year}-${pad(month)}-${pad(Math.min(weekStartDay, lastDayOfMonth.getDate()))}`,
    end: `${year}-${pad(month)}-${pad(Math.min(weekEndDay, lastDayOfMonth.getDate()))}`
  };
};

/**
 * Helper: Log history
 */
const logHistory = async (connection, templateId, action, fromStatus, toStatus, actorId, actorRole) => {
  const [maxId] = await connection.query(
    'SELECT IFNULL(MAX(HistoryID), 0) + 1 AS nextId FROM WeeklyScheduleHistory'
  );
  const historyId = maxId[0].nextId;

  await connection.query(
    `INSERT INTO WeeklyScheduleHistory (HistoryID, TemplateID, Action, FromStatus, ToStatus, ActorID, ActorRole, CreatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [historyId, templateId, action, fromStatus, toStatus, actorId, actorRole, unixNow()]
  );
};

/**
 * Check month approval status - returns which weeks are approved, pending
 */
export const checkMonthApprovalStatus = async (classId, yearId, month, year) => {
  const [templates] = await pool.query(
    `SELECT WeekNumber, Status FROM WeeklyScheduleTemplates
     WHERE ClassID = ? AND YearID = ? AND Month = ? AND Year = ?`,
    [classId, yearId, month, year]
  );

  const approvedWeeks = templates
    .filter(t => t.Status === 'Approved')
    .map(t => t.WeekNumber);

  const pendingWeeks = templates
    .filter(t => ['Draft', 'Submitted', 'UnderReview'].includes(t.Status))
    .map(t => t.WeekNumber);

  const submittedWeeks = templates
    .filter(t => t.Status === 'Submitted')
    .map(t => t.WeekNumber);

  return {
    totalWeeks: templates.length,
    approvedWeeks,
    pendingWeeks,
    submittedWeeks,
    allWeeksApproved: pendingWeeks.length === 0 && templates.length > 0,
    allWeeksSubmitted: submittedWeeks.length === templates.length && templates.length > 0,
    hasAnyTemplate: templates.length > 0
  };
};

/**
 * Check if import is allowed for a month
 * Import is allowed when: previous month has all weeks approved
 */
export const canImportForMonth = async (classId, yearId, targetMonth, targetYear) => {
  let prevMonth = targetMonth - 1;
  let prevYear = targetYear;

  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear = prevYear - 1;
  }

  const status = await checkMonthApprovalStatus(classId, yearId, prevMonth, prevYear);

  if (!status.hasAnyTemplate) {
    return { allowed: true, reason: 'Không có lịch tháng trước' };
  }

  if (status.allWeeksApproved) {
    return { allowed: true, reason: 'Tháng trước đã được duyệt hết' };
  }

  return {
    allowed: false,
    reason: `Tháng trước (${prevMonth}/${prevYear}) có ${status.pendingWeeks.length} tuần chưa được duyệt. Vui lòng chờ duyệt hết trước khi import tháng mới.`,
    pendingWeeks: status.pendingWeeks
  };
};

/**
 * Check if current week is the last week of month
 */
export const isLastWeekOfMonth = (month, year, weekNumber) => {
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  const week4EndDay = Math.min(28 + 4, lastDayOfMonth);
  const week5EndDay = Math.min(28 + 9, lastDayOfMonth);

  if (weekNumber === 4 && week4EndDay >= lastDayOfMonth) {
    return true;
  }
  if (weekNumber === 5) {
    return true;
  }
  return false;
};

/**
 * Get import history for a class and month
 */
export const getImportHistory = async (classId, yearId, month, year) => {
  const [history] = await pool.query(
    `SELECT h.*, t.WeekNumber, t.Month, t.Year,
            u.FullName as ActorName
     FROM WeeklyScheduleHistory h
     LEFT JOIN WeeklyScheduleTemplates t ON h.TemplateID = t.TemplateID
     LEFT JOIN Users u ON h.ActorID = u.UserID
     WHERE t.ClassID = ? AND t.YearID = ? AND t.Month = ? AND t.Year = ?
     ORDER BY h.CreatedAt DESC`,
    [classId, yearId, month, year]
  );

  return history;
};

/**
 * Get all import sessions (grouped by date)
 */
export const getImportSessions = async (classId, yearId, month, year) => {
  const [sessions] = await pool.query(
    `SELECT 
        DATE(FROM_UNIXTIME(h.CreatedAt)) as importDate,
        COUNT(*) as actionCount,
        MIN(h.CreatedAt) as firstAction,
        MAX(h.CreatedAt) as lastAction,
        GROUP_CONCAT(DISTINCT h.Action) as actions
     FROM WeeklyScheduleHistory h
     LEFT JOIN WeeklyScheduleTemplates t ON h.TemplateID = t.TemplateID
     WHERE t.ClassID = ? AND t.YearID = ? AND t.Month = ? AND t.Year = ?
     GROUP BY DATE(FROM_UNIXTIME(h.CreatedAt))
     ORDER BY firstAction DESC`,
    [classId, yearId, month, year]
  );

  return sessions;
};

/**
 * Get reminder info for teachers
 */
export const getScheduleReminder = async (classId, yearId, month, year) => {
  const status = await checkMonthApprovalStatus(classId, yearId, month, year);

  let shouldRemind = false;
  let message = '';

  if (status.hasAnyTemplate && !status.allWeeksApproved) {
    shouldRemind = true;
    const pending = status.pendingWeeks.join(', ');
    message = `Còn ${status.pendingWeeks.length} tuần chưa được duyệt: Tuần ${pending}`;
  }

  return {
    shouldRemind,
    message,
    ...status
  };
};
