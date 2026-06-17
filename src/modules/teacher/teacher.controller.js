import * as teacherService from './teacher.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError.js';

/**
 * Get Teacher Dashboard stats
 */
export const getDashboard = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;

    // Get assigned classes
    const classes = await teacherService.getTeacherClasses(teacherId);

    // Calculate today's start timestamp (seconds)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Math.floor(today.getTime() / 1000);

    const classesStats = [];
    for (const cls of classes) {
      const attendance = await teacherService.getClassDashboardStats(cls.classId, todayTimestamp);
      const pendingLeaves = await teacherService.getPendingLeaveRequestsCount(cls.classId);

      classesStats.push({
        classId: cls.classId,
        className: cls.className,
        stats: {
          totalStudents: attendance.totalStudents,
          attendance: {
            present: attendance.present,
            absent: attendance.absent,
            excused: attendance.excused,
            noAttendance: attendance.noAttendance,
          },
          pendingLeavesCount: pendingLeaves,
        },
      });
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        {
          todayDate: todayTimestamp,
          classes: classesStats,
        },
        'Lấy dữ liệu dashboard giáo viên thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get Teacher Profile details
 */
export const getProfile = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const profile = await teacherService.getTeacherProfile(teacherId);

    if (!profile) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hồ sơ giáo viên');
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, profile, 'Lấy thông tin hồ sơ giáo viên thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update Teacher Profile
 */
export const updateProfile = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const updatedProfile = await teacherService.updateTeacherProfile(teacherId, req.body);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, updatedProfile, 'Cập nhật thông tin hồ sơ giáo viên thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get Leave Requests for classes taught by the teacher
 */
export const getLeaveRequests = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { status } = req.query;

    const leaveRequests = await teacherService.getLeaveRequestsForTeacher(teacherId, status);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, leaveRequests, 'Lấy danh sách đơn phép thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Approve or Reject a Leave Request
 */
export const updateLeaveRequestStatus = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { requestId } = req.params;
    const { status } = req.body;

    // Check if the leave request exists
    const leaveRequest = await teacherService.getLeaveRequestById(requestId);
    if (!leaveRequest) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn xin nghỉ phép');
    }

    // Security check: Verify if this teacher is assigned to the student's class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, leaveRequest.classId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền duyệt đơn phép cho học sinh thuộc lớp này');
    }

    // Map status from potential frontend values to DB values if needed
    let dbStatus = status;
    if (status === 'Đã duyệt') dbStatus = 'Approved';
    if (status === 'Không duyệt') dbStatus = 'Rejected';
    if (status === 'Chờ duyệt') dbStatus = 'Pending';

    await teacherService.updateLeaveRequestStatus(requestId, dbStatus, teacherId);

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        { requestId, status: dbStatus },
        'Cập nhật trạng thái đơn phép thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mass submit/update student attendance for a class
 */
export const submitQuickAttendance = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, date, attendanceData } = req.body;

    // Security check: Check if teacher teaches this class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, classId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền điểm danh cho lớp này');
    }

    // Calculate target date timestamp (seconds) at start of day
    let targetTimestamp;
    if (date) {
      const d = new Date(date * 1000);
      d.setHours(0, 0, 0, 0);
      targetTimestamp = Math.floor(d.getTime() / 1000);
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      targetTimestamp = Math.floor(today.getTime() / 1000);
    }

    // Perform upsert for each student
    for (const item of attendanceData) {
      const { studentId, status, checkInTime, checkOutTime, pickedUpBy } = item;

      // Verify student is indeed enrolled in this class
      const isInClass = await teacherService.isStudentInClass(studentId, classId);
      if (!isInClass) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Học sinh với ID ${studentId} không thuộc lớp ${classId}`);
      }

      // Map status from potential frontend/vietnamese values to DB standard values if needed
      let dbStatus = status;
      if (status === 'Có mặt') dbStatus = 'Present';
      if (status === 'Vắng' || status === 'Vắng không phép') dbStatus = 'Absent';
      if (status === 'Phép' || status === 'Vắng có phép') dbStatus = 'Excused';

      await teacherService.upsertAttendance(
        studentId,
        targetTimestamp,
        dbStatus,
        checkInTime || null,
        checkOutTime || null,
        pickedUpBy || null
      );
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Điểm danh nhanh thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed student list for a class with attendance and leave status for a date
 */
export const getClassStudents = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { date } = req.query;

    const numericClassId = Number(classId);

    // Security check: Check if teacher teaches this class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xem danh sách học sinh của lớp này');
    }

    // Calculate target date timestamp (seconds) at start of day
    let targetTimestamp;
    if (date) {
      const d = new Date(Number(date) * 1000);
      d.setHours(0, 0, 0, 0);
      targetTimestamp = Math.floor(d.getTime() / 1000);
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      targetTimestamp = Math.floor(today.getTime() / 1000);
    }

    const students = await teacherService.getClassStudentsAttendance(numericClassId, targetTimestamp);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, students, 'Lấy danh sách học sinh kèm trạng thái điểm danh thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all classes assigned to the logged-in teacher
 */
export const getClasses = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const classes = await teacherService.getTeacherClasses(teacherId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, classes, 'Lấy danh sách lớp học của giáo viên thành công')
    );
  } catch (error) {
    next(error);
  }
};

