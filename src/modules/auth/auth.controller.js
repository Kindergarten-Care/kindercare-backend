import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import httpStatus from 'http-status';

const detectIdentifierType = (identifier) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) return 'Email';
    if (/^[0-9]{9,11}$/.test(identifier)) return 'Phone';
    return 'Username';
};

const buildQuery = (identifierType) => {
    if (identifierType === 'Email') {
        return {
            query: `SELECT u.UserID, u.Username, u.PasswordHash, u.RoleID, u.fcm_token, u.Status,
                           r.RoleName
                    FROM Users u
                    LEFT JOIN Roles r ON u.RoleID = r.RoleID
                    LEFT JOIN Parents p ON u.UserID = p.ParentID
                    WHERE p.Email = ?`,
            paramCount: 1,
        };
    }
    if (identifierType === 'Phone') {
        return {
            query: `SELECT u.UserID, u.Username, u.PasswordHash, u.RoleID, u.fcm_token, u.Status,
                           r.RoleName
                    FROM Users u
                    LEFT JOIN Roles r ON u.RoleID = r.RoleID
                    LEFT JOIN Parents p ON u.UserID = p.ParentID
                    WHERE p.PhoneNumber = ?`,
            paramCount: 1,
        };
    }
    return {
        query: `SELECT u.UserID, u.Username, u.PasswordHash, u.RoleID, u.fcm_token, u.Status,
                       r.RoleName
                FROM Users u
                LEFT JOIN Roles r ON u.RoleID = r.RoleID
                WHERE u.Username = ?`,
        paramCount: 1,
    };
};

// allowedRoleIds: null = tất cả roles
// allowedIdentifiers: ['Username'] = chỉ username, ['Username','Email','Phone'] = tất cả
const createLoginHandler = (allowedRoleIds = null, allowedIdentifiers = ['Username']) => {
    return async (req, res, next) => {
        try {
            const { identifier, password } = req.body;

            if (!identifier || !password) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Thông tin đăng nhập và mật khẩu là bắt buộc');
            }

            const identifierType = detectIdentifierType(identifier);

            if (!allowedIdentifiers.includes(identifierType)) {
                throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng đăng nhập bằng tên đăng nhập đã được cung cấp');
            }

            const { query, paramCount } = buildQuery(identifierType);
            const queryParams = Array(paramCount).fill(identifier);
            const [rows] = await pool.query(query, queryParams);

            if (rows.length === 0) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Thông tin đăng nhập không đúng');
            }

            const user = rows[0];

            if (allowedRoleIds && !allowedRoleIds.includes(user.RoleID)) {
                throw new ApiError(httpStatus.FORBIDDEN, 'Tài khoản không có quyền truy cập vào hệ thống này');
            }

            if (user.Status !== 'Active') {
                throw new ApiError(httpStatus.FORBIDDEN, 'Tài khoản đã bị vô hiệu hóa');
            }

            const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
            if (!isPasswordValid) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Thông tin đăng nhập không đúng');
            }

            const payload = {
                userId: user.UserID,
                username: user.Username,
                roleId: user.RoleID,
                roleName: user.RoleName,
            };

            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d',
            });

            res.status(httpStatus.OK).json(
                new ApiResponse(
                    httpStatus.OK,
                    {
                        token,
                        user: {
                            userId: user.UserID,
                            username: user.Username,
                            roleId: user.RoleID,
                            roleName: user.RoleName,
                            fcmToken: user.fcm_token,
                        },
                    },
                    'Đăng nhập thành công'
                )
            );
        } catch (error) {
            next(error);
        }
    };
};

export default {
    login:          createLoginHandler(),
    loginAdmin:     createLoginHandler([1], ['Username']),
    loginPrincipal: createLoginHandler([2], ['Username']),
    loginTeacher:   createLoginHandler([3], ['Username']),
    loginParent:    createLoginHandler([4], ['Username', 'Email', 'Phone']),
};
