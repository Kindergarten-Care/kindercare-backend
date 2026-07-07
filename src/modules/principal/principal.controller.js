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

export default {
  getMyProfile,
};
