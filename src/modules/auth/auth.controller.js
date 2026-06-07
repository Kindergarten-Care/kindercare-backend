import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import ApiResponse from '../../utils/ApiResponse.js';
import httpStatus from 'http-status';

// Trả về tên cột tương ứng trong bảng Users
const detectIdentifierType = (identifier) => {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier)) return 'Email';
    if (/^[0-9]{9,11}$/.test(identifier)) return 'Phone';
    return 'Username';
};

const login = async (req, res, next) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Thông tin đăng nhập và mật khẩu là bắt buộc');
        }

        // Tự động nhận diện loại identifier
        const identifierType = detectIdentifierType(identifier);

        let query = '';
        if (identifierType === 'Email') {
            query = `
                SELECT u.UserID, u.Username, u.PasswordHash, u.RoleID, u.fcm_token, u.Status,
                       r.RoleName
                FROM Users u
                LEFT JOIN Roles r ON u.RoleID = r.RoleID
                LEFT JOIN Parents p ON u.UserID = p.ParentID
                LEFT JOIN Teachers t ON u.UserID = t.TeacherID
                WHERE p.Email = ? OR t.Email = ?
            `;
        } else if (identifierType === 'Phone') {
            query = `
                SELECT u.UserID, u.Username, u.PasswordHash, u.RoleID, u.fcm_token, u.Status,
                       r.RoleName
                FROM Users u
                LEFT JOIN Roles r ON u.RoleID = r.RoleID
                LEFT JOIN Parents p ON u.UserID = p.ParentID
                LEFT JOIN Teachers t ON u.UserID = t.TeacherID
                WHERE p.PhoneNumber = ? OR t.PhoneNumber = ?
            `;
        } else {
            query = `
                SELECT u.UserID, u.Username, u.PasswordHash, u.RoleID, u.fcm_token, u.Status,
                       r.RoleName
                FROM Users u
                LEFT JOIN Roles r ON u.RoleID = r.RoleID
                WHERE u.Username = ?
            `;
        }

        const queryParams = identifierType === 'Email' || identifierType === 'Phone'
            ? [identifier, identifier]
            : [identifier];

        const [rows] = await pool.query(query, queryParams);

        if (rows.length === 0) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không đúng');
        }

        const user = rows[0];

        if (user.Status !== 'Active') {
            throw new ApiError(httpStatus.FORBIDDEN, 'Tài khoản đã bị vô hiệu hóa');
        }

        const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
        if (!isPasswordValid) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Tên đăng nhập hoặc mật khẩu không đúng');
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

export default { login };
