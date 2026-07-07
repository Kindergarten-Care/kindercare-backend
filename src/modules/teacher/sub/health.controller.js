import * as healthService from './health.service.js';
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

// -----------------------------------------------------------------------------
// Health Records
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