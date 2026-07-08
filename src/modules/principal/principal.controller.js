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

export default {
  getMyProfile,
  getTeachersList,
  getParentsList,
  getAccountsByRole,
  getTeacherDetail,
  getParentDetail,
  resetAccountPassword,
};
