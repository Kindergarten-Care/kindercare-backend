import * as weeklyScheduleService from './weeklySchedule.service.js';
import { validateCSVWeekdays, VALID_WEEKDAYS } from './weeklySchedule.validation.js';
import * as teacherService from '../teacher.service.js';
import { parseCSV } from '../../../utils/csvParser.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import httpStatus from 'http-status';
import ApiError from '../../../utils/ApiError.js';
import pool from '../../../config/db.js';

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

    const yearId = await getActiveYearId();
    if (!yearId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy niên khóa đang hoạt động');
    }

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

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const csvData = parseCSV(req.file.buffer);

    if (!csvData || csvData.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'File CSV trống hoặc không đúng định dạng');
    }

    // Validate weekdays (Mon-Fri only)
    const invalidDays = validateCSVWeekdays(csvData);
    if (invalidDays.length > 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `CSV chứa ngày không hợp lệ. Chỉ chấp nhận Thứ 2-6. Dòng không hợp lệ: ${invalidDays.map(d => `dòng ${d.row} (${d.day})`).join(', ')}`
      );
    }

    // Check if import is allowed (previous month must be fully approved)
    const importCheck = await weeklyScheduleService.canImportForMonth(numericClassId, yearId, month, year);
    if (!importCheck.allowed) {
      throw new ApiError(httpStatus.FORBIDDEN, importCheck.reason);
    }

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

    const preview = {};
    const invalidDays = [];

    for (let i = 0; i < csvData.length; i++) {
      const row = csvData[i];
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

      const day = row.Day || row.dayOfWeek;
      if (!VALID_WEEKDAYS.includes(day)) {
        invalidDays.push({
          row: i + 2,
          day: day,
          week: weekNum
        });
      }
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, {
        totalRows: csvData.length,
        weeks: Object.values(preview),
        sampleRows: csvData.slice(0, 5),
        invalidDays: invalidDays.length > 0 ? invalidDays : null,
        validDaysOnly: invalidDays.length === 0
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
 * Create / refresh an item snapshot for a template.
 * POST /teacher/classes/:classId/weekly-schedule/template/:templateId/snapshot
 * Body: { reason: string }
 */
export const snapshotItems = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, templateId } = req.params;
    const { reason } = req.body;

    const numericClassId = parseInt(classId);
    const numericTemplateId = parseInt(templateId);

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.createItemSnapshot(
      numericTemplateId,
      teacherId,
      reason
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Đã lưu snapshot thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Submit a change request against a template that was already approved.
 * POST /teacher/classes/:classId/weekly-schedule/template/:templateId/submit-change
 * Body: { reason: string }
 */
export const submitChangeRequest = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, templateId } = req.params;
    const { reason } = req.body;

    const numericClassId = parseInt(classId);
    const numericTemplateId = parseInt(templateId);

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.submitChangeRequest(
      numericTemplateId,
      teacherId,
      reason
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, result.message)
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Withdraw a pending change request, optionally restoring the original items.
 * POST /teacher/classes/:classId/weekly-schedule/template/:templateId/withdraw-change
 * Body: { restoreOriginal?: boolean }
 */
export const withdrawChangeRequest = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, templateId } = req.params;
    const { restoreOriginal } = req.body;

    const numericClassId = parseInt(classId);
    const numericTemplateId = parseInt(templateId);

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.withdrawChangeRequest(
      numericTemplateId,
      teacherId,
      restoreOriginal
    );

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

/**
 * Get schedule reminder info
 * GET /teacher/classes/:classId/weekly-schedule/reminder/:year/:month
 */
export const getScheduleReminder = async (req, res, next) => {
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

    const reminder = await weeklyScheduleService.getScheduleReminder(numericClassId, yearId, numericMonth, numericYear);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, reminder, 'Lấy thông tin nhắc nhở thành công')
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Get import lock status
 * GET /teacher/classes/:classId/weekly-schedule/import-status/:year/:month
 */
export const getImportStatus = async (req, res, next) => {
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

    const importCheck = await weeklyScheduleService.canImportForMonth(numericClassId, yearId, numericMonth, numericYear);
    const monthStatus = await weeklyScheduleService.checkMonthApprovalStatus(numericClassId, yearId, numericMonth, numericYear);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, {
        isLocked: !importCheck.allowed,
        lockReason: importCheck.reason || null,
        pendingWeeks: importCheck.pendingWeeks || [],
        ...monthStatus
      }, 'Lấy trạng thái import thành công')
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Get import history
 * GET /teacher/classes/:classId/weekly-schedule/history/:year/:month
 */
export const getImportHistory = async (req, res, next) => {
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

    const history = await weeklyScheduleService.getImportHistory(numericClassId, yearId, numericMonth, numericYear);
    const sessions = await weeklyScheduleService.getImportSessions(numericClassId, yearId, numericMonth, numericYear);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, {
        history,
        sessions
      }, 'Lấy lịch sử import thành công')
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Copy items from one week to another
 * POST /teacher/classes/:classId/weekly-schedule/template/:templateId/copy-week
 */
export const copyWeekItems = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, templateId } = req.params;
    const { toWeekNumber } = req.body;

    const numericClassId = parseInt(classId);
    const numericTemplateId = parseInt(templateId);
    const numericToWeek = parseInt(toWeekNumber);

    if (isNaN(numericToWeek) || numericToWeek < 1 || numericToWeek > 5) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Số tuần không hợp lệ (1-5)');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const yearId = await getActiveYearId();
    if (!yearId) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy niên khóa đang hoạt động');
    }

    // Get month/year from source template
    const [templates] = await pool.query(
      'SELECT Month, Year FROM WeeklyScheduleTemplates WHERE TemplateID = ?',
      [numericTemplateId]
    );

    if (templates.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu nguồn');
    }

    const { Month, Year } = templates[0];

    const result = await weeklyScheduleService.copyWeekItems(
      numericTemplateId,
      numericToWeek,
      numericClassId,
      yearId,
      Month,
      Year,
      teacherId
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, result.message)
    );

  } catch (error) {
    next(error);
  }
};

/**
 * Copy items from one day to another
 * POST /teacher/classes/:classId/weekly-schedule/template/:templateId/copy-day
 */
export const copyDayItems = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, templateId } = req.params;
    const { fromDay, toDay } = req.body;

    const numericClassId = parseInt(classId);
    const numericTemplateId = parseInt(templateId);

    if (!fromDay || !toDay) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng chọn ngày nguồn và ngày đích');
    }

    if (!VALID_WEEKDAYS.includes(fromDay) || !VALID_WEEKDAYS.includes(toDay)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Ngày không hợp lệ');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
    }

    const result = await weeklyScheduleService.copyDayItems(
      numericTemplateId,
      fromDay,
      toDay,
      teacherId
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, result.message)
    );

  } catch (error) {
    next(error);
  }
};
