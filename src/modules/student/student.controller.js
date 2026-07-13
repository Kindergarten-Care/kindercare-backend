import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import * as studentService from './student.service.js';

/**
 * GET /api/v1/students/:studentId/attendance-history?month=YYYY-MM
 */
export const getAttendanceHistory = async (req, res, next) => {
  const { studentId } = req.params;
  const { month } = req.query;

  const student = await studentService.getStudentById(studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy học sinh');
  }

  const history = await studentService.getStudentAttendanceHistory(studentId, month);
  res.status(httpStatus.OK).send(
    new ApiResponse(httpStatus.OK, history, 'Tải lịch sử chuyên cần thành công')
  );
};

/**
 * GET /api/v1/students/:studentId/medications/today
 */
export const getMedicationsToday = async (req, res, next) => {
  const { studentId } = req.params;

  const student = await studentService.getStudentById(studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy học sinh');
  }

  const medications = await studentService.getStudentMedicationsToday(studentId);
  res.status(httpStatus.OK).send(
    new ApiResponse(httpStatus.OK, medications, 'Tải danh sách đơn thuốc hôm nay thành công')
  );
};

/**
 * PATCH /api/v1/students/:studentId
 */
export const updateStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const updateBody = req.body;

  const student = await studentService.getStudentById(studentId);
  if (!student) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy học sinh');
  }

  const success = await studentService.updateStudentNicknameAndTeam(studentId, updateBody);
  if (!success) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Cập nhật thông tin học sinh thất bại');
  }

  const updatedStudent = await studentService.getStudentById(studentId);
  res.status(httpStatus.OK).send(
    new ApiResponse(httpStatus.OK, updatedStudent, 'Cập nhật thông tin học sinh thành công')
  );
};
