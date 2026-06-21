import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';

/**
 * Validate teacher profile update input
 */
export const validateUpdateProfile = (req, res, next) => {
  const { fullName, phoneNumber, email, dateOfBirth, gender, idCard, address, avatarUrl } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Họ và tên là bắt buộc và phải là chuỗi ký tự hợp lệ'));
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Email không đúng định dạng'));
  }

  if (phoneNumber && !/^[0-9]{9,11}$/.test(phoneNumber)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Số điện thoại không hợp lệ, phải gồm 9 - 11 chữ số'));
  }

  if (dateOfBirth !== undefined && dateOfBirth !== null && (typeof dateOfBirth !== 'number' || dateOfBirth < 0)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Ngày sinh phải là số nguyên (Unix timestamp)'));
  }

  if (gender && typeof gender !== 'string') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Giới tính phải là chuỗi ký tự'));
  }

  if (idCard && typeof idCard !== 'string') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Số CMND/CCCD phải là chuỗi ký tự'));
  }

  if (address && typeof address !== 'string') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Địa chỉ phải là chuỗi ký tự'));
  }

  if (avatarUrl && typeof avatarUrl !== 'string') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Đường dẫn ảnh đại diện phải là chuỗi ký tự'));
  }

  next();
};

/**
 * Validate bulk quick attendance input
 */
export const validateQuickAttendance = (req, res, next) => {
  const { classId, date, attendanceData } = req.body;

  if (!classId || typeof classId !== 'number') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId là bắt buộc và phải là số'));
  }

  if (date !== undefined && date !== null && (typeof date !== 'number' || date < 0)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Ngày điểm danh (date) phải là số nguyên (Unix timestamp)'));
  }

  if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'attendanceData là bắt buộc và phải là danh sách (Array) không rỗng'));
  }

  const validStatuses = ['Present', 'Absent', 'Excused', 'Có mặt', 'Vắng', 'Vắng không phép', 'Vắng có phép', 'Phép'];
  for (let i = 0; i < attendanceData.length; i++) {
    const item = attendanceData[i];
    if (!item.studentId || typeof item.studentId !== 'number') {
      return next(new ApiError(httpStatus.BAD_REQUEST, `Phần tử thứ ${i + 1} có studentId không hợp lệ`));
    }
    if (!item.status || typeof item.status !== 'string' || !validStatuses.includes(item.status)) {
      return next(new ApiError(httpStatus.BAD_REQUEST, `Phần tử thứ ${i + 1} có trạng thái điểm danh không hợp lệ (Nhận: Present, Absent, Excused, Có mặt, Vắng, Phép,...)`));
    }
    if (item.checkInTime && typeof item.checkInTime !== 'number') {
      return next(new ApiError(httpStatus.BAD_REQUEST, `Phần tử thứ ${i + 1} có checkInTime không hợp lệ`));
    }
    if (item.checkOutTime && typeof item.checkOutTime !== 'number') {
      return next(new ApiError(httpStatus.BAD_REQUEST, `Phần tử thứ ${i + 1} có checkOutTime không hợp lệ`));
    }
    if (item.pickedUpBy && typeof item.pickedUpBy !== 'string') {
      return next(new ApiError(httpStatus.BAD_REQUEST, `Phần tử thứ ${i + 1} có pickedUpBy không hợp lệ`));
    }
  }

  next();
};

/**
 * Validate leave request status update
 */
export const validateUpdateLeaveRequestStatus = (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['Approved', 'Rejected', 'Pending', 'Đã duyệt', 'Không duyệt', 'Chờ duyệt'];

  if (!status || typeof status !== 'string' || !validStatuses.includes(status)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Trạng thái duyệt đơn không hợp lệ (Nhận: Approved, Rejected,...)'));
  }

  next();
};

/**
 * Validate leave request detail
 */
export const validateGetLeaveRequestDetail = (req, res, next) => {
  const { requestId } = req.params;

  if (!requestId || isNaN(Number(requestId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'requestId phải là một số hợp lệ'));
  }

  next();
};

/**
 * Validate class student list input parameters
 */
export const validateGetClassStudents = (req, res, next) => {
  const { classId } = req.params;
  const { date } = req.query;

  const numericClassId = Number(classId);
  if (isNaN(numericClassId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là một số nguyên hợp lệ'));
  }

  if (date !== undefined && date !== null) {
    const numericDate = Number(date);
    if (isNaN(numericDate) || numericDate < 0) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Ngày lọc (date) phải là một số nguyên Unix timestamp hợp lệ'));
    }
  }

  next();
};

/**
 * Validate class menu list input parameters
 */
export const validateGetClassMenu = (req, res, next) => {
  const { classId } = req.params;
  const { date } = req.query;

  const numericClassId = Number(classId);
  if (isNaN(numericClassId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là một số nguyên hợp lệ'));
  }

  if (date !== undefined && date !== null) {
    const numericDate = Number(date);
    if (isNaN(numericDate) || numericDate < 0) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Ngày lọc (date) phải là một số nguyên Unix timestamp hợp lệ'));
    }
  }

  next();
};

/**
 * Validate quick meal logs submission
 */
export const validateQuickMealLogs = (req, res, next) => {
  const { classId, date, mealData } = req.body;

  if (!classId || isNaN(Number(classId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId là bắt buộc và phải là số hợp lệ'));
  }

  if (date !== undefined && date !== null) {
    const numericDate = Number(date);
    if (isNaN(numericDate) || numericDate < 0) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'Ngày (date) phải là một số nguyên Unix timestamp hợp lệ'));
    }
  }

  if (!Array.isArray(mealData)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'mealData phải là một mảng dữ liệu bữa ăn'));
  }

  for (let i = 0; i < mealData.length; i++) {
    const item = mealData[i];
    if (!item.studentId || isNaN(Number(item.studentId))) {
      return next(new ApiError(httpStatus.BAD_REQUEST, `Phần tử thứ ${i + 1} trong mealData phải có studentId hợp lệ`));
    }
    if (!item.eatingStatus || typeof item.eatingStatus !== 'string') {
      return next(new ApiError(httpStatus.BAD_REQUEST, `Phần tử thứ ${i + 1} trong mealData phải có eatingStatus hợp lệ`));
    }
  }

  next();
};

