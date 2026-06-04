import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import httpStatus from 'http-status';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Token xác thực là bắt buộc'));
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        next(new ApiError(httpStatus.UNAUTHORIZED, 'Token không hợp lệ hoặc đã hết hạn'));
    }
};

// authorize(...roleIds) — ví dụ: authorize(1, 2) chỉ cho phép admin và hiệu trưởng
const authorize = (...roleIds) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(httpStatus.UNAUTHORIZED, 'Chưa xác thực'));
        }
        if (!roleIds.includes(req.user.roleId)) {
            return next(new ApiError(httpStatus.FORBIDDEN, 'Không có quyền truy cập'));
        }
        next();
    };
};

export { authenticate, authorize };
