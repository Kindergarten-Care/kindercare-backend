import * as weeklyScheduleService from './weeklySchedule.service.js';
import * as teacherService from '../teacher.service.js';
import { parseCSV } from '../../../utils/csvParser.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import httpStatus from 'http-status';
import ApiError from '../../../utils/ApiError.js';

/**
 * Get weekly schedule templates for a class and month
 * GET /teacher/classes/:classId/weekly-schedule/:year/:month
 */
export const getWeeklyScheduleTemplates = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, year, month } = req.params;

    const numericClassId = parseInt(classId);
    const numericYear = parseInt(year);
    const numericMonth = parseInt(month);

    if (isNaN(numericClassId) || isNaN(numericYear) || isNaN(numericMonth)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số không hợp lệ');
    }

    // Get active year ID
    const yearId = await getActiveYearId();
    if (!yearId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy niên khóa đang hoạt động');
    }

    // Check teacher is assigned to class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const templates = await weeklyScheduleService.getWeeklyScheduleTemplates(numericClassId, yearId, numericMonth, numericYear);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, templates, 'Lấy thời khóa biểu thành công')
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Get single template by ID
 * GET /teacher/classes/:classId/weekly-schedule/template/:templateId
 */
export const getTemplateById = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, templateId } = req.params;

    const numericClassId = parseInt(classId);
    const numericTemplateId = parseInt(templateId);

    // Check teacher is assigned to class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const template = await weeklyScheduleService.getTemplateById(numericTemplateId);

    if (!template) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu');
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, template, 'Lấy chi tiết thời khóa biểu thành công')
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Create or update weekly schedule template
 * POST /teacher/classes/:classId/weekly-schedule/template
 */
export const upsertTemplate = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { yearId, month, year, weekNumber, weekTheme, weekStartDate, weekEndDate, items } = req.body;

    const numericClassId = parseInt(classId);

    // Check teacher is assigned to class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.upsertWeeklyTemplate({
      classId: numericClassId,
      yearId,
      month,
      year,
      weekNumber,
      weekTheme,
      weekStartDate,
      weekEndDate,
      items
    }, teacherId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Lưu thời khóa biểu thành công')
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Upload CSV and import weekly schedules
 * POST /teacher/classes/:classId/weekly-schedule/import
 */
export const importFromCSV = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { yearId, month, year } = req.body;

    const numericClassId = parseInt(classId);

    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng upload file CSV');
    }

    // Check teacher is assigned to class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    // Parse CSV file
    const csvData = parseCSV(req.file.buffer);

    if (!csvData || csvData.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'File CSV trống hoặc không đúng định dạng');
    }

    // Import data
    const results = await weeklyScheduleService.importFromCSV(csvData, numericClassId, yearId, month, year, teacherId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, results, `Đã import thành công ${results.success} tuần`)
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Preview CSV file (parse but don't save)
 * POST /teacher/classes/:classId/weekly-schedule/preview-csv
 */
export const previewCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng upload file CSV');
    }

    const csvData = parseCSV(req.file.buffer);

    if (!csvData || csvData.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'File CSV trống hoặc không đúng định dạng');
    }

    // Group by week for preview
    const preview = {};
    for (const row of csvData) {
      const weekNum = row.Week;
      if (!preview[weekNum]) {
        preview[weekNum] = {
          weekNumber: parseInt(weekNum),
          itemCount: 0,
          items: []
        };
      }
      preview[weekNum].itemCount++;
      preview[weekNum].items.push(row);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, {
        totalRows: csvData.length,
        weeks: Object.values(preview),
        sampleRows: csvData.slice(0, 5) // First 5 rows as sample
      }, 'Preview CSV thành công')
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Submit template for approval
 * POST /teacher/classes/:classId/weekly-schedule/template/:templateId/submit
 */
export const submitForApproval = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, templateId } = req.params;

    const numericClassId = parseInt(classId);
    const numericTemplateId = parseInt(templateId);

    // Check teacher is assigned to class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.submitForApproval(numericTemplateId, teacherId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, result.message)
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Withdraw submitted template
 * POST /teacher/classes/:classId/weekly-schedule/template/:templateId/withdraw
 */
export const withdrawTemplate = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, templateId } = req.params;

    const numericClassId = parseInt(classId);
    const numericTemplateId = parseInt(templateId);

    // Check teacher is assigned to class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.withdrawTemplate(numericTemplateId, teacherId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, result.message)
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Delete template
 * DELETE /teacher/classes/:classId/weekly-schedule/template/:templateId
 */
export const deleteTemplate = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, templateId } = req.params;

    const numericClassId = parseInt(classId);
    const numericTemplateId = parseInt(templateId);

    // Check teacher is assigned to class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.deleteTemplate(numericTemplateId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, result.message)
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Helper: Get active year ID
 */
const getActiveYearId = async () => {
  const [rows] = await pool.query(
    'SELECT YearID FROM AcademicYears WHERE IsActive = 1 LIMIT 1'
  );
  return rows.length > 0 ? rows[0].YearID : null;
};

import pool from '../../../config/db.js';
