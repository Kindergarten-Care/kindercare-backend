import ApiError from '../../../utils/ApiError.js';
import httpStatus from 'http-status';

const DAY_KEYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SUBJECT_KEYS = ['lang', 'math', 'art', 'music', 'world', 'phys', 'other'];
const STATUS_KEYS = [
  'Draft',
  'Submitted',
  'UnderReview',
  'Approved',
  'Rejected',
  'RevisionRequested',
];

/**
 * Validate list query parameters for `GET /teacher/lesson-plans`.
 */
export const validateListLessonPlans = (req, res, next) => {
  const { status, classId, year } = req.query;

  if (status !== undefined && status !== null && status !== '' && !STATUS_KEYS.includes(status)) {
    return next(
      new ApiError(
        httpStatus.BAD_REQUEST,
        'status không hợp lệ (nhận: Draft, Submitted, UnderReview, Approved, Rejected, RevisionRequested)'
      )
    );
  }

  if (classId !== undefined && classId !== null && classId !== '' && isNaN(Number(classId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là số nguyên hợp lệ'));
  }

  if (year !== undefined && year !== null && year !== '' && isNaN(Number(year))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'year phải là số nguyên hợp lệ'));
  }

  next();
};

/**
 * Validate path params for `GET /teacher/lesson-plans/:id`.
 */
export const validateLessonPlanIdParam = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'lessonPlanId phải là số nguyên hợp lệ'));
  }
  next();
};

const validateItems = (items) => {
  if (items === undefined || items === null) return;
  if (!Array.isArray(items)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'items phải là một mảng');
  }

  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (!it || typeof it !== 'object') {
      throw new ApiError(httpStatus.BAD_REQUEST, `Phần tử thứ ${i + 1} của items không hợp lệ`);
    }
    if (!DAY_KEYS.includes(it.dayOfWeek)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `items[${i}].dayOfWeek không hợp lệ (nhận: ${DAY_KEYS.join(', ')})`
      );
    }
    if (!SUBJECT_KEYS.includes(it.subject)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `items[${i}].subject không hợp lệ (nhận: ${SUBJECT_KEYS.join(', ')})`
      );
    }
    if (!it.title || typeof it.title !== 'string' || it.title.trim() === '') {
      throw new ApiError(httpStatus.BAD_REQUEST, `items[${i}].title là bắt buộc`);
    }
    const optionalString = ['objective', 'activityDetails', 'materials', 'teacherNote'];
    for (const k of optionalString) {
      if (it[k] !== undefined && it[k] !== null && typeof it[k] !== 'string') {
        throw new ApiError(httpStatus.BAD_REQUEST, `items[${i}].${k} phải là chuỗi nếu được gửi`);
      }
    }
    if (it.startTime !== undefined && it.startTime !== null && !/^\d{2}:\d{2}(:\d{2})?$/.test(it.startTime)) {
      throw new ApiError(httpStatus.BAD_REQUEST, `items[${i}].startTime phải có định dạng HH:mm[:ss]`);
    }
    if (it.endTime !== undefined && it.endTime !== null && !/^\d{2}:\d{2}(:\d{2})?$/.test(it.endTime)) {
      throw new ApiError(httpStatus.BAD_REQUEST, `items[${i}].endTime phải có định dạng HH:mm[:ss]`);
    }
    if (it.orderIndex !== undefined && it.orderIndex !== null && isNaN(Number(it.orderIndex))) {
      throw new ApiError(httpStatus.BAD_REQUEST, `items[${i}].orderIndex phải là số nếu được gửi`);
    }
  }
};

/**
 * Validate the body of `POST /teacher/lesson-plans`
 * (create + update via upsert).
 */
export const validateUpsertLessonPlan = (req, res, next) => {
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
    items,
  } = req.body;

  if (lessonPlanId !== undefined && lessonPlanId !== null && isNaN(Number(lessonPlanId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'lessonPlanId phải là số nguyên nếu được gửi'));
  }

  const numericFields = { classId, yearId, weekNumber, weekStartDate, weekEndDate };
  for (const [key, value] of Object.entries(numericFields)) {
    if (value === undefined || value === null || isNaN(Number(value))) {
      return next(new ApiError(httpStatus.BAD_REQUEST, `${key} là bắt buộc và phải là số nguyên`));
    }
  }
  if (year === undefined || year === null || isNaN(Number(year))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'year là bắt buộc và phải là số nguyên'));
  }
  if (Number(weekNumber) < 1 || Number(weekNumber) > 53) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'weekNumber phải nằm trong [1..53]'));
  }
  if (Number(weekEndDate) < Number(weekStartDate)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'weekEndDate phải lớn hơn hoặc bằng weekStartDate'));
  }

  const optionalStrings = { weekTheme, monthTheme, weeklyGoal, note };
  for (const [key, value] of Object.entries(optionalStrings)) {
    if (value !== undefined && value !== null && typeof value !== 'string') {
      return next(new ApiError(httpStatus.BAD_REQUEST, `${key} phải là chuỗi nếu được gửi`));
    }
  }

  try {
    validateItems(items);
  } catch (err) {
    return next(err);
  }

  next();
};

/**
 * Validate `POST /teacher/lesson-plans/:id/submit` and `/withdraw`.
 */
export const validateSubmitOrWithdraw = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(Number(id))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'lessonPlanId phải là số nguyên hợp lệ'));
  }
  const { note, comment } = req.body || {};
  const optField = note ?? comment;
  if (optField !== undefined && optField !== null && typeof optField !== 'string') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'note/comment phải là chuỗi nếu được gửi'));
  }
  next();
};

/**
 * Validate `PATCH /teacher/lesson-plans/:id/items/:itemId/complete`.
 */
export const validateCompleteLessonPlanItem = (req, res, next) => {
  const { id, itemId } = req.params;
  if (!id || isNaN(Number(id))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'lessonPlanId phải là số nguyên hợp lệ'));
  }
  if (!itemId || isNaN(Number(itemId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'itemId phải là số nguyên hợp lệ'));
  }
  if (typeof req.body?.isCompleted !== 'boolean') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'isCompleted là bắt buộc và phải là kiểu boolean'));
  }
  next();
};

export const LESSON_PLAN_DAY_KEYS = DAY_KEYS;
export const LESSON_PLAN_SUBJECT_KEYS = SUBJECT_KEYS;
export const LESSON_PLAN_STATUS_KEYS = STATUS_KEYS;
