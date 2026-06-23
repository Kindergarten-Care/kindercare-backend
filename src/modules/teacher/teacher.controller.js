import httpStatus from 'http-status';
import teacherService from './teacher.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';

const getDetailedStudents = async (req, res, next) => {
    try {
        const classId = parseInt(req.params.classId, 10);

        if (!req.user || !req.user.userId) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Chưa xác thực');
        }

        const teacherId = req.user.userId;

        const isAuthorized = await teacherService.checkTeacherClassAccess(teacherId, classId);
        if (!isAuthorized) {
            throw new ApiError(httpStatus.FORBIDDEN, 'Forbidden - Bạn không có quyền truy cập danh sách học sinh của lớp này.');
        }

        const students = await teacherService.getDetailedStudentList(classId);

        res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, students, 'Detailed student list retrieved successfully')
        );
    } catch (error) {
        next(error);
    }
};

export default {
    getDetailedStudents,
};
