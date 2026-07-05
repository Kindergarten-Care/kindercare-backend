import * as lessonPlanService from './lessonPlan.service.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import httpStatus from 'http-status';

/**
 * Map service-layer service errors to user-friendly HTTP responses.
 */
const handlePlanError = (error, next) => {
  switch (error.message) {
    case 'LESSON_PLAN_NOT_FOUND':
      return next(new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy giáo án'));
    case 'LESSON_PLAN_FORBIDDEN':
      return next(new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập giáo án này'));
    case 'LESSON_PLAN_NOT_EDITABLE':
      return next(
        new ApiError(
          httpStatus.BAD_REQUEST,
          'Không thể chỉnh sửa giáo án ở trạng thái hiện tại (chỉ cho phép Draft / RevisionRequested)'
        )
      );
    case 'LESSON_PLAN_DUPLICATE':
      return next(
        new ApiError(
          httpStatus.CONFLICT,
          'Đã tồn tại giáo án cho lớp/tuần/năm này. Vui lòng chỉnh sửa giáo án hiện có.'
        )
      );
    case 'LESSON_PLAN_INVALID_TRANSITION':
      return next(
        new ApiError(httpStatus.BAD_REQUEST, 'Không thể chuyển trạng thái giáo án ở thời điểm hiện tại')
      );
    case 'LESSON_PLAN_ITEM_NOT_FOUND':
      return next(new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy tiết học này trong giáo án'));
    case 'LESSON_PLAN_ITEM_NOT_TEACHABLE':
      return next(
        new ApiError(
          httpStatus.BAD_REQUEST,
          'Chỉ có thể đánh dấu hoàn thành khi giáo án đã được gửi duyệt hoặc đã duyệt'
        )
      );
    default:
      return next(error);
  }
};

/**
 * GET /teacher/lesson-plans
 */
export const getLessonPlans = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { status, classId, year } = req.query;

    const plans = await lessonPlanService.getLessonPlansForTeacher(teacherId, {
      status: status || undefined,
      classId: classId ? Number(classId) : undefined,
      year: year ? Number(year) : undefined,
    });

    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, plans, 'Lấy danh sách giáo án thành công'));
  } catch (error) {
    next(error);
  }
};

/**
 * GET /teacher/lesson-plans/:id
 */
export const getLessonPlanDetail = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const planId = Number(req.params.id);

    const plan = await lessonPlanService.getLessonPlanDetailForTeacher(planId, teacherId);
    if (!plan) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy giáo án hoặc bạn không có quyền xem');
    }

    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, plan, 'Lấy chi tiết giáo án thành công'));
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teacher/lesson-plans  (create + update via upsert)
 */
export const upsertLessonPlan = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const payload = req.body;

    // The teacher can only create a plan for a class they own.
    const classId = Number(payload.classId);
    if (!(await lessonPlanService.ensureTeacherAssignedToClass(teacherId, classId))) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Bạn không được phân công giảng dạy lớp này, không thể tạo giáo án'
      );
    }

    const result = await lessonPlanService.upsertLessonPlan(payload, teacherId);
    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, result, 'Lưu giáo án thành công'));
  } catch (error) {
    if (
      [
        'LESSON_PLAN_NOT_FOUND',
        'LESSON_PLAN_FORBIDDEN',
        'LESSON_PLAN_NOT_EDITABLE',
        'LESSON_PLAN_DUPLICATE',
      ].includes(error.message)
    ) {
      return handlePlanError(error, next);
    }
    next(error);
  }
};

/**
 * POST /teacher/lesson-plans/:id/submit
 */
export const submitLessonPlan = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const planId = Number(req.params.id);
    const comment = req.body?.note ?? req.body?.comment ?? null;

    const result = await lessonPlanService.submitLessonPlan(planId, teacherId, comment);
    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, result, 'Gửi duyệt giáo án thành công'));
  } catch (error) {
    if (
      ['LESSON_PLAN_NOT_FOUND', 'LESSON_PLAN_FORBIDDEN', 'LESSON_PLAN_INVALID_TRANSITION'].includes(
        error.message
      )
    ) {
      return handlePlanError(error, next);
    }
    next(error);
  }
};

/**
 * POST /teacher/lesson-plans/:id/withdraw
 */
export const withdrawLessonPlan = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const planId = Number(req.params.id);

    const result = await lessonPlanService.withdrawLessonPlan(planId, teacherId);
    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, result, 'Rút lại giáo án thành công'));
  } catch (error) {
    if (
      ['LESSON_PLAN_NOT_FOUND', 'LESSON_PLAN_FORBIDDEN', 'LESSON_PLAN_INVALID_TRANSITION'].includes(
        error.message
      )
    ) {
      return handlePlanError(error, next);
    }
    next(error);
  }
};

/**
 * PATCH /teacher/lesson-plans/:id/items/:itemId/complete
 */
export const completeLessonPlanItem = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const planId = Number(req.params.id);
    const itemId = Number(req.params.itemId);
    const { isCompleted } = req.body;

    // Verify ownership before mutating.
    const plan = await lessonPlanService.getLessonPlanDetailForTeacher(planId, teacherId);
    if (!plan) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy giáo án hoặc bạn không có quyền');
    }

    const item = await lessonPlanService.setLessonPlanItemCompletion(
      planId,
      itemId,
      isCompleted
    );
    res
      .status(httpStatus.OK)
      .json(new ApiResponse(httpStatus.OK, item, 'Cập nhật trạng thái tiết học thành công'));
  } catch (error) {
    if (
      ['LESSON_PLAN_ITEM_NOT_FOUND', 'LESSON_PLAN_ITEM_NOT_TEACHABLE'].includes(error.message)
    ) {
      return handlePlanError(error, next);
    }
    next(error);
  }
};
