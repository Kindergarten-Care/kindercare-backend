import * as weeklyScheduleService from './weeklySchedule.service.js';
import * as teacherService from '../teacher.service.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import httpStatus from 'http-status';
import ApiError from '../../../utils/ApiError.js';
import pool from '../../../config/db.js';

const getActiveYearId = async () => {
  const [rows] = await pool.query(
    'SELECT YearID FROM AcademicYears WHERE IsActive = 1 LIMIT 1'
  );
  return rows.length > 0 ? rows[0].YearID : null;
};

/**
 * GET /teacher/classes/:classId/monthly-schedule/:year/:month
 * Returns full monthly schedule with all weekly schedules and details.
 */
export const getMonthlySchedule = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, year, month } = req.params;

    const numericClassId = parseInt(classId);
    const numericYear = parseInt(year);
    const numericMonth = parseInt(month);

    if (isNaN(numericClassId) || isNaN(numericYear) || isNaN(numericMonth)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số không hợp lệ');
    }

    const yearId = await getActiveYearId();
    if (!yearId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy niên khóa đang hoạt động');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const data = await weeklyScheduleService.getMonthlyScheduleWithWeeks(numericClassId, numericYear, numericMonth);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, data, 'Lấy thời khóa biểu thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teacher/classes/:classId/monthly-schedule
 * Upsert MonthlySchedule (creates with ApprovedStatus=0, IsActive=0).
 */
export const upsertMonthlySchedule = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { month, year, monthTheme } = req.body;

    const numericClassId = parseInt(classId);
    if (isNaN(numericClassId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'classId phải là số');
    }
    if (!month || !year || !monthTheme) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'month, year, monthTheme là bắt buộc');
    }

    const yearId = await getActiveYearId();
    if (!yearId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy niên khóa đang hoạt động');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.upsertMonthlySchedule(numericClassId, month, year, monthTheme);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Lưu thông tin tháng thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /teacher/classes/:classId/weekly-schedule/:wsId
 * Returns single weekly schedule with details.
 */
export const getWeeklyScheduleById = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, wsId } = req.params;

    const numericClassId = parseInt(classId);
    const numericWsId = parseInt(wsId);
    if (isNaN(numericClassId) || isNaN(numericWsId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số không hợp lệ');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const data = await weeklyScheduleService.getWeeklyScheduleById(numericWsId);
    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu tuần');
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, data, 'Lấy thời khóa biểu tuần thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teacher/classes/:classId/weekly-schedule
 * Upsert weekly schedule (WS row + replace WSD rows).
 */
export const saveWeeklySchedule = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { monthlyScheduleId, weekOrder, weekTheme, items } = req.body;

    const numericClassId = parseInt(classId);
    if (isNaN(numericClassId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'classId phải là số');
    }
    if (!monthlyScheduleId || !weekOrder) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'monthlyScheduleId, weekOrder là bắt buộc');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.saveWeeklySchedule(
      monthlyScheduleId,
      weekOrder,
      weekTheme || '',
      items || []
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Lưu thời khóa biểu tuần thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /teacher/classes/:classId/weekly-schedule/:wsId
 * Delete weekly schedule (cascades to details).
 */
export const deleteWeeklySchedule = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, wsId } = req.params;

    const numericClassId = parseInt(classId);
    const numericWsId = parseInt(wsId);
    if (isNaN(numericClassId) || isNaN(numericWsId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số không hợp lệ');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    await weeklyScheduleService.deleteWeeklySchedule(numericWsId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { success: true }, 'Xóa thời khóa biểu tuần thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teacher/classes/:classId/weekly-schedule/:wsId/submit
 * Submit weekly schedule for approval.
 */
export const submitForApproval = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, wsId } = req.params;

    const numericClassId = parseInt(classId);
    const numericWsId = parseInt(wsId);
    if (isNaN(numericClassId) || isNaN(numericWsId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số không hợp lệ');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    await weeklyScheduleService.submitForApproval(numericWsId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { success: true }, 'Đã gửi duyệt thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teacher/classes/:classId/weekly-schedule/:wsId/withdraw
 * Withdraw submitted weekly schedule.
 */
export const withdrawTemplate = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, wsId } = req.params;

    const numericClassId = parseInt(classId);
    const numericWsId = parseInt(wsId);
    if (isNaN(numericClassId) || isNaN(numericWsId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số không hợp lệ');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    await weeklyScheduleService.withdrawTemplate(numericWsId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { success: true }, 'Đã rút lại thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teacher/classes/:classId/weekly-schedule/:wsId/preview-csv
 * Parse CSV and return preview rows (without saving).
 */
export const previewCSV = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, wsId } = req.params;

    const numericClassId = parseInt(classId);
    const numericWsId = parseInt(wsId);
    if (isNaN(numericClassId) || isNaN(numericWsId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số không hợp lệ');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng upload file CSV');
    }

    const csvText = req.file.buffer.toString('utf-8');
    const { items, errors } = weeklyScheduleService.parseCSVPreview(csvText);

    // Group items by day
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const byDay = {};
    for (const day of days) {
      byDay[day] = items.filter(i => i.dayOfWeek === day);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { items, byDay, errors, totalRows: items.length }, 'Parse CSV thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teacher/classes/:classId/weekly-schedule/:wsId/import-csv
 * Import CSV into a weekly schedule.
 */
export const importCSV = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, wsId } = req.params;

    const numericClassId = parseInt(classId);
    const numericWsId = parseInt(wsId);
    if (isNaN(numericClassId) || isNaN(numericWsId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số không hợp lệ');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng upload file CSV');
    }

    const csvText = req.file.buffer.toString('utf-8');
    const result = await weeklyScheduleService.importFromCSV(numericWsId, csvText);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Import CSV thành công')
    );
  } catch (error) {
    next(error);
  }
};
