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

/**
 * Validate class daily schedule query parameters
 */
export const validateGetClassSchedule = (req, res, next) => {
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
 * Validate get medical requests query parameters
 */
export const validateGetMedicalRequests = (req, res, next) => {
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
 * Validate update medical request status
 */
export const validateUpdateMedicalRequest = (req, res, next) => {
  const { requestId } = req.params;
  const { status, teacherNote } = req.body;

  if (!requestId || isNaN(Number(requestId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'requestId phải là một số hợp lệ'));
  }

  const validStatuses = ['Pending', 'Approved', 'Rejected', 'Completed', 'Chờ duyệt', 'Đã duyệt', 'Không duyệt', 'Đã hoàn thành'];
  if (status && (typeof status !== 'string' || !validStatuses.includes(status))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Trạng thái dặn dò y tế không hợp lệ'));
  }

  if (teacherNote !== undefined && teacherNote !== null && typeof teacherNote !== 'string') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Ghi chú của giáo viên phải là chuỗi ký tự'));
  }

  next();
};

/**
 * Validate create newsfeed post
 */
export const validateCreateNewsfeed = (req, res, next) => {
  const { classId } = req.params;
  const { content, mediaUrl } = req.body;

  const numericClassId = Number(classId);
  if (isNaN(numericClassId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là một số nguyên hợp lệ'));
  }

  if (!content || typeof content !== 'string' || content.trim() === '') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Nội dung bài viết (content) là bắt buộc và phải là chuỗi ký tự'));
  }

  if (mediaUrl !== undefined && mediaUrl !== null && typeof mediaUrl !== 'string') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Đường dẫn phương tiện (mediaUrl) phải là chuỗi ký tự'));
  }

  next();
};

/**
 * Validate get detailed class students
 */
export const validateGetDetailedStudents = (req, res, next) => {
  const { classId } = req.params;

  const numericClassId = Number(classId);
  if (isNaN(numericClassId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là một số nguyên hợp lệ'));
  }

  next();
};

/**
 * Validate update notification read status
 */
export const validateUpdateNotificationRead = (req, res, next) => {
  const { notifId } = req.params;

  if (!notifId || isNaN(Number(notifId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'notifId phải là một số hợp lệ'));
  }

  next();
};

/**
 * Validate get class assessments query parameters
 */
export const validateGetClassAssessments = (req, res, next) => {
  const { classId } = req.params;
  const { month } = req.query;

  if (!classId || isNaN(Number(classId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là một số nguyên hợp lệ'));
  }

  if (!month || !/^(0[1-9]|1[0-2])-\d{4}$/.test(month)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Tháng (month) là bắt buộc và phải có định dạng MM-YYYY (VD: 05-2026)'));
  }

  next();
};

/**
 * Validate submit class assessments
 */
export const validateSubmitClassAssessments = (req, res, next) => {
  const { classId } = req.params;
  const { month, assessments } = req.body;

  if (!classId || isNaN(Number(classId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là một số nguyên hợp lệ'));
  }

  if (!month || !/^(0[1-9]|1[0-2])-\d{4}$/.test(month)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Tháng (month) là bắt buộc và phải có định dạng MM-YYYY'));
  }

  if (!Array.isArray(assessments) || assessments.length === 0) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'assessments phải là một mảng không rỗng'));
  }

  for (let i = 0; i < assessments.length; i++) {
    const item = assessments[i];
    if (!item.studentId || isNaN(Number(item.studentId))) {
      return next(new ApiError(httpStatus.BAD_REQUEST, `Phần tử thứ ${i + 1} trong assessments phải có studentId hợp lệ`));
    }
    
    // Helper to validate score
    const isValidScore = (score) => score === undefined || score === null || (typeof score === 'number' && score >= 1 && score <= 10);
    
    if (!isValidScore(item.physicalScore) || 
        !isValidScore(item.cognitiveScore) || 
        !isValidScore(item.languageScore) || 
        !isValidScore(item.socioEmotionalScore) || 
        !isValidScore(item.aestheticScore)) {
      return next(new ApiError(httpStatus.BAD_REQUEST, `Điểm số tại phần tử thứ ${i + 1} phải là số nguyên từ 1 đến 10`));
    }
  }

  next();
};

/**
 * Validate get weekly rewards query parameters
 */
export const validateGetWeeklyRewards = (req, res, next) => {
  const { classId } = req.params;
  const { weekNumber, year } = req.query;

  if (!classId || isNaN(Number(classId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là một số nguyên hợp lệ'));
  }

  if (weekNumber && isNaN(Number(weekNumber))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'weekNumber phải là một số hợp lệ'));
  }

  if (year && isNaN(Number(year))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'year phải là một số hợp lệ'));
  }

  next();
};

/**
 * Validate award weekly rewards payload
 */
export const validateAwardWeeklyRewards = (req, res, next) => {
  const { classId } = req.params;
  const { weekNumber, year, awards } = req.body;

  if (!classId || isNaN(Number(classId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là một số nguyên hợp lệ'));
  }

  if (weekNumber && isNaN(Number(weekNumber))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'weekNumber phải là một số hợp lệ'));
  }

  if (year && isNaN(Number(year))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'year phải là một số hợp lệ'));
  }

  if (!Array.isArray(awards) || awards.length === 0) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'awards phải là một mảng không rỗng chứa học sinh nhận thưởng'));
  }

  for (let i = 0; i < awards.length; i++) {
    const award = awards[i];
    if (!award.studentId || isNaN(Number(award.studentId))) {
      return next(new ApiError(httpStatus.BAD_REQUEST, `studentId tại phần tử ${i + 1} không hợp lệ`));
    }
  }

  next();
};



/**
 * Validate update schedule status
 */
export const validateUpdateScheduleStatus = (req, res, next) => {
  const { classId, scheduleId } = req.params;
  const { completed } = req.body;

  if (!classId || isNaN(Number(classId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là một số nguyên hợp lệ'));
  }

  if (!scheduleId || isNaN(Number(scheduleId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'scheduleId phải là một số nguyên hợp lệ'));
  }

  if (typeof completed !== 'boolean') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Trường completed là bắt buộc và phải là kiểu boolean'));
  }

  next();
};


/**
 * Validate QR scan
 */
export const validateScanQR = (req, res, next) => {
  const { qrToken } = req.body;

  if (!qrToken || typeof qrToken !== 'string') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'qrToken là bắt buộc và phải là chuỗi'));
  }

  next();
};

/**
 * Validate updating class menu
 */
export const validateUpdateClassMenu = (req, res, next) => {
  const { classId } = req.params;
  const { date, breakfastMenu, lunchMenu, afternoonSnackMenu } = req.body;

  const numericClassId = Number(classId);
  if (isNaN(numericClassId)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là một số nguyên hợp lệ'));
  }

  const numericDate = Number(date);
  if (isNaN(numericDate) || numericDate <= 0) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Ngày cập nhật (date) phải là một số nguyên Unix timestamp hợp lệ'));
  }

  if (typeof breakfastMenu !== 'string' || typeof lunchMenu !== 'string' || typeof afternoonSnackMenu !== 'string') {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Menu các bữa (breakfastMenu, lunchMenu, afternoonSnackMenu) phải là chuỗi ký tự'));
  }

  next();
};
