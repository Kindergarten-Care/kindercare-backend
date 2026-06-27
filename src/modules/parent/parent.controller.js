import * as parentService from './parent.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError.js';
import logger from '../../config/logger.js';
import { uploadToSpace } from '../../utils/s3Upload.js';

const getMyChildren = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền truy cập thông tin này');
    }

    const children = await parentService.getChildrenByParentId(parentId);

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        children,
        'Lấy danh sách con thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getMyProfile = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền truy cập thông tin này');
    }

    const parent = await parentService.getParentProfileById(parentId);

    if (!parent) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thông tin phụ huynh');
    }

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        parent,
        'Lấy thông tin phụ huynh thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getChildHealthRecords = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;
    const { studentId } = req.params;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền truy cập thông tin này');
    }

    // Verify parent has access to this student
    const hasAccess = await parentService.isParentOfStudent(parentId, studentId);
    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập thông tin của học sinh này');
    }

    const records = await parentService.getHealthRecordsByStudentId(studentId);

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        records,
        'Lấy danh sách chỉ số sức khỏe của bé thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const createLeaveRequest = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền thực hiện hành động này');
    }

    const { studentId, fromDate, toDate, reason, parentNotes } = req.body;

    // Validation
    if (!studentId || !fromDate || !toDate || !reason) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Các thông tin studentId, fromDate, toDate, và reason là bắt buộc');
    }

    // Verify parent has access to this student
    const hasAccess = await parentService.isParentOfStudent(parentId, studentId);
    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền tạo đơn xin nghỉ phép cho học sinh này');
    }

    const fromDateVal = parseInt(fromDate, 10);
    const toDateVal = parseInt(toDate, 10);

    if (isNaN(fromDateVal) || isNaN(toDateVal)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'fromDate và toDate phải là số hợp lệ (timestamp tính bằng giây)');
    }

    if (toDateVal < fromDateVal) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Ngày kết thúc (toDate) không được nhỏ hơn ngày bắt đầu (fromDate)');
    }

    // Process file upload if present
    let evidenceUrlVal = null;
    if (req.file) {
      evidenceUrlVal = await uploadToSpace(req.file, 'parents/student-leave-evidences');
    }

    const studentIdVal = parseInt(studentId, 10);
    const reasonVal = reason.trim();
    const parentNotesVal = parentNotes ? parentNotes.trim() : null;

    const newRequest = await parentService.createLeaveRequest(
      studentIdVal,
      parentId,
      fromDateVal,
      toDateVal,
      reasonVal,
      evidenceUrlVal,
      parentNotesVal
    );

    logger.info(`Parent ID ${parentId} created Leave Request ID ${newRequest.requestId} for Student ID ${studentId}`);

    res.status(httpStatus.CREATED).json(
      new ApiResponse(
        httpStatus.CREATED,
        newRequest,
        'Tạo đơn xin nghỉ phép thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const createMedicationRequest = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền thực hiện hành động này');
    }

    const { studentId, requestDate, medicineDetails, dosage, frequency, timeToTake, parentNote } = req.body;

    // Validation
    if (!studentId || !requestDate || !medicineDetails || !dosage) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Các thông tin studentId, requestDate, medicineDetails, và dosage là bắt buộc');
    }

    // Verify parent has access to this student
    const hasAccess = await parentService.isParentOfStudent(parentId, studentId);
    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền tạo dặn dò thuốc cho học sinh này');
    }

    const requestDateVal = parseInt(requestDate, 10);
    if (isNaN(requestDateVal)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'requestDate phải là số hợp lệ (timestamp tính bằng giây)');
    }

    // Process file upload if present
    let medicineImageUrlVal = null;
    if (req.file) {
      medicineImageUrlVal = await uploadToSpace(req.file, 'parents/student-medication-requests');
    }

    const studentIdVal = parseInt(studentId, 10);
    const medicineDetailsVal = medicineDetails.trim();
    const dosageVal = dosage.trim();
    const frequencyVal = frequency ? frequency.trim() : null;
    const timeToTakeVal = timeToTake ? timeToTake.trim() : null;
    const parentNoteVal = parentNote ? parentNote.trim() : null;

    const newRequest = await parentService.createMedicationRequest(
      studentIdVal,
      parentId,
      requestDateVal,
      medicineDetailsVal,
      dosageVal,
      medicineImageUrlVal,
      frequencyVal,
      timeToTakeVal,
      parentNoteVal
    );

    logger.info(`Parent ID ${parentId} created Medication Request ID ${newRequest.medRequestId} for Student ID ${studentId}`);

    res.status(httpStatus.CREATED).json(
      new ApiResponse(
        httpStatus.CREATED,
        newRequest,
        'Tạo dặn dò thuốc thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getChildAttendance = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền truy cập thông tin này');
    }

    // Verify parent has access to this student
    const hasAccess = await parentService.isParentOfStudent(parentId, studentId);
    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập thông tin điểm danh của học sinh này');
    }

    let startDateVal = null;
    let endDateVal = null;

    if (startDate) {
      startDateVal = parseInt(startDate, 10);
      if (isNaN(startDateVal)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'startDate phải là số nguyên hợp lệ (timestamp tính bằng giây)');
      }
    }

    if (endDate) {
      endDateVal = parseInt(endDate, 10);
      if (isNaN(endDateVal)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'endDate phải là số nguyên hợp lệ (timestamp tính bằng giây)');
      }
    }

    const records = await parentService.getStudentAttendance(
      parseInt(studentId, 10),
      startDateVal,
      endDateVal
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        records,
        'Lấy thông tin điểm danh của bé thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getChildLeaveRequests = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;
    const { studentId } = req.params;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền truy cập thông tin này');
    }

    // Verify parent has access to this student
    const hasAccess = await parentService.isParentOfStudent(parentId, studentId);
    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập thông tin nghỉ phép của học sinh này');
    }

    const records = await parentService.getLeaveRequestsByStudentId(parseInt(studentId, 10));

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        records,
        'Lấy danh sách đơn xin nghỉ phép của bé thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getChildMedicationRequests = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;
    const { studentId } = req.params;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền truy cập thông tin này');
    }

    // Verify parent has access to this student
    const hasAccess = await parentService.isParentOfStudent(parentId, studentId);
    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập thông tin dặn dò thuốc của học sinh này');
    }

    const records = await parentService.getMedicationRequestsByStudentId(parseInt(studentId, 10));

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        records,
        'Lấy danh sách dặn dò thuốc của bé thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const cancelLeaveRequest = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;
    const { requestId } = req.params;

    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền thực hiện hành động này');
    }

    const updatedRequest = await parentService.cancelLeaveRequest(parseInt(requestId, 10), parentId);

    logger.info(`Parent ID ${parentId} cancelled Leave Request ID ${requestId}`);

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        updatedRequest,
        'Hủy đơn xin nghỉ phép thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const cancelMedicationRequest = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;
    const { medRequestId } = req.params;

    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền thực hiện hành động này');
    }

    const updatedRequests = await parentService.cancelMedicationRequest(parseInt(medRequestId, 10), parentId);

    logger.info(`Parent ID ${parentId} cancelled Medication Request ID ${medRequestId} group`);

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        updatedRequests,
        'Hủy dặn dò thuốc thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getChildAssessments = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;
    const { studentId } = req.params;
    const { month } = req.query;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền truy cập thông tin này');
    }

    // Verify parent has access to this student
    const hasAccess = await parentService.isParentOfStudent(parentId, studentId);
    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập thông tin đánh giá của học sinh này');
    }

    // Validate month format (MM-YYYY) if provided
    if (month) {
      const monthRegex = /^(0[1-9]|1[0-2])-\d{4}$/;
      if (!monthRegex.test(month)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Định dạng tháng không hợp lệ (yêu cầu MM-YYYY)');
      }
    }

    const assessments = await parentService.getStudentAssessments(
      parseInt(studentId, 10),
      month || null
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        assessments,
        'Lấy danh sách đánh giá của bé thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getChildDailySchedule = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;
    const { studentId } = req.params;
    const { date } = req.query;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền truy cập thông tin này');
    }

    // Verify parent has access to this student
    const hasAccess = await parentService.isParentOfStudent(parentId, studentId);
    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập thông tin thời khóa biểu của học sinh này');
    }

    let targetTimestamp;
    if (date) {
      targetTimestamp = parseInt(date, 10);
      if (isNaN(targetTimestamp)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'date phải là số nguyên hợp lệ (timestamp tính bằng giây)');
      }
    } else {
      // Default to current time
      targetTimestamp = Math.floor(Date.now() / 1000);
    }

    // Calculate UTC midnight of the target timestamp's local day
    const targetDateObj = new Date(targetTimestamp * 1000);
    const midnightSeconds = Math.floor(Date.UTC(
      targetDateObj.getFullYear(),
      targetDateObj.getMonth(),
      targetDateObj.getDate()
    ) / 1000);

    const schedule = await parentService.getStudentDailySchedule(
      parseInt(studentId, 10),
      midnightSeconds
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        schedule,
        'Lấy thời khóa biểu ngày của bé thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getChildDailyLessons = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;
    const { studentId } = req.params;
    const { date } = req.query;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền truy cập thông tin này');
    }

    // Verify parent has access to this student
    const hasAccess = await parentService.isParentOfStudent(parentId, studentId);
    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập thông tin bài học của học sinh này');
    }

    let targetTimestamp;
    if (date) {
      targetTimestamp = parseInt(date, 10);
      if (isNaN(targetTimestamp)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'date phải là số nguyên hợp lệ (timestamp tính bằng giây)');
      }
    } else {
      // Default to current time
      targetTimestamp = Math.floor(Date.now() / 1000);
    }

    // Calculate UTC midnight of the target timestamp's local day
    const targetDateObj = new Date(targetTimestamp * 1000);
    const midnightSeconds = Math.floor(Date.UTC(
      targetDateObj.getFullYear(),
      targetDateObj.getMonth(),
      targetDateObj.getDate()
    ) / 1000);

    const lessons = await parentService.getStudentDailyLessons(
      parseInt(studentId, 10),
      midnightSeconds
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        lessons,
        'Lấy danh sách bài học ngày của bé thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

const getChildDailyAlbums = async (req, res, next) => {
  try {
    const parentId = req.user.userId;
    const roleId = req.user.roleId;
    const { studentId } = req.params;
    const { date } = req.query;

    // Double check authorization (safety check)
    if (roleId !== 4) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Chỉ phụ huynh mới có quyền truy cập thông tin này');
    }

    // Verify parent has access to this student
    const hasAccess = await parentService.isParentOfStudent(parentId, studentId);
    if (!hasAccess) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Bạn không có quyền truy cập thông tin album ảnh của học sinh này');
    }

    let targetTimestamp;
    if (date) {
      targetTimestamp = parseInt(date, 10);
      if (isNaN(targetTimestamp)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'date phải là số nguyên hợp lệ (timestamp tính bằng giây)');
      }
    } else {
      // Default to current time
      targetTimestamp = Math.floor(Date.now() / 1000);
    }

    // Calculate UTC midnight of the target timestamp's local day
    const targetDateObj = new Date(targetTimestamp * 1000);
    const midnightSeconds = Math.floor(Date.UTC(
      targetDateObj.getFullYear(),
      targetDateObj.getMonth(),
      targetDateObj.getDate()
    ) / 1000);

    const albums = await parentService.getStudentDailyAlbums(
      parseInt(studentId, 10),
      midnightSeconds
    );

    res.status(httpStatus.OK).json(
      new ApiResponse(
        httpStatus.OK,
        albums,
        'Lấy danh sách album ảnh ngày của bé thành công'
      )
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getMyChildren,
  getMyProfile,
  getChildHealthRecords,
  createLeaveRequest,
  createMedicationRequest,
  getChildAttendance,
  getChildLeaveRequests,
  getChildMedicationRequests,
  cancelLeaveRequest,
  cancelMedicationRequest,
  getChildAssessments,
  getChildDailySchedule,
  getChildDailyLessons,
  getChildDailyAlbums,
};






