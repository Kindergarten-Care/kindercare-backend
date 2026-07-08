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

    const { username, fullName, phoneNumber, email } = req.body;
    if (!username || !fullName) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'username và fullName là bắt buộc');
    }

    if (role === 'parent' && !phoneNumber) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'phoneNumber là bắt buộc đối với phụ huynh');
    }

    const userId = await principalService.createAccount(role, { username, fullName, phoneNumber, email });

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, { userId, role }, 'Tạo tài khoản thành công')
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getMyProfile,
  getTeachersList,
  getParentsList,
  getAccountsByRole,
  getTeacherDetail,
  getParentDetail,
  resetAccountPassword,
  lockAccount,
  unlockAccount,
  getGradesAndClasses,
  createGradeAndClasses,
  createAccount,
};
