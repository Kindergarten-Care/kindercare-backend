import pool from '../../../config/db.js';
import ApiError from '../../../utils/ApiError.js';
import httpStatus from 'http-status';

const unixNow = () => Math.floor(Date.now() / 1000);

export const getLessonPlans = async (teacherId, query) => {
  const { status, year, classId } = query;
  let sql = 'SELECT * FROM LessonPlans WHERE TeacherID = ?';
  const params = [teacherId];

  if (status) {
    sql += ' AND Status = ?';
    params.push(status);
  }
  if (year) {
    sql += ' AND Year = ?';
    params.push(year);
  }
  if (classId) {
    sql += ' AND ClassID = ?';
    params.push(classId);
  }

  const [rows] = await pool.query(sql, params);
  
  return rows.map(r => ({
    lessonPlanId: r.LessonPlanID,
    teacherId: r.TeacherID,
    classId: r.ClassID,
    yearId: r.YearID,
    weekNumber: r.WeekNumber,
    year: r.Year,
    weekStartDate: Math.floor(new Date(r.WeekStartDate).getTime() / 1000), // convert YYYY-MM-DD to seconds
    weekEndDate: Math.floor(new Date(r.WeekEndDate).getTime() / 1000),
    weekTheme: r.WeekTheme,
    monthTheme: r.MonthTheme,
    weeklyGoal: r.WeeklyGoal,
    note: r.Note,
    status: r.Status,
    submittedAt: r.SubmittedAt,
    reviewedById: r.ReviewedByID,
    reviewedAt: r.ReviewedAt,
    reviewerComment: r.ReviewerComment,
    createdAt: r.CreatedAt,
    updatedAt: r.UpdatedAt
  }));
};

export const getLessonPlanById = async (lessonPlanId, teacherId) => {
  const [plans] = await pool.query('SELECT * FROM LessonPlans WHERE LessonPlanID = ? AND TeacherID = ?', [lessonPlanId, teacherId]);
  if (plans.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson plan not found');
  }
  const plan = plans[0];

  const [items] = await pool.query('SELECT * FROM LessonPlanItems WHERE LessonPlanID = ? ORDER BY OrderIndex ASC', [lessonPlanId]);

  return {
    lessonPlanId: plan.LessonPlanID,
    teacherId: plan.TeacherID,
    classId: plan.ClassID,
    yearId: plan.YearID,
    weekNumber: plan.WeekNumber,
    year: plan.Year,
    weekStartDate: Math.floor(new Date(plan.WeekStartDate).getTime() / 1000),
    weekEndDate: Math.floor(new Date(plan.WeekEndDate).getTime() / 1000),
    weekTheme: plan.WeekTheme,
    monthTheme: plan.MonthTheme,
    weeklyGoal: plan.WeeklyGoal,
    note: plan.Note,
    status: plan.Status,
    submittedAt: plan.SubmittedAt,
    reviewedById: plan.ReviewedByID,
    reviewedAt: plan.ReviewedAt,
    reviewerComment: plan.ReviewerComment,
    createdAt: plan.CreatedAt,
    updatedAt: plan.UpdatedAt,
    items: items.map(item => ({
      itemId: item.ItemID,
      lessonPlanId: item.LessonPlanID,
      dayOfWeek: item.DayOfWeek,
      subject: item.Subject,
      startTime: item.StartTime,
      endTime: item.EndTime,
      title: item.Title,
      objective: item.Objective,
      activityDetails: item.ActivityDetails,
      materials: item.Materials,
      teacherNote: item.TeacherNote,
      isCompleted: !!item.IsCompleted,
      completedAt: item.CompletedAt,
      orderIndex: item.OrderIndex
    }))
  };
};

export const upsertLessonPlan = async (data, teacherId) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const formatDate = (unixSec) => {
      const d = new Date(unixSec * 1000);
      return d.toISOString().split('T')[0]; // YYYY-MM-DD
    };

    const weekStartDate = formatDate(data.weekStartDate);
    const weekEndDate = formatDate(data.weekEndDate);

    // Check if plan exists for this week and class
    const [existing] = await connection.query(
      'SELECT LessonPlanID, Status FROM LessonPlans WHERE TeacherID = ? AND ClassID = ? AND WeekNumber = ? AND Year = ?',
      [teacherId, data.classId, data.weekNumber, data.year]
    );

    console.log('[DEBUG upsertLessonPlan] existing:', existing.length, 'teacherId:', teacherId, 'classId:', data.classId, 'week:', data.weekNumber, 'year:', data.year);

    let lessonPlanId;
    if (existing.length > 0) {
      lessonPlanId = existing[0].LessonPlanID;
      // cannot edit if already submitted unless withdrawn/rejected (Draft, Rejected, RevisionRequested allowed)
      const st = existing[0].Status;
      if (!['Draft', 'Rejected', 'RevisionRequested'].includes(st)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot edit lesson plan in current status');
      }

      await connection.query(
        `UPDATE LessonPlans SET 
          WeekStartDate = ?, WeekEndDate = ?, WeekTheme = ?, MonthTheme = ?, WeeklyGoal = ?, Note = ?, UpdatedAt = ?
         WHERE LessonPlanID = ? AND TeacherID = ?`,
        [weekStartDate, weekEndDate, data.weekTheme || null, data.monthTheme || null, data.weeklyGoal || null, data.note || null, unixNow(), lessonPlanId, teacherId]
      );

      // delete existing items to recreate
      await connection.query('DELETE FROM LessonPlanItems WHERE LessonPlanID = ?', [lessonPlanId]);
    } else {
      // create new
      const [maxIdRow] = await connection.query('SELECT IFNULL(MAX(LessonPlanID), 0) + 1 AS nextId FROM LessonPlans');
      lessonPlanId = maxIdRow[0].nextId;

      try {
        await connection.query(
          `INSERT INTO LessonPlans (
            LessonPlanID, TeacherID, ClassID, YearID, WeekNumber, Year, 
            WeekStartDate, WeekEndDate, WeekTheme, MonthTheme, WeeklyGoal, Note, Status, CreatedAt, UpdatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft', ?, ?)`,
          [
            lessonPlanId, teacherId, data.classId, data.yearId, data.weekNumber, data.year,
            weekStartDate, weekEndDate, data.weekTheme || null, data.monthTheme || null, data.weeklyGoal || null, data.note || null, unixNow(), unixNow()
          ]
        );
      } catch (insertErr) {
        console.log('[DEBUG upsertLessonPlan] INSERT ERROR:', insertErr.code, insertErr.message, insertErr.sqlMessage);
        // Check if it's a duplicate entry error (MySQL error 1062)
        if (insertErr.code === 'ER_DUP_ENTRY') {
          throw new ApiError(httpStatus.CONFLICT, 'Giáo án đã tồn tại trong database. Vui lòng thử lại.');
        }
        throw insertErr;
      }
    }

    // Insert items
    if (data.items && data.items.length > 0) {
      const [maxItemIdRow] = await connection.query('SELECT IFNULL(MAX(ItemID), 0) AS maxId FROM LessonPlanItems');
      let nextItemId = maxItemIdRow[0].maxId + 1;

      for (const item of data.items) {
        await connection.query(
          `INSERT INTO LessonPlanItems (
            ItemID, LessonPlanID, DayOfWeek, Subject, StartTime, EndTime, Title, 
            Objective, ActivityDetails, Materials, TeacherNote, IsCompleted, OrderIndex, CreatedAt, UpdatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            nextItemId++, lessonPlanId, item.dayOfWeek, item.subject, item.startTime || null, item.endTime || null, item.title,
            item.objective || null, item.activityDetails || null, item.materials || null, item.teacherNote || null, 0, item.orderIndex, unixNow(), unixNow()
          ]
        );
      }
    }

    await connection.commit();
    connection.release();

    return await getLessonPlanById(lessonPlanId, teacherId);
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw err;
  }
};

export const submitForApproval = async (lessonPlanId, teacherId, note) => {
  const [plans] = await pool.query('SELECT Status FROM LessonPlans WHERE LessonPlanID = ? AND TeacherID = ?', [lessonPlanId, teacherId]);
  if (plans.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson plan not found');
  }
  
  if (!['Draft', 'RevisionRequested', 'Rejected'].includes(plans[0].Status)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status for submission');
  }

  await pool.query(
    'UPDATE LessonPlans SET Status = ?, Note = ?, SubmittedAt = ?, UpdatedAt = ? WHERE LessonPlanID = ?',
    ['Submitted', note || null, unixNow(), unixNow(), lessonPlanId]
  );

  return await getLessonPlanById(lessonPlanId, teacherId);
};

export const withdrawSubmission = async (lessonPlanId, teacherId) => {
  const [plans] = await pool.query('SELECT Status FROM LessonPlans WHERE LessonPlanID = ? AND TeacherID = ?', [lessonPlanId, teacherId]);
  if (plans.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson plan not found');
  }
  
  if (plans[0].Status !== 'Submitted') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Can only withdraw submitted plans');
  }

  await pool.query(
    'UPDATE LessonPlans SET Status = ?, SubmittedAt = NULL, UpdatedAt = ? WHERE LessonPlanID = ?',
    ['Draft', unixNow(), lessonPlanId]
  );

  return await getLessonPlanById(lessonPlanId, teacherId);
};

export const toggleItemComplete = async (lessonPlanId, itemId, teacherId, isCompleted) => {
  // Check if item belongs to teacher's lesson plan
  const [plans] = await pool.query('SELECT Status FROM LessonPlans WHERE LessonPlanID = ? AND TeacherID = ?', [lessonPlanId, teacherId]);
  if (plans.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Lesson plan not found');
  }

  const [items] = await pool.query('SELECT ItemID FROM LessonPlanItems WHERE ItemID = ? AND LessonPlanID = ?', [itemId, lessonPlanId]);
  if (items.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Item not found');
  }

  await pool.query(
    'UPDATE LessonPlanItems SET IsCompleted = ?, CompletedAt = ?, UpdatedAt = ? WHERE ItemID = ?',
    [isCompleted ? 1 : 0, isCompleted ? unixNow() : null, unixNow(), itemId]
  );

  const [updated] = await pool.query('SELECT * FROM LessonPlanItems WHERE ItemID = ?', [itemId]);
  const item = updated[0];
  
  return {
    itemId: item.ItemID,
    lessonPlanId: item.LessonPlanID,
    dayOfWeek: item.DayOfWeek,
    subject: item.Subject,
    startTime: item.StartTime,
    endTime: item.EndTime,
    title: item.Title,
    objective: item.Objective,
    activityDetails: item.ActivityDetails,
    materials: item.Materials,
    teacherNote: item.TeacherNote,
    isCompleted: !!item.IsCompleted,
    completedAt: item.CompletedAt,
    orderIndex: item.OrderIndex
  };
};
