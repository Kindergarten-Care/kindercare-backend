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

const ensurePositiveInt = (value, name) => {
  const parsed = parseInt(value, 10);
  if (isNaN(parsed) || parsed <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${name} không hợp lệ`);
  }
  return parsed;
};

// -----------------------------------------------------------------------------
// Allergies
// -----------------------------------------------------------------------------

export const listAllergies = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const studentId = ensurePositiveInt(req.params.studentId, 'studentId');

    await healthService.assertStudentBelongsToClass(studentId, classId);
    const rows = await healthService.getAllergiesByStudent(studentId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { allergies: rows }, 'Lấy danh sách dị ứng thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const createAllergy = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const studentId = ensurePositiveInt(req.params.studentId, 'studentId');

    await healthService.assertStudentBelongsToClass(studentId, classId);
    const created = await healthService.createAllergy(studentId, req.body);

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { allergy: created }, 'Thêm dị ứng thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const updateAllergy = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const allergyId = ensurePositiveInt(req.params.allergyId, 'allergyId');

    const existing = await healthService.getAllergyById(allergyId);
    if (!existing) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dị ứng');
    }
    await healthService.assertStudentBelongsToClass(existing.StudentID, classId);

    const updated = await healthService.updateAllergy(allergyId, req.body);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { allergy: updated }, 'Cập nhật dị ứng thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteAllergy = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const allergyId = ensurePositiveInt(req.params.allergyId, 'allergyId');

    const existing = await healthService.getAllergyById(allergyId);
    if (!existing) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dị ứng');
    }
    await healthService.assertStudentBelongsToClass(existing.StudentID, classId);

    await healthService.deleteAllergy(allergyId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { allergyId }, 'Xóa dị ứng thành công')
    );
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// Medications
// -----------------------------------------------------------------------------

export const listMedications = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const studentId = ensurePositiveInt(req.params.studentId, 'studentId');

    await healthService.assertStudentBelongsToClass(studentId, classId);

    const status = req.query.status ? String(req.query.status) : null;
    const rows = await healthService.getMedicationsByStudent(studentId, status);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { medications: rows }, 'Lấy danh sách thuốc thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const createMedication = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const studentId = ensurePositiveInt(req.params.studentId, 'studentId');

    await healthService.assertStudentBelongsToClass(studentId, classId);
    const created = await healthService.createMedication(studentId, req.body, teacherId);

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { medication: created }, 'Thêm thuốc thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const updateMedicationStatus = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const medicationId = ensurePositiveInt(req.params.medicationId, 'medicationId');

    const existing = await healthService.getMedicationById(medicationId);
    if (!existing) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thuốc');
    }
    await healthService.assertStudentBelongsToClass(existing.StudentID, classId);

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

export const deleteMedication = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const medicationId = ensurePositiveInt(req.params.medicationId, 'medicationId');

    const existing = await healthService.getMedicationById(medicationId);
    if (!existing) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thuốc');
    }
    await healthService.assertStudentBelongsToClass(existing.StudentID, classId);

    await healthService.deleteMedication(medicationId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { medicationId }, 'Xóa thuốc thành công')
    );
  } catch (error) {
    next(error);
  }
};

// -----------------------------------------------------------------------------
// Health Logs
// -----------------------------------------------------------------------------

export const listHealthLogs = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const studentId = ensurePositiveInt(req.params.studentId, 'studentId');

    await healthService.assertStudentBelongsToClass(studentId, classId);

    const date = req.query.date ? String(req.query.date) : null;
    const rows = await healthService.getHealthLogsByStudent(studentId, date);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { logs: rows }, 'Lấy nhật ký sức khỏe thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const createHealthLog = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const studentId = ensurePositiveInt(req.params.studentId, 'studentId');

    await healthService.assertStudentBelongsToClass(studentId, classId);
    const created = await healthService.createHealthLog(studentId, req.body, teacherId);

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { log: created }, 'Ghi nhật ký thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const updateHealthLog = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const logId = ensurePositiveInt(req.params.logId, 'logId');

    const existing = await healthService.getHealthLogById(logId);
    if (!existing) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhật ký sức khỏe');
    }
    await healthService.assertStudentBelongsToClass(existing.StudentID, classId);

    const updated = await healthService.updateHealthLog(logId, req.body);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { log: updated }, 'Cập nhật nhật ký thành công')
    );
  } catch (error) {
    next(error);
  }
};

export const deleteHealthLog = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classId = await ensureClassAccess(teacherId, req.params.classId);
    const logId = ensurePositiveInt(req.params.logId, 'logId');

    const existing = await healthService.getHealthLogById(logId);
    if (!existing) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy nhật ký sức khỏe');
    }
    await healthService.assertStudentBelongsToClass(existing.StudentID, classId);

    await healthService.deleteHealthLog(logId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { logId }, 'Xóa nhật ký thành công')
    );
  } catch (error) {
    next(error);
  }
};