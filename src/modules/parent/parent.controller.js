import * as parentService from './parent.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError.js';

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

export default {
  getMyChildren,
};
