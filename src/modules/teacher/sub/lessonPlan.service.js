import pool from '../../../config/db.js';

/**
 * Normalise the DB snake_case row returned by MySQL to the camelCase
 * LessonPlanApiDto defined in API_DESIGN_LESSON_PLANS.md.
 */
const toApiDto = (row) => {
  if (!row) return null;
  return {
    lessonPlanId: row.lessonPlanId,
    teacherId: row.teacherId,
    teacherName: row.teacherName ?? null,
    classId: row.classId,
    className: row.className ?? null,
    yearId: row.yearId,
    weekNumber: row.weekNumber,
    year: row.year,
    weekStartDate: row.weekStartDate ? Number(row.weekStartDate) : null,
    weekEndDate: row.weekEndDate ? Number(row.weekEndDate) : null,
    weekTheme: row.weekTheme ?? null,
    monthTheme: row.monthTheme ?? null,
    weeklyGoal: row.weeklyGoal ?? null,
    note: row.note ?? null,
    status: row.status,
    submittedAt: row.submittedAt ? Number(row.submittedAt) : null,
    reviewedById: row.reviewedById ?? null,
    reviewedByName: row.reviewedByName ?? null,
    reviewedAt: row.reviewedAt ? Number(row.reviewedAt) : null,
    reviewerComment: row.reviewerComment ?? null,
    createdAt: row.createdAt ? Number(row.createdAt) : null,
    updatedAt: row.updatedAt ? Number(row.updatedAt) : null,
  };
};

/**
 * Normalise a LessonPlanItems row to the camelCase LessonPlanItemApiDto.
 */
const toItemApiDto = (row) => {
  if (!row) return null;
  return {
    itemId: row.itemId,
    lessonPlanId: row.lessonPlanId,
    dayOfWeek: row.dayOfWeek,
    subject: row.subject,
    startTime: row.startTime ?? null,
    endTime: row.endTime ?? null,
    title: row.title,
    objective: row.objective ?? null,
    activityDetails: row.activityDetails ?? null,
    materials: row.materials ?? null,
    teacherNote: row.teacherNote ?? null,
    isCompleted: row.isCompleted === 1 || row.isCompleted === true,
    completedAt: row.completedAt ? Number(row.completedAt) : null,
    orderIndex: row.orderIndex ?? 0,
  };
};

const PLAN_SELECT = `
  SELECT
    lp.LessonPlanID      AS lessonPlanId,
    lp.TeacherID         AS teacherId,
    t.FullName           AS teacherName,
    lp.ClassID           AS classId,
    c.ClassName          AS className,
    lp.YearID            AS yearId,
    lp.WeekNumber        AS weekNumber,
    lp.Year              AS year,
    lp.WeekStartDate     AS weekStartDate,
    lp.WeekEndDate       AS weekEndDate,
    lp.WeekTheme         AS weekTheme,
    lp.MonthTheme        AS monthTheme,
    lp.WeeklyGoal        AS weeklyGoal,
    lp.Note              AS note,
    lp.Status            AS status,
    lp.SubmittedAt       AS submittedAt,
    lp.ReviewedByID      AS reviewedById,
    p.FullName           AS reviewedByName,
    lp.ReviewedAt        AS reviewedAt,
    lp.ReviewerComment   AS reviewerComment,
    lp.CreatedAt         AS createdAt,
    lp.UpdatedAt         AS updatedAt
  FROM LessonPlans lp
  JOIN Teachers t ON lp.TeacherID = t.TeacherID
  JOIN Classes   c ON lp.ClassID   = c.ClassID
  LEFT JOIN Principals p ON lp.ReviewedByID = p.PrincipalID
`;

const ITEM_SELECT = `
  SELECT
    i.ItemID            AS itemId,
    i.LessonPlanID      AS lessonPlanId,
    i.DayOfWeek         AS dayOfWeek,
    i.Subject           AS subject,
    i.StartTime         AS startTime,
    i.EndTime           AS endTime,
    i.Title             AS title,
    i.Objective         AS objective,
    i.ActivityDetails   AS activityDetails,
    i.Materials         AS materials,
    i.TeacherNote       AS teacherNote,
    i.IsCompleted       AS isCompleted,
    i.CompletedAt       AS completedAt,
    i.OrderIndex        AS orderIndex
  FROM LessonPlanItems i
`;

/**
 * List lesson plans for a teacher.
 *
 * @param {number} teacherId
 * @param {{ status?: string, classId?: number, year?: number }} filters
 * @returns {Promise<Array<Object>>}
 */
export const getLessonPlansForTeacher = async (teacherId, filters = {}) => {
  const where = ['lp.TeacherID = ?'];
  const params = [teacherId];

  if (filters.status) {
    where.push('lp.Status = ?');
    params.push(filters.status);
  }
  if (filters.classId) {
    where.push('lp.ClassID = ?');
    params.push(Number(filters.classId));
  }
  if (filters.year) {
    where.push('lp.Year = ?');
    params.push(Number(filters.year));
  }

  const sql = `${PLAN_SELECT} WHERE ${where.join(' AND ')} ORDER BY lp.Year DESC, lp.WeekNumber DESC`;
  const [rows] = await pool.query(sql, params);
  return rows.map(toApiDto);
};

/**
 * Get a single lesson plan (with items) for a teacher.
 * Returns `null` when not found OR not owned by the teacher.
 *
 * @param {number} lessonPlanId
 * @param {number} teacherId
 */
export const getLessonPlanDetailForTeacher = async (lessonPlanId, teacherId) => {
  const [rows] = await pool.query(
    `${PLAN_SELECT} WHERE lp.LessonPlanID = ? AND lp.TeacherID = ?`,
    [lessonPlanId, teacherId]
  );
  if (rows.length === 0) return null;
  const dto = toApiDto(rows[0]);

  const [items] = await pool.query(
    `${ITEM_SELECT} WHERE i.LessonPlanID = ? ORDER BY FIELD(i.DayOfWeek,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), i.OrderIndex ASC, i.ItemID ASC`,
    [lessonPlanId]
  );
  dto.items = items.map(toItemApiDto);
  return dto;
};

/**
 * Get a lesson plan WITHOUT teacher ownership check.
 * Used by service code (e.g. when validating that the authenticated teacher
 * is creating the plan) — ownership enforcement is the caller's responsibility.
 */
export const getLessonPlanById = async (lessonPlanId) => {
  const [rows] = await pool.query(
    `${PLAN_SELECT} WHERE lp.LessonPlanID = ?`,
    [lessonPlanId]
  );
  if (rows.length === 0) return null;
  const dto = toApiDto(rows[0]);

  const [items] = await pool.query(
    `${ITEM_SELECT} WHERE i.LessonPlanID = ? ORDER BY FIELD(i.DayOfWeek,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'), i.OrderIndex ASC, i.ItemID ASC`,
    [lessonPlanId]
  );
  dto.items = items.map(toItemApiDto);
  return dto;
};

/**
 * Insert a history row describing an action performed on a plan.
 */
const logHistory = async (conn, planId, { action, fromStatus, toStatus, actorId, actorRole, comment }) => {
  await conn.query(
    `
      INSERT INTO LessonPlanHistory
        (LessonPlanID, Action, FromStatus, ToStatus, ActorID, ActorRole, Comment, CreatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, UNIX_TIMESTAMP())
    `,
    [planId, action, fromStatus ?? null, toStatus ?? null, actorId ?? null, actorRole, comment ?? null]
  );
};

/**
 * Find an existing plan matching the (teacher, class, week) UNIQUE key.
 */
const findExistingPlanByKey = async (conn, { teacherId, classId, yearId, weekNumber, year, excludeId = null }) => {
  const sql = `
    SELECT LessonPlanID
    FROM LessonPlans
    WHERE TeacherID = ? AND ClassID = ? AND YearID = ? AND WeekNumber = ? AND Year = ?
    ${excludeId ? 'AND LessonPlanID <> ?' : ''}
    LIMIT 1
  `;
  const params = [teacherId, classId, yearId, weekNumber, year];
  if (excludeId) params.push(excludeId);
  const [rows] = await conn.query(sql, params);
  return rows[0]?.LessonPlanID ?? null;
};

/**
 * Upsert (create or update) a lesson plan together with all its items.
 *
 * Behavior:
 *  - If `lessonPlanId` is `null/undefined`  → create a new Draft plan.
 *  - If `lessonPlanId` is provided          → update the existing plan
 *      AND replace all of its items with the supplied array (items are
 *      overwritten in a single transaction).
 *  - Update is only allowed when current status is `Draft` or
 *    `RevisionRequested`.
 *
 * @param {Object} payload
 * @param {number} teacherId
 * @returns {Promise<Object>} the resulting plan DTO with items
 */
export const upsertLessonPlan = async (payload, teacherId) => {
  const {
    lessonPlanId,
    classId,
    yearId,
    weekNumber,
    year,
    weekStartDate,
    weekEndDate,
    weekTheme,
    monthTheme,
    weeklyGoal,
    note,
    items = [],
  } = payload;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    let planId = lessonPlanId ?? null;

    if (planId) {
      const [existing] = await conn.query(
        'SELECT LessonPlanID, TeacherID, Status FROM LessonPlans WHERE LessonPlanID = ? FOR UPDATE',
        [planId]
      );
      if (existing.length === 0) throw new Error('LESSON_PLAN_NOT_FOUND');
      const row = existing[0];
      if (row.TeacherID !== teacherId) throw new Error('LESSON_PLAN_FORBIDDEN');
      if (!['Draft', 'RevisionRequested'].includes(row.Status)) {
        throw new Error('LESSON_PLAN_NOT_EDITABLE');
      }

      const duplicate = await findExistingPlanByKey(conn, {
        teacherId,
        classId,
        yearId,
        weekNumber,
        year,
        excludeId: planId,
      });
      if (duplicate) throw new Error('LESSON_PLAN_DUPLICATE');

      await conn.query(
        `
          UPDATE LessonPlans
          SET ClassID = ?, YearID = ?, WeekNumber = ?, Year = ?,
              WeekStartDate = ?, WeekEndDate = ?,
              WeekTheme = ?, MonthTheme = ?, WeeklyGoal = ?, Note = ?,
              UpdatedAt = UNIX_TIMESTAMP()
          WHERE LessonPlanID = ?
        `,
        [
          classId,
          yearId,
          weekNumber,
          year,
          weekStartDate,
          weekEndDate,
          weekTheme ?? null,
          monthTheme ?? null,
          weeklyGoal ?? null,
          note ?? null,
          planId,
        ]
      );
      await logHistory(conn, planId, {
        action: 'Updated',
        toStatus: 'Draft',
        actorId: teacherId,
        actorRole: 'Teacher',
      });
    } else {
      const duplicate = await findExistingPlanByKey(conn, {
        teacherId,
        classId,
        yearId,
        weekNumber,
        year,
      });
      if (duplicate) throw new Error('LESSON_PLAN_DUPLICATE');

      const [insertResult] = await conn.query(
        `
          INSERT INTO LessonPlans
            (TeacherID, ClassID, YearID, WeekNumber, Year,
             WeekStartDate, WeekEndDate,
             WeekTheme, MonthTheme, WeeklyGoal, Note,
             Status, CreatedAt, UpdatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Draft', UNIX_TIMESTAMP(), UNIX_TIMESTAMP())
        `,
        [
          teacherId,
          classId,
          yearId,
          weekNumber,
          year,
          weekStartDate,
          weekEndDate,
          weekTheme ?? null,
          monthTheme ?? null,
          weeklyGoal ?? null,
          note ?? null,
        ]
      );
      planId = insertResult.insertId;
      await logHistory(conn, planId, {
        action: 'Created',
        toStatus: 'Draft',
        actorId: teacherId,
        actorRole: 'Teacher',
      });
    }

    // Replace items with the supplied set (full overwrite).
    await conn.query('DELETE FROM LessonPlanItems WHERE LessonPlanID = ?', [planId]);

    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      await conn.query(
        `
          INSERT INTO LessonPlanItems
            (LessonPlanID, DayOfWeek, Subject, StartTime, EndTime,
             Title, Objective, ActivityDetails, Materials, TeacherNote,
             IsCompleted, CompletedAt, OrderIndex,
             CreatedAt, UpdatedAt)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, NULL, ?, UNIX_TIMESTAMP(), UNIX_TIMESTAMP())
        `,
        [
          planId,
          it.dayOfWeek,
          it.subject,
          it.startTime ?? null,
          it.endTime ?? null,
          it.title,
          it.objective ?? null,
          it.activityDetails ?? null,
          it.materials ?? null,
          it.teacherNote ?? null,
          it.orderIndex ?? i,
        ]
      );
    }

    await conn.commit();
    return getLessonPlanById(planId);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

/**
 * Submit a lesson plan for review (Draft/RevisionRequested → Submitted).
 */
export const submitLessonPlan = async (lessonPlanId, teacherId, comment = null) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      'SELECT LessonPlanID, TeacherID, Status FROM LessonPlans WHERE LessonPlanID = ? FOR UPDATE',
      [lessonPlanId]
    );
    if (rows.length === 0) throw new Error('LESSON_PLAN_NOT_FOUND');
    const plan = rows[0];
    if (plan.TeacherID !== teacherId) throw new Error('LESSON_PLAN_FORBIDDEN');
    if (!['Draft', 'RevisionRequested'].includes(plan.Status)) {
      throw new Error('LESSON_PLAN_INVALID_TRANSITION');
    }

    const newAction = plan.Status === 'RevisionRequested' ? 'ReSubmitted' : 'Submitted';

    await conn.query(
      `
        UPDATE LessonPlans
        SET Status = 'Submitted',
            SubmittedAt = UNIX_TIMESTAMP(),
            ReviewerComment = NULL,
            ReviewedByID = NULL,
            ReviewedAt = NULL,
            UpdatedAt = UNIX_TIMESTAMP()
        WHERE LessonPlanID = ?
      `,
      [lessonPlanId]
    );

    await logHistory(conn, lessonPlanId, {
      action: newAction,
      fromStatus: plan.Status,
      toStatus: 'Submitted',
      actorId: teacherId,
      actorRole: 'Teacher',
      comment,
    });

    await conn.commit();
    return getLessonPlanById(lessonPlanId);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

/**
 * Withdraw a previously submitted plan (Submitted → Draft) so the teacher
 * can keep editing it without going through the principal.
 */
export const withdrawLessonPlan = async (lessonPlanId, teacherId) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      'SELECT LessonPlanID, TeacherID, Status FROM LessonPlans WHERE LessonPlanID = ? FOR UPDATE',
      [lessonPlanId]
    );
    if (rows.length === 0) throw new Error('LESSON_PLAN_NOT_FOUND');
    const plan = rows[0];
    if (plan.TeacherID !== teacherId) throw new Error('LESSON_PLAN_FORBIDDEN');
    if (plan.Status !== 'Submitted') throw new Error('LESSON_PLAN_INVALID_TRANSITION');

    await conn.query(
      `
        UPDATE LessonPlans
        SET Status = 'Draft',
            SubmittedAt = NULL,
            ReviewedByID = NULL,
            ReviewedAt = NULL,
            ReviewerComment = NULL,
            UpdatedAt = UNIX_TIMESTAMP()
        WHERE LessonPlanID = ?
      `,
      [lessonPlanId]
    );

    await logHistory(conn, lessonPlanId, {
      action: 'Updated',
      fromStatus: 'Submitted',
      toStatus: 'Draft',
      actorId: teacherId,
      actorRole: 'Teacher',
      comment: 'Rút lại để chỉnh sửa',
    });

    await conn.commit();
    return getLessonPlanById(lessonPlanId);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

/**
 * Mark a single lesson-plan item as completed or uncompleted.
 *
 * Completion is independent of the parent plan's review status — teachers
 * tick items off after teaching that period. The plan does not need to be
 * `Approved` for items to be flipped to `isCompleted`.
 */
export const setLessonPlanItemCompletion = async (lessonPlanId, itemId, isCompleted) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [rows] = await conn.query(
      `
        SELECT i.ItemID, i.LessonPlanID, lp.TeacherID, lp.Status
        FROM LessonPlanItems i
        JOIN LessonPlans lp ON i.LessonPlanID = lp.LessonPlanID
        WHERE i.ItemID = ? AND i.LessonPlanID = ?
        FOR UPDATE
      `,
      [itemId, lessonPlanId]
    );
    if (rows.length === 0) throw new Error('LESSON_PLAN_ITEM_NOT_FOUND');
    const row = rows[0];

    if (isCompleted) {
      if (['Draft', 'RevisionRequested'].includes(row.Status)) {
        throw new Error('LESSON_PLAN_ITEM_NOT_TEACHABLE');
      }
    }

    const completedAt = isCompleted ? Math.floor(Date.now() / 1000) : null;

    await conn.query(
      `
        UPDATE LessonPlanItems
        SET IsCompleted = ?, CompletedAt = ?, UpdatedAt = UNIX_TIMESTAMP()
        WHERE ItemID = ?
      `,
      [isCompleted ? 1 : 0, completedAt, itemId]
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }

  const [rows] = await pool.query(`${ITEM_SELECT} WHERE i.ItemID = ?`, [itemId]);
  return toItemApiDto(rows[0]);
};

/**
 * Confirm that a teacher is the homeroom teacher of the supplied class id.
 * Mirrors the helper that the other teacher endpoints already use.
 */
export const ensureTeacherAssignedToClass = async (teacherId, classId) => {
  const [rows] = await pool.query(
    'SELECT 1 FROM ClassTeachers WHERE TeacherID = ? AND ClassID = ?',
    [teacherId, classId]
  );
  return rows.length > 0;
};
