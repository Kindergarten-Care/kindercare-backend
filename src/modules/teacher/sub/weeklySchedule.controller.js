import * as weeklyScheduleService from './weeklySchedule.service.js';
import * as teacherService from '../teacher.service.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import httpStatus from 'http-status';
import ApiError from '../../../utils/ApiError.js';

/**
 * GET /teacher/classes/:classId/monthly-schedule/:year/:month
 * Returns MonthlySchedule + all weeks + details in one payload.
 * Returns 200 with { monthlySchedule: null, weeks: [] } when no record yet.
 */
export const getMonthlySchedule = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const { classId, year, month } = req.params;

    const numericClassId = parseInt(classId, 10);
    const numericYear = parseInt(year, 10);
    const numericMonth = parseInt(month, 10);
    if (isNaN(numericClassId) || isNaN(numericYear) || isNaN(numericMonth)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số không hợp lệ');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const ms = await weeklyScheduleService.getMonthlySchedule(numericClassId, numericMonth, numericYear);
    let weeks = [];
    if (ms) {
      weeks = await weeklyScheduleService.getWeeksByMonthly(ms.monthlyScheduleId);
    }

    const weeksInMonth = weeklyScheduleService.getWeeksInMonth(numericYear, numericMonth);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { monthlySchedule: ms, weeks, weeksInMonth }, 'Lấy thời khóa biểu thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teacher/classes/:classId/monthly-schedule
 * Upsert MonthlySchedule (creates with default WeekTheme placeholder per week? No, just MS).
 */
export const upsertMonthlySchedule = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const { classId } = req.params;
    const { month, year, monthTheme } = req.body;

    const numericClassId = parseInt(classId, 10);
    if (isNaN(numericClassId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'classId phải là số');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.upsertMonthlySchedule(
      numericClassId,
      Number(month),
      Number(year),
      monthTheme
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Lưu thông tin tháng thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /teacher/classes/:classId/weekly-schedule/:wsId
 */
export const getWeeklyScheduleById = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const { classId, wsId } = req.params;

    const numericClassId = parseInt(classId, 10);
    const numericWsId = parseInt(wsId, 10);
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
 * Save (upsert) a WeeklySchedule + its WeeklyScheduleDetails.
 */
export const saveWeeklySchedule = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const { classId } = req.params;
    const { monthlyScheduleId, weekOrder, weekTheme, items } = req.body;

    const numericClassId = parseInt(classId, 10);
    if (isNaN(numericClassId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'classId phải là số');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.saveWeeklySchedule(
      Number(monthlyScheduleId),
      Number(weekOrder),
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
 */
export const deleteWeeklySchedule = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const { classId, wsId } = req.params;

    const numericClassId = parseInt(classId, 10);
    const numericWsId = parseInt(wsId, 10);
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
 * POST /teacher/classes/:classId/weekly-schedule/preview-csv
 * Multipart: file + body { monthlyScheduleId }
 * Parse CSV and return grouped-by-week preview.
 */
export const previewCSV = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const { classId } = req.params;
    const numericClassId = parseInt(classId, 10);
    if (isNaN(numericClassId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'classId phải là số');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng upload file CSV');
    }

    const csvText = req.file.buffer.toString('utf-8');
    const result = weeklyScheduleService.parseCSVPreview(csvText);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Parse CSV thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * POST /teacher/classes/:classId/weekly-schedule/import-csv
 * Multipart: file + body { monthlyScheduleId }
 * Replace WeeklyScheduleDetails for matching weeks under this MS.
 */
export const importCSV = async (req, res, next) => {
  try {
    const teacherId = req.user.TeacherID || req.user.userId;
    const { classId } = req.params;
    const { monthlyScheduleId } = req.body;

    const numericClassId = parseInt(classId, 10);
    const numericMsId = parseInt(monthlyScheduleId, 10);
    if (isNaN(numericClassId) || isNaN(numericMsId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'classId hoặc monthlyScheduleId không hợp lệ');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng upload file CSV');
    }

    const csvText = req.file.buffer.toString('utf-8');
    const result = await weeklyScheduleService.importFromCSV(numericMsId, csvText);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Import CSV thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /teacher/classes/:classId/monthly-schedule/weeks/:year/:month
 * Returns array of week metadata (weekOrder, startDate, endDate, label).
 */
export const getWeeksInMonth = async (req, res, next) => {
  try {
    const { year, month } = req.params;
    const numericYear = parseInt(year, 10);
    const numericMonth = parseInt(month, 10);
    if (isNaN(numericYear) || isNaN(numericMonth)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số không hợp lệ');
    }
    const weeks = weeklyScheduleService.getWeeksInMonth(numericYear, numericMonth);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, weeks, 'Lấy danh sách tuần thành công')
    );
  } catch (error) {
    next(error);
  }
};