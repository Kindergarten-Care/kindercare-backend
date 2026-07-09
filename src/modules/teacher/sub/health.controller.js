import * as healthService from './health.service.js';
import * as bmiService from './health.bmi.service.js';
import * as teacherService from '../teacher.service.js';
import ApiError from '../../../utils/ApiError.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import httpStatus from 'http-status';

const ensureClassAccess = async (teacherId, classId) => {
  const numericClassId = parseInt(classId, 10);
  if (isNaN(numericClassId)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'classId không hợp lệ');
  }
  const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
  if (!isAssigned) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không được phân công dạy lớp này');
  }
  return numericClassId;
};

const parseStudentIdFromBody = (body) => {
  const sid = parseInt(body.studentId, 10);
  if (isNaN(sid)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'studentId không hợp lệ');
  }
  return sid;
};

// -----------------------------------------------------------------------------
// Allergies
// -----------------------------------------------------------------------------

export const listClassAllergies = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const rows = await healthService.getAllAllergiesInClass(classId);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { allergies: rows }, 'Lấy danh sách dị ứng cả lớp thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const createClassAllergy = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const studentId = parseStudentIdFromBody(req.body);
    await healthService.assertStudentBelongsToClass(studentId, classId);
    const allergy = await healthService.createAllergy(studentId, req.body);
    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { allergy }, 'Tạo dị ứng thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const updateClassAllergy = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const allergyId = parseInt(req.params.allergyId, 10);
    if (isNaN(allergyId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'allergyId không hợp lệ');
    }
    const allergy = await healthService.updateAllergy(allergyId, req.body);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { allergy }, 'Cập nhật dị ứng thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteClassAllergy = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const allergyId = parseInt(req.params.allergyId, 10);
    if (isNaN(allergyId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'allergyId không hợp lệ');
    }
    await healthService.deleteAllergy(allergyId);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Xóa dị ứng thành công')
    );
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// Medications
// -----------------------------------------------------------------------------

export const listClassMedications = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const dateStr = req.query.date ? String(req.query.date) : null;
    const rows = await healthService.getMedicationsInClass(classId, dateStr);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { medications: rows }, 'Lấy danh sách dặn thuốc cả lớp thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const createClassMedication = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const studentId = parseStudentIdFromBody(req.body);
    await healthService.assertStudentBelongsToClass(studentId, classId);
    const medication = await healthService.createMedication(studentId, req.body);
    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { medication }, 'Tạo dặn thuốc thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const updateMedicationStatus = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const medicationId = parseInt(req.params.medicationId, 10);
    if (isNaN(medicationId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'medicationId không hợp lệ');
    }
    const updated = await healthService.updateMedicationStatus(
      medicationId,
      req.body.status,
      teacherId,
      req.body.notes
    );
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { medication: updated }, 'Cập nhật trạng thái thuốc thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteClassMedication = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const medicationId = parseInt(req.params.medicationId, 10);
    if (isNaN(medicationId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'medicationId không hợp lệ');
    }
    await healthService.deleteMedication(medicationId);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Xóa dặn thuốc thành công')
    );
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// Health Records / BMI Logs
// -----------------------------------------------------------------------------

export const listClassHealthRecords = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const termPeriod = req.query.termPeriod ? String(req.query.termPeriod) : new Date().toISOString().slice(0, 7);
    const rows = await healthService.getClassHealthRecords(classId, termPeriod);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { logs: rows }, 'Lấy danh sách hồ sơ sức khỏe cả lớp thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const batchUpdateClassHealthRecords = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const termPeriod = req.body.termPeriod ? String(req.body.termPeriod) : new Date().toISOString().slice(0, 7);

    if (!req.body.records || !Array.isArray(req.body.records)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Danh sách records không hợp lệ');
    }
    await healthService.batchUpdateHealthRecords(classId, termPeriod, req.body.records);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Cập nhật hồ sơ sức khỏe hàng loạt thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const createClassHealthLog = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const studentId = parseStudentIdFromBody(req.body);
    await healthService.assertStudentBelongsToClass(studentId, classId);
    const log = await healthService.createHealthLog(studentId, req.body);
    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { log }, 'Tạo hồ sơ sức khỏe thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const updateClassHealthLog = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const logId = parseInt(req.params.logId, 10);
    if (isNaN(logId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'logId không hợp lệ');
    }
    const log = await healthService.updateHealthLog(logId, req.body);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { log }, 'Cập nhật hồ sơ sức khỏe thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteClassHealthLog = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const logId = parseInt(req.params.logId, 10);
    if (isNaN(logId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'logId không hợp lệ');
    }
    await healthService.deleteHealthLog(logId);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Xóa hồ sơ sức khỏe thành công')
    );
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// BMI Measurements (Height/Weight → BMI tự động tính ở BE)
// -----------------------------------------------------------------------------

export const listClassBmiLogs = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const termPeriod = req.query.termPeriod
      ? String(req.query.termPeriod)
      : new Date().toISOString().slice(0, 7);
    const studentId = req.query.studentId ? parseInt(req.query.studentId, 10) : null;
    const includeOverwritten = req.query.includeOverwritten !== 'false' && req.query.includeOverwritten !== '0';

    const logs = await bmiService.getClassBmiLogs({
      classId,
      termPeriod,
      studentId,
      includeOverwritten,
    });
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { logs }, 'Lấy danh sách BMI cả lớp thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const createBmiLog = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const log = await bmiService.createBmiLog({
      classId,
      teacherId,
      payload: req.body,
    });
    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { log }, 'Tạo bản ghi BMI thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const batchUpsertBmiLogs = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const { termPeriod, records } = req.body;
    const logs = await bmiService.batchUpsertBmiLogs({
      classId,
      teacherId,
      termPeriod,
      records,
    });
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { logs }, 'Cập nhật BMI hàng loạt thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const updateBmiLog = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const logId = parseInt(req.params.logId, 10);
    if (isNaN(logId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'logId không hợp lệ');
    }
    const log = await bmiService.updateBmiLog({
      classId,
      teacherId,
      logId,
      payload: req.body,
    });
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { log }, 'Cập nhật BMI thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteBmiLog = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const logId = parseInt(req.params.logId, 10);
    if (isNaN(logId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'logId không hợp lệ');
    }
    await bmiService.deleteBmiLog({ classId, teacherId, logId });
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Xóa bản ghi BMI thành công')
    );
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// Development Assessments
// -----------------------------------------------------------------------------

export const listDevelopmentAssessments = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const termPeriod = req.query.termPeriod
      ? String(req.query.termPeriod)
      : new Date().toISOString().slice(0, 7);
    const rows = await healthService.getDevelopmentAssessments(classId, termPeriod);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { assessments: rows }, 'Lấy đánh giá phát triển cả lớp thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const upsertClassDevelopmentAssessments = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);

    const termPeriod = req.body.termPeriod
      ? String(req.body.termPeriod)
      : new Date().toISOString().slice(0, 7);
    const items = req.body.items;
    if (!Array.isArray(items)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'items phải là mảng');
    }

    await healthService.upsertDevelopmentAssessments(teacherId, termPeriod, items);
    const rows = await healthService.getDevelopmentAssessments(classId, termPeriod);
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { assessments: rows }, 'Lưu đánh giá phát triển thành công')
    );
  } catch (error) {
    next(error);
  }
};
