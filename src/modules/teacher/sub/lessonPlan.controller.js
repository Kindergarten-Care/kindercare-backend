import httpStatus from 'http-status';
import ApiResponse from '../../../utils/ApiResponse.js';
import { 
  getLessonPlans as getLessonPlansService, 
  getLessonPlanById as getLessonPlanByIdService, 
  upsertLessonPlan as upsertLessonPlanService,
  submitForApproval,
  withdrawSubmission,
  toggleItemComplete
} from './lessonPlan.service.js';

export const getLessonPlans = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const result = await getLessonPlansService(teacherId, req.query);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Lấy danh sách giáo án thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const getLessonPlanById = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const result = await getLessonPlanByIdService(req.params.id, teacherId);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Lấy chi tiết giáo án thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const upsertLessonPlan = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const result = await upsertLessonPlanService(req.body, teacherId);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Lưu giáo án thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const submitLessonPlan = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const result = await submitForApproval(req.params.id, teacherId, req.body.note);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Nộp giáo án thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const withdrawLessonPlan = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const result = await withdrawSubmission(req.params.id, teacherId);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Thu hồi giáo án thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const completeLessonPlanItem = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const result = await toggleItemComplete(req.params.planId, req.params.itemId, teacherId, req.body.isCompleted);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Cập nhật trạng thái hạng mục thành công')
    );
  } catch (error) {
    next(error);
  }
};
