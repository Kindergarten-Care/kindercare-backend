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

    // Calculate today's start timestamp (seconds) in UTC midnight of the local day
    const today = new Date();
    const todayTimestamp = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 1000);

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
 * Get details of a specific leave request
 */
export const getLeaveRequestDetail = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { requestId } = req.params;

    const leaveRequest = await teacherService.getLeaveRequestDetail(requestId, teacherId);

    if (!leaveRequest) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy đơn xin nghỉ phép hoặc bạn không có quyền xem đơn này');
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, leaveRequest, 'Lấy chi tiết đơn phép thành công')
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

    // Push notification to parent
    if (leaveRequest.ParentID) {
      const parentIds = await teacherService.getStudentParentsUserIds(leaveRequest.StudentID);
      for (const parentId of parentIds) {
        let statusText = '';
        if (dbStatus === 'Approved') statusText = 'đã được duyệt';
        if (dbStatus === 'Rejected') statusText = 'bị từ chối';
        
        if (statusText) {
          await teacherService.pushNotification(
            parentId,
            'Cập nhật Đơn xin phép',
            `Đơn xin phép nghỉ học của bé ${statusText}.`,
            'LeaveRequest',
            `/leave-requests/${requestId}`
          );
        }
      }
    }

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

    // Calculate target date timestamp (seconds) at start of day in UTC
    let targetTimestamp;
    if (date) {
      const d = new Date(Number(date) * 1000);
      targetTimestamp = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);
    } else {
      const today = new Date();
      targetTimestamp = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 1000);
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

      // Push notification to parent if student is absent or excused
      if (dbStatus === 'Absent' || dbStatus === 'Excused') {
        const parentIds = await teacherService.getStudentParentsUserIds(studentId);
        for (const parentId of parentIds) {
          const statusText = dbStatus === 'Absent' ? 'Vắng mặt không phép' : 'Vắng mặt có phép';
          await teacherService.pushNotification(
            parentId,
            'Thông báo Điểm danh',
            `Học sinh vắng mặt ngày hôm nay (${statusText}). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.`,
            'Attendance',
            `/attendance/${targetTimestamp}`
          );
        }
      }
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

    // Calculate target date timestamp (seconds) at start of day in UTC
    let targetTimestamp;
    if (date) {
      const d = new Date(Number(date) * 1000);
      targetTimestamp = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);
    } else {
      const today = new Date();
      targetTimestamp = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 1000);
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

/**
 * Get class meal menu for a date
 */
export const getClassMenu = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { date } = req.query;

    const numericClassId = Number(classId);

    // Security check: Check if teacher teaches this class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xem thông tin thực đơn của lớp này');
    }

    // Calculate target date timestamp (seconds) at start of day in UTC
    let targetTimestamp;
    if (date) {
      const d = new Date(Number(date) * 1000);
      targetTimestamp = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);
    } else {
      const today = new Date();
      targetTimestamp = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 1000);
    }

    const menu = await teacherService.getClassMenu(numericClassId, targetTimestamp);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, menu, 'Lấy thực đơn lớp học thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mass submit/update student meal logs for a class
 */
export const submitQuickMealLogs = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId, date, mealData } = req.body;

    // Security check: Check if teacher teaches this class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, classId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền ghi nhận bữa ăn cho lớp này');
    }

    // Calculate target date timestamp (seconds) at start of day in UTC
    let targetTimestamp;
    if (date) {
      const d = new Date(Number(date) * 1000);
      targetTimestamp = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);
    } else {
      const today = new Date();
      targetTimestamp = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 1000);
    }

    // Perform upsert for each student's meal status
    for (const item of mealData) {
      const { studentId, eatingStatus } = item;

      // Verify student is indeed enrolled in this class
      const isInClass = await teacherService.isStudentInClass(studentId, classId);
      if (!isInClass) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Học sinh với ID ${studentId} không thuộc lớp ${classId}`);
      }

      await teacherService.upsertStudentMealLog(studentId, targetTimestamp, eatingStatus);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Ghi nhận bữa ăn thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get class daily schedule for a date
 */
export const getClassSchedule = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { date } = req.query;

    const numericClassId = Number(classId);

    // Security check: Check if teacher teaches this class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xem lịch trình sinh hoạt của lớp này');
    }

    // Calculate target date timestamp (seconds) at start of day in UTC
    let targetTimestamp;
    if (date) {
      const d = new Date(Number(date) * 1000);
      targetTimestamp = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);
    } else {
      const today = new Date();
      targetTimestamp = Math.floor(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()) / 1000);
    }

    const schedule = await teacherService.getClassSchedule(numericClassId, targetTimestamp);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, schedule, 'Lấy lịch trình sinh hoạt lớp học thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get Medical Requests for a class
 */
export const getMedicalRequests = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { date } = req.query;

    const numericClassId = Number(classId);

    // Security check: Check if teacher teaches this class
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xem dặn dò y tế của lớp này');
    }

    let targetTimestamp = null;
    if (date) {
      const d = new Date(Number(date) * 1000);
      targetTimestamp = Math.floor(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) / 1000);
    }

    const requests = await teacherService.getMedicalRequests(numericClassId, targetTimestamp);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, requests, 'Lấy danh sách dặn dò y tế thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Update Medical Request Status
 */
export const updateMedicalRequestStatus = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { requestId } = req.params;
    const { status, teacherNote } = req.body;

    const request = await teacherService.getMedicalRequestById(requestId);
    if (!request) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy dặn dò y tế');
    }

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, request.classId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền cập nhật dặn dò y tế cho lớp này');
    }

    await teacherService.updateMedicalRequestStatus(requestId, status, teacherNote);

    // Push notification to parent
    if (request.ParentID) {
      const parentIds = await teacherService.getStudentParentsUserIds(request.StudentID);
      for (const parentId of parentIds) {
        await teacherService.pushNotification(
          parentId,
          'Cập nhật Dặn dò y tế',
          `Giáo viên đã cập nhật trạng thái dặn dò y tế thành: ${status}. Ghi chú: ${teacherNote || ''}`,
          'Health',
          `/medical-requests/${requestId}`
        );
      }
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Cập nhật dặn dò y tế thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Create a Newsfeed post
 */
export const createNewsfeed = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { content, mediaUrl } = req.body;

    const numericClassId = Number(classId);

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền tạo nhật ký cho lớp này');
    }

    const postId = await teacherService.createNewsfeedPost(numericClassId, teacherId, content, mediaUrl);

    // Push notification to all parents in the class
    const parentIds = await teacherService.getClassParentsUserIds(numericClassId);
    for (const parentId of parentIds) {
      await teacherService.pushNotification(
        parentId,
        'Bài đăng mới từ lớp học',
        'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!',
        'Newsfeed',
        `/newsfeed/${postId}`
      );
    }

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { postId }, 'Tạo bài đăng nhật ký thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed students for a class
 */
export const getDetailedClassStudents = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const numericClassId = Number(classId);

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xem thông tin chi tiết lớp này');
    }

    const students = await teacherService.getClassDetailedStudents(numericClassId);

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK, 
        { classId: numericClassId, totalStudents: students.length, students }, 
        'Lấy danh sách chi tiết học sinh thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get Notifications for Teacher
 */
export const getNotifications = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const notifications = await teacherService.getTeacherNotifications(teacherId);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, notifications, 'Lấy danh sách thông báo thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Mark Notification as Read
 */
export const markAsRead = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { notifId } = req.params;

    const numericNotifId = Number(notifId);

    const success = await teacherService.markNotificationAsRead(numericNotifId, teacherId);
    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thông báo hoặc thông báo này không thuộc về bạn');
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Đã đánh dấu thông báo là đã đọc')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get class student assessments for a specific month
 */
export const getClassAssessments = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { month } = req.query;

    const numericClassId = Number(classId);

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền xem dữ liệu của lớp này');
    }

    const students = await teacherService.getClassAssessments(numericClassId, month);

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK, 
        { classId: numericClassId, month, students }, 
        'Lấy danh sách đánh giá học sinh thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Submit or update class assessments (Phiếu bé ngoan)
 */
export const submitClassAssessments = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { month, assessments } = req.body;

    const numericClassId = Number(classId);

    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền thao tác trên lớp này');
    }

    // Process each assessment
    for (const item of assessments) {
      const { 
        studentId, 
        physicalScore, 
        cognitiveScore, 
        languageScore, 
        socioEmotionalScore, 
        aestheticScore, 
        teacherComment 
      } = item;

      // Verify student is indeed enrolled in this class
      const isInClass = await teacherService.isStudentInClass(studentId, numericClassId);
      if (!isInClass) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Học sinh với ID ${studentId} không thuộc lớp ${numericClassId}`);
      }

      await teacherService.upsertStudentAssessment(
        studentId, 
        month, 
        physicalScore, 
        cognitiveScore, 
        languageScore, 
        socioEmotionalScore, 
        aestheticScore, 
        teacherComment
      );

      // Push notification to parents
      const parentIds = await teacherService.getStudentParentsUserIds(studentId);
      for (const parentId of parentIds) {
        await teacherService.pushNotification(
          parentId,
          'Cập nhật Phiếu Bé Ngoan',
          `Giáo viên đã cập nhật Phiếu Bé Ngoan / Đánh giá tháng ${month} của bé.`,
          'StudentAssessment',
          `/students/${studentId}/assessments?month=${month}`
        );
      }
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Cập nhật phiếu bé ngoan thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get all available reward badges
 */
export const getRewardBadges = async (req, res, next) => {
  try {
    const badges = await teacherService.getRewardBadges();
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, badges, 'Lấy danh sách huy hiệu thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Get Weekly Rewards for a class
 */
export const getWeeklyRewards = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { weekNumber, year } = req.query;

    const numericClassId = Number(classId);

    // Security check
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập lớp này');
    }

    const currentWeek = weekNumber ? Number(weekNumber) : 1; // Simplification, you might calculate real week
    const currentYear = year ? Number(year) : new Date().getFullYear();

    const rewards = await teacherService.getWeeklyRewards(numericClassId, currentWeek, currentYear);
    
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, rewards, 'Lấy danh sách đánh giá tuần thành công')
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Batch award Weekly Rewards
 */
export const awardWeeklyRewards = async (req, res, next) => {
  try {
    const teacherId = req.user.userId;
    const { classId } = req.params;
    const { weekNumber, year, awards } = req.body;

    const numericClassId = Number(classId);

    // Security check
    const isAssigned = await teacherService.isTeacherAssignedToClass(teacherId, numericClassId);
    if (!isAssigned) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền thực hiện trên lớp này');
    }

    const currentWeek = weekNumber ? Number(weekNumber) : 1;
    const currentYear = year ? Number(year) : new Date().getFullYear();

    await teacherService.awardWeeklyRewards(numericClassId, currentWeek, currentYear, awards);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Phát phiếu bé ngoan thành công')
    );
  } catch (error) {
    next(error);
  }
};

