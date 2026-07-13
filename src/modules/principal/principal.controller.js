import * as principalService from './principal.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';

const getMyProfile = async (req, res, next) => {
  try {
    const principalId = req.user.userId;
    const roleId = req.user.roleId;

    // Double check authorization (safety check)
    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền truy cập thông tin này');
    }

    const principal = await principalService.getPrincipalProfileById(principalId);

    if (!principal) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thông tin hiệu trưởng');
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        principal,
        'Lấy thông tin hiệu trưởng thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getTeachersList = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;

    // Double check authorization (safety check)
    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền truy cập danh sách giáo viên');
    }

    const teachers = await principalService.getTeachersList();

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        teachers,
        'Lấy danh sách tài khoản giáo viên thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getParentsList = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;

    // Double check authorization (safety check)
    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền truy cập danh sách phụ huynh');
    }

    const parents = await principalService.getParentsList();

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        parents,
        'Lấy danh sách tài khoản phụ huynh thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getAccountsByRole = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;

    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền truy cập danh sách tài khoản');
    }

    const { role } = req.query;

    if (!role) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Thiếu tham số ?role=. Giá trị hợp lệ: teacher, parent');
    }

    const normalizedRole = String(role).toLowerCase().trim();
    const roleIdValue = principalService.ROLE_NAME_TO_ID[normalizedRole];

    if (!roleIdValue) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        `Giá trị 'role' không hợp lệ. Chỉ chấp nhận: ${Object.keys(principalService.ROLE_NAME_TO_ID).join(', ')}`
      );
    }

    const accounts = await principalService.getAccountsByRole(roleIdValue);

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        accounts,
        `Lấy danh sách tài khoản ${normalizedRole} thành công`
      )
    );
  } catch (error) {
    next(error);
  }
};

/**
 * Validate id từ URL param: phải là số nguyên dương.
 * Trả về number, hoặc throw 400 nếu sai.
 */
const parsePositiveIntId = (rawId) => {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'ID không hợp lệ - phải là số nguyên dương');
  }
  return id;
};

const getTeacherDetail = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;
    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền truy cập chi tiết giáo viên');
    }

    const id = parsePositiveIntId(req.params.id);
    const teacher = await principalService.getTeacherDetail(id);

    if (!teacher) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy giáo viên với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        teacher,
        'Lấy thông tin chi tiết giáo viên thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getParentDetail = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;
    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền truy cập chi tiết phụ huynh');
    }

    const id = parsePositiveIntId(req.params.id);
    const parent = await principalService.getParentDetail(id);

    if (!parent) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy phụ huynh với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        parent,
        'Lấy thông tin chi tiết phụ huynh thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getStudentDetail = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;
    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền truy cập chi tiết học sinh');
    }

    const id = parsePositiveIntId(req.params.id);
    const student = await principalService.getStudentDetail(id);

    if (!student) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy học sinh với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        student,
        'Lấy thông tin chi tiết học sinh thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const updateStudent = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;
    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền sửa thông tin học sinh');
    }

    const id = parsePositiveIntId(req.params.id);
    const { fullName, dateOfBirth, gender, allergies, avatarUrl } = req.body;

    if ([fullName, dateOfBirth, gender, allergies, avatarUrl].every((v) => v === undefined)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cần ít nhất một trong các trường: fullName, dateOfBirth, gender, allergies, avatarUrl');
    }

    const success = await principalService.updateStudent(id, { fullName, dateOfBirth, gender, allergies, avatarUrl });

    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy học sinh với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Cập nhật thông tin học sinh thành công')
    );
  } catch (error) {
    next(error);
  }
};

const resetAccountPassword = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;
    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền reset mật khẩu');
    }

    const id = parsePositiveIntId(req.params.id);
    const success = await principalService.resetAccountPassword(id);

    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy tài khoản với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        null,
        'Reset mật khẩu thành công (Mặc định: 123456)'
      )
    );
  } catch (error) {
    next(error);
  }
};

const lockAccount = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;
    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền thao tác');
    }

    const id = parsePositiveIntId(req.params.id);
    const success = await principalService.lockAccount(id);

    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy tài khoản với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Khóa tài khoản thành công')
    );
  } catch (error) {
    next(error);
  }
};

const unlockAccount = async (req, res, next) => {
  try {
    const roleId = req.user.roleId;
    if (roleId !== 2) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ hiệu trưởng mới có quyền thao tác');
    }

    const id = parsePositiveIntId(req.params.id);
    const success = await principalService.unlockAccount(id);

    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy tài khoản với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Mở khóa tài khoản thành công')
    );
  } catch (error) {
    next(error);
  }
};

const getClassDetail = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Class ID không hợp lệ');
    }

    const classDetail = await principalService.getClassDetail(id);
    if (!classDetail) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy lớp học với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, classDetail, 'Lấy thông tin chi tiết lớp học thành công')
    );
  } catch (error) {
    next(error);
  }
};

const getGradesAndClasses = async (req, res, next) => {
  try {
    const grades = await principalService.getGradesAndClasses();
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, grades, 'Lấy danh sách khối và lớp thành công')
    );
  } catch (error) {
    next(error);
  }
};

const createGradeAndClasses = async (req, res, next) => {
  try {
    const { gradeName, classes } = req.body;
    
    if (!gradeName) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tên khối (gradeName) là bắt buộc');
    }

    const gradeId = await principalService.createGradeAndClasses(gradeName, classes);
    
    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { gradeId }, 'Tạo khối/lớp thành công')
    );
  } catch (error) {
    next(error);
  }
};

const createAccount = async (req, res, next) => {
  try {
    const { role } = req.query;
    if (!role || (role !== 'teacher' && role !== 'parent')) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tham số ?role= phải là teacher hoặc parent');
    }

    let { username, fullName, phoneNumber, email, gender } = req.body;

    if (role === 'parent') {
      if (!phoneNumber) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'phoneNumber là bắt buộc đối với phụ huynh');
      }
      username = phoneNumber; // Tự động gán username bằng sđt cho phụ huynh
    }

    if (!username || !fullName) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'username và fullName là bắt buộc');
    }

    if (gender !== undefined && !['Nam', 'Nữ', 'Khác'].includes(gender)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'gender phải là một trong: Nam, Nữ, Khác');
    }

    const userId = await principalService.createAccount(role, { username, fullName, phoneNumber, email, gender });

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { userId, role }, 'Tạo tài khoản thành công')
    );
  } catch (error) {
    next(error);
  }
};


const assignTeacherToClass = async (req, res, next) => {
  try {
    const { classId, teacherId, roleInClass, assignedDate } = req.body;
    if (!classId || !teacherId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'classId và teacherId là bắt buộc');
    }
    await principalService.assignTeacherToClass(classId, teacherId, roleInClass, assignedDate);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, null, 'Bổ nhiệm giáo viên thành công'));
  } catch (error) {
    next(error);
  }
};

const assignStudentsToClass = async (req, res, next) => {
  try {
    const { studentIds, classId } = req.body;
    if (!Array.isArray(studentIds) || !classId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'studentIds (mảng) và classId là bắt buộc');
    }
    await principalService.assignStudentsToClass(studentIds, classId);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, null, 'Xếp lớp học sinh thành công'));
  } catch (error) {
    next(error);
  }
};

const endAcademicYear = async (req, res, next) => {
  try {
    const result = await principalService.endAcademicYear();
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, result, 'Tổng kết năm học thành công'));
  } catch (error) {
    next(error);
  }
};

  const startAcademicYear = async (req, res, next) => {
    try {
      const { yearName, startDate, endDate } = req.body;
      const monthlyTuition = req.body.monthlyTuition || 0;
      const dailyMealFee = req.body.dailyMealFee || 0;
      const isActive = req.body.isActive !== undefined ? req.body.isActive : true;
      
      if (!yearName || !startDate || !endDate) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Thiếu thông tin năm học');
      }
      const result = await principalService.startAcademicYear({ yearName, startDate, endDate, monthlyTuition, dailyMealFee, isActive });
      res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, result, 'Bắt đầu năm học mới thành công'));
  } catch (error) {
    next(error);
  }
};

const getUnassignedStudents = async (req, res, next) => {
  try {
    const students = await principalService.getUnassignedStudents();
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, students, 'Lấy danh sách học sinh chưa xếp lớp thành công'));
  } catch (error) {
    next(error);
  }
};

const getAcademicYears = async (req, res, next) => {
  try {
    const years = await principalService.getAcademicYears();
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, years, 'Lấy danh sách năm học thành công'));
  } catch (error) {
    next(error);
  }
};

const activateAcademicYear = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await principalService.activateAcademicYear(id);
    res.status(httpStatus.OK).json(new ApiResponse(httpStatus.OK, result, result.message));
  } catch (error) {
    next(error);
  }
};

const getAllStudents = async (req, res, next) => {
  try {
    const students = await principalService.getAllStudents();
    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

const getEvents = async (req, res, next) => {
  try {
    const { eventType } = req.query;
    const data = await principalService.getEvents({ eventType });
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, data, 'Lấy danh sách sự kiện thành công')
    );
  } catch (error) {
    next(error);
  }
};

const createEvent = async (req, res, next) => {
  try {
    const { title, description, startTime, endTime, location, status, eventType, classIds, studentIds } = req.body;
    const createdBy = req.user.userId;

    if (!title || !startTime || !endTime || !eventType) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng cung cấp title, startTime, endTime và eventType');
    }

    const data = await principalService.createEvent({
      title,
      description,
      startTime,
      endTime,
      location,
      status,
      eventType,
      createdBy,
      classIds,
      studentIds,
    });

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, data, 'Tạo sự kiện thành công')
    );
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const { title, description, startTime, endTime, location, status, eventType, classIds, studentIds } = req.body;

    if ([title, description, startTime, endTime, location, status, eventType, classIds, studentIds].every((v) => v === undefined)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cần ít nhất một trường để cập nhật');
    }

    const data = await principalService.updateEvent(id, {
      title,
      description,
      startTime,
      endTime,
      location,
      status,
      eventType,
      classIds,
      studentIds,
    });

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, data, 'Cập nhật sự kiện thành công')
    );
  } catch (error) {
    next(error);
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const result = await principalService.deleteEvent(id);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, result.message)
    );
  } catch (error) {
    next(error);
  }
};

const getHolidays = async (req, res, next) => {
  try {
    const { yearId } = req.query;
    const data = await principalService.getHolidays({ yearId });
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, data, 'Lấy danh sách ngày nghỉ lễ thành công')
    );
  } catch (error) {
    next(error);
  }
};

const createHoliday = async (req, res, next) => {
  try {
    const { holidayDate, holidayName, yearId } = req.body;

    if (!holidayDate) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng cung cấp holidayDate');
    }

    const data = await principalService.createHoliday({ holidayDate, holidayName, yearId });

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, data, 'Tạo ngày nghỉ lễ thành công')
    );
  } catch (error) {
    next(error);
  }
};

const updateHoliday = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const { holidayDate, holidayName, yearId } = req.body;

    if (holidayDate === undefined && holidayName === undefined && yearId === undefined) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cần ít nhất một trong các trường: holidayDate, holidayName, yearId');
    }

    const success = await principalService.updateHoliday(id, { holidayDate, holidayName, yearId });

    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy ngày nghỉ lễ với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Cập nhật ngày nghỉ lễ thành công')
    );
  } catch (error) {
    next(error);
  }
};

const deleteHoliday = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const success = await principalService.deleteHoliday(id);

    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy ngày nghỉ lễ với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Xóa ngày nghỉ lễ thành công')
    );
  } catch (error) {
    next(error);
  }
};

const getMonthlySchedules = async (req, res, next) => {
  try {
    const { year, month, approvedStatus, classId } = req.query;
    const data = await principalService.getMonthlySchedules({
      year: year !== undefined ? parseInt(year, 10) : undefined,
      month: month !== undefined ? parseInt(month, 10) : undefined,
      approvedStatus: approvedStatus !== undefined ? parseInt(approvedStatus, 10) : undefined,
      classId: classId !== undefined ? parseInt(classId, 10) : undefined,
    });
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, data, 'Lấy danh sách thời khóa biểu tháng thành công')
    );
  } catch (error) {
    next(error);
  }
};

const getMonthlyScheduleDetail = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const data = await principalService.getMonthlyScheduleDetail(id);

    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy thời khóa biểu tháng với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, data, 'Lấy chi tiết thời khóa biểu tháng thành công')
    );
  } catch (error) {
    next(error);
  }
};

const approveMonthlySchedule = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const { approvedStatus } = req.body;

    if (approvedStatus !== 0 && approvedStatus !== 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'approvedStatus phải là 0 (chưa duyệt) hoặc 1 (đã duyệt)');
    }

    const result = await principalService.approveMonthlySchedule(id, approvedStatus);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, result.message)
    );
  } catch (error) {
    next(error);
  }
};

const activeMonthlySchedule = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const isActive = req.body.isActive !== undefined ? req.body.isActive : true;

    const result = await principalService.activeMonthlySchedule(id, isActive);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, result.message)
    );
  } catch (error) {
    next(error);
  }
};

const getMenus = async (req, res, next) => {
  try {
    const { classId, year, weekNumber } = req.query;
    const data = await principalService.getMenus({
      classId: classId !== undefined ? parseInt(classId, 10) : undefined,
      year: year !== undefined ? parseInt(year, 10) : undefined,
      weekNumber: weekNumber !== undefined ? parseInt(weekNumber, 10) : undefined,
    });
    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, data, 'Lấy danh sách thực đơn thành công')
    );
  } catch (error) {
    next(error);
  }
};

const getMenuDetail = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const data = await principalService.getMenuDetail(id);

    if (!data) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy thực đơn với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, data, 'Lấy chi tiết thực đơn thành công')
    );
  } catch (error) {
    next(error);
  }
};

const deleteMenu = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const success = await principalService.deleteMenu(id);

    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy thực đơn với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Xóa thực đơn thành công')
    );
  } catch (error) {
    next(error);
  }
};

const importMenus = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng upload ít nhất 1 file CSV/XLSX thực đơn');
    }

    const results = await principalService.importMenus(req.files);
    const allSuccess = results.every((r) => r.success);

    res.status(allSuccess ? httpStatus.CREATED : httpStatus.BAD_REQUEST).json(
      new ApiResponse(
        allSuccess ? httpStatus.CREATED : httpStatus.BAD_REQUEST,
        results,
        allSuccess ? 'Import thực đơn thành công' : 'Import thất bại — xem chi tiết lỗi từng file'
      )
    );
  } catch (error) {
    next(error);
  }
};

const searchParentsByPhone = async (req, res, next) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).json({ success: false, message: 'Số điện thoại là bắt buộc' });
    }
    const parent = await principalService.searchParentsByPhone(phone);
    res.status(200).json({
      success: true,
      data: parent, // null if not found
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentConfigs = async (req, res, next) => {
  try {
    const data = await principalService.getPaymentConfigs();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFees = async (req, res, next) => {
  try {
    const data = await principalService.getAllFees();
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const createExtracurricular = async (req, res, next) => {
  try {
    const { name, monthlyFee, description } = req.body;

    if (!name || monthlyFee === undefined) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cần truyền name và monthlyFee');
    }

    const data = await principalService.createExtracurricular({ name, monthlyFee, description });

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, data, 'Tạo hoạt động ngoại khóa thành công')
    );
  } catch (error) {
    next(error);
  }
};

const updateExtracurricular = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const { name, monthlyFee, description } = req.body;

    if (name === undefined && monthlyFee === undefined && description === undefined) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cần ít nhất một trong các trường: name, monthlyFee, description');
    }

    const success = await principalService.updateExtracurricular(id, { name, monthlyFee, description });

    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy hoạt động ngoại khóa với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Cập nhật hoạt động ngoại khóa thành công')
    );
  } catch (error) {
    next(error);
  }
};

const updateBaseFee = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const { monthlyTuition, dailyMealFee } = req.body;

    if (monthlyTuition === undefined && dailyMealFee === undefined) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cần ít nhất một trong các trường: monthlyTuition, dailyMealFee');
    }

    const success = await principalService.updateBaseFee(id, { monthlyTuition, dailyMealFee });

    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy biểu phí với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Cập nhật biểu phí thành công')
    );
  } catch (error) {
    next(error);
  }
};

const createPaymentPackage = async (req, res, next) => {
  try {
    const { name, duration, discount } = req.body;

    if (!name || duration === undefined) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cần truyền name và duration');
    }

    const data = await principalService.createPaymentPackage({ name, duration, discount });

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, data, 'Tạo gói học phí thành công')
    );
  } catch (error) {
    next(error);
  }
};

const updatePaymentPackage = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const { name, duration, discount } = req.body;

    if (name === undefined && duration === undefined && discount === undefined) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Cần ít nhất một trong các trường: name, duration, discount');
    }

    const success = await principalService.updatePaymentPackage(id, { name, duration, discount });

    if (!success) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy gói học phí với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, null, 'Cập nhật gói học phí thành công')
    );
  } catch (error) {
    next(error);
  }
};

const getInvoices = async (req, res, next) => {
  try {
    const { studentId, billingMonth, paymentStatus, invoiceType } = req.query;
    const data = await principalService.getInvoices({ studentId, billingMonth, paymentStatus, invoiceType });
    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

const getInvoiceDetail = async (req, res, next) => {
  try {
    const id = parsePositiveIntId(req.params.id);
    const invoice = await principalService.getInvoiceDetail(id);

    if (!invoice) {
      throw new ApiError(httpStatus.NOT_FOUND, `Không tìm thấy hóa đơn với id = ${id}`);
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, invoice, 'Lấy thông tin chi tiết hóa đơn thành công')
    );
  } catch (error) {
    next(error);
  }
};

const enrollStudent = async (req, res, next) => {
  try {
    const result = await principalService.enrollStudent(req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Đã tạo hồ sơ học sinh thành công'
    });
  } catch (error) {
    next(error);
  }
};

const addParentToStudent = async (req, res, next) => {
  try {
    const { id: studentId } = req.params;
    const result = await principalService.addParentToStudent(studentId, req.body);
    res.status(201).json({
      success: true,
      data: result,
      message: 'Đã thêm phụ huynh thành công'
    });
  } catch (error) {
    next(error);
  }
};

const importStudents = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Vui lòng upload file CSV hoặc XLSX' });
    }
    const { imported, tuitionPlansCreated } = await principalService.importStudentsFromCSV(req.file.buffer, req.file.originalname);
    res.status(201).json({
      success: true,
      message: `Đã import thành công ${imported} học sinh (${tuitionPlansCreated} học sinh được đăng ký gói học phí)`,
      data: { imported, tuitionPlansCreated },
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getMyProfile,
  getTeachersList,
  getParentsList,
  getAllStudents,
  searchParentsByPhone,
  getPaymentConfigs,
  getAllFees,
  createExtracurricular,
  updateExtracurricular,
  updateBaseFee,
  createPaymentPackage,
  updatePaymentPackage,
  getInvoices,
  getInvoiceDetail,
  enrollStudent,
  addParentToStudent,
  importStudents,
  getAccountsByRole,
  getTeacherDetail,
  getParentDetail,
  getStudentDetail,
  updateStudent,
  getUnassignedStudents,
  resetAccountPassword,
  lockAccount,
  unlockAccount,
  getGradesAndClasses,
  createGradeAndClasses,
  createAccount,
  getClassDetail,
  assignTeacherToClass,
  assignStudentsToClass,
  endAcademicYear,
  startAcademicYear,
  getAcademicYears,
  activateAcademicYear,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
  getMonthlySchedules,
  getMonthlyScheduleDetail,
  approveMonthlySchedule,
  activeMonthlySchedule,
  getMenus,
  getMenuDetail,
  deleteMenu,
  importMenus,
};
