import * as teacherService from './teacher.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';

const scanAttendance = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;
    const teacherId = req.user.userId;

    if (roleId !== 3) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ giáo viên mới có quyền thực hiện hành động này');
    }

    const { qrToken } = req.body;

    if (!qrToken) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'qrToken là bắt buộc');
    }

    const result = await teacherService.processAttendanceScan(qrToken);

    logger.info(`Teacher ID ${teacherId} scanned QR for Student ID ${result.studentId} — ${result.attendanceType} at ${result.time}`);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Điểm danh thành công')
    );
  } catch (error) {
    next(error);
  }
};

export default { scanAttendance };
