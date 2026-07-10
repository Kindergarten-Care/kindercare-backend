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

const buildQuery = (identifierType) => {
    const baseSelect = `
        SELECT u.UserID, u.Username, u.PasswordHash, u.RoleID, u.Status,
               r.RoleName,
               COALESCE(a.FullName, pr.FullName, t.FullName, p.FullName) AS FullName,
               (
                   SELECT COALESCE(
                       JSON_ARRAYAGG(
                           JSON_OBJECT(
                               'studentId', s.StudentID,
                               'fullName', s.FullName,
                               'relationship', sp.Relationship,
                               'avatarUrl', s.AvatarURL,
                               'classId', s.ClassID,
                               'className', c.ClassName
                           )
                       ), 
                       '[]'
                   )
                   FROM StudentParents sp
                   JOIN Students s ON sp.StudentID = s.StudentID
                   LEFT JOIN Classes c ON s.ClassID = c.ClassID
                   WHERE sp.ParentID = p.ParentID
               ) AS Children
        FROM Users u
        LEFT JOIN Roles r ON u.RoleID = r.RoleID
        LEFT JOIN Admins a ON u.RoleID = 1 AND u.UserID = a.AdminID
        LEFT JOIN Principals pr ON u.RoleID = 2 AND u.UserID = pr.PrincipalID
        LEFT JOIN Teachers t ON u.RoleID = 3 AND u.UserID = t.TeacherID
        LEFT JOIN Parents p ON u.RoleID = 4 AND u.UserID = p.ParentID
    `;

    if (identifierType === 'Email') {
        return {
            query: `${baseSelect} WHERE p.Email = ?`,
            paramCount: 1,
        };
    }
    if (identifierType === 'Phone') {
        return {
            query: `${baseSelect} WHERE p.PhoneNumber = ?`,
            paramCount: 1,
        };
    }
    return {
        query: `${baseSelect} WHERE u.Username = ?`,
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

            const isPasswordValid = await bcrypt.compare(password, user.PasswordHash);
            if (!isPasswordValid) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'Thông tin đăng nhập không đúng');
            }

            if (user.Status?.toLowerCase() !== 'active') {
                throw new ApiError(httpStatus.FORBIDDEN, 'Tài khoản đã bị khóa, liên hệ nhà trường để biết thêm thông tin');
            }

            let children = [];
            if (user.Children) {
                try {
                    children = typeof user.Children === 'string' ? JSON.parse(user.Children) : user.Children;
                } catch (e) {
                    console.error('Lỗi parse children:', e);
                }
            }

            const relationship = children[0]?.relationship || null;

            const payload = {
                userId: user.UserID,
                username: user.Username,
                roleId: user.RoleID,
                roleName: user.RoleName,
                fullName: user.FullName,
                relationship: relationship,
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
                            fullName: user.FullName,
                            relationship: relationship,
                            children: children,
                        },
                    },
                    'Đăng nhập thành công'
                )
            );
        } catch (error) {
            console.error('Login Error:', error);
            if (error instanceof AggregateError) {
                console.error('AggregateError details:', error.errors);
            }
            next(error);
        }
    };
};

const logout = (_req, res) => {
    res.status(httpStatus.OK).json(
        new ApiResponse(httpStatus.OK, null, 'Đăng xuất thành công')
    );
};

const changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;

        if (!currentPassword || !newPassword) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc');
        }

        // Lấy thông tin user
        const [rows] = await pool.query('SELECT PasswordHash FROM Users WHERE UserID = ?', [userId]);
        if (rows.length === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại');
        }

        const user = rows[0];

        // Kiểm tra mật khẩu cũ
        const isPasswordValid = await bcrypt.compare(currentPassword, user.PasswordHash);
        if (!isPasswordValid) {
            throw new ApiError(httpStatus.UNAUTHORIZED, 'Mật khẩu hiện tại không chính xác');
        }

        // Cập nhật mật khẩu mới
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query('UPDATE Users SET PasswordHash = ? WHERE UserID = ?', [hashedNewPassword, userId]);

        res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, null, 'Đổi mật khẩu thành công')
        );
    } catch (error) {
        next(error);
    }
};

const getMe = async (req, res, next) => {
    try {
        const { userId, roleId } = req.user;

        let query;
        if (roleId === 1) {
            query = `
                SELECT u.UserID, u.Username, u.RoleID, r.RoleName,
                       a.FullName, u.Status
                FROM Users u
                LEFT JOIN Roles r ON u.RoleID = r.RoleID
                LEFT JOIN Admins a ON u.UserID = a.AdminID
                WHERE u.UserID = ?`;
        } else if (roleId === 2) {
            query = `
                SELECT u.UserID, u.Username, u.RoleID, r.RoleName,
                       p.FullName, p.PhoneNumber, p.Email, p.AvatarURL,
                       p.ProfessionalRank, u.Status
                FROM Users u
                LEFT JOIN Roles r ON u.RoleID = r.RoleID
                LEFT JOIN Principals p ON u.UserID = p.PrincipalID
                WHERE u.UserID = ?`;
        } else if (roleId === 3) {
            query = `
                SELECT u.UserID, u.Username, u.RoleID, r.RoleName,
                       t.FullName, t.PhoneNumber, t.Email, t.AvatarURL,
                       t.ProfessionalRank, t.WorkStatus,
                       UNIX_TIMESTAMP(t.DateOfBirth) AS DateOfBirth,
                       t.Gender, t.IDCard, t.Address, u.Status
                FROM Users u
                LEFT JOIN Roles r ON u.RoleID = r.RoleID
                LEFT JOIN Teachers t ON u.UserID = t.TeacherID
                WHERE u.UserID = ?`;
        } else if (roleId === 4) {
            query = `
                SELECT u.UserID, u.Username, u.RoleID, r.RoleName,
                       p.FullName, p.PhoneNumber, p.Email, p.AvatarURL,
                       p.Relationship, u.Status
                FROM Users u
                LEFT JOIN Roles r ON u.RoleID = r.RoleID
                LEFT JOIN Parents p ON u.UserID = p.ParentID
                WHERE u.UserID = ?`;
        } else {
            throw new ApiError(httpStatus.FORBIDDEN, 'Vai trò không hợp lệ');
        }

        const [rows] = await pool.query(query, [userId]);

        if (rows.length === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Người dùng không tồn tại');
        }

        const row = rows[0];

        const userData = {
            userId: row.UserID,
            username: row.Username,
            roleId: row.RoleID,
            roleName: row.RoleName,
            fullName: row.FullName || null,
            phone: row.PhoneNumber || null,
            phoneNumber: row.PhoneNumber || null,
            email: row.Email || null,
            avatarUrl: row.AvatarURL || null,
            status: row.Status,
        };

        if (roleId === 3) {
            userData.professionalRank = row.ProfessionalRank || null;
            userData.workStatus = row.WorkStatus || null;
            userData.dateOfBirth = row.DateOfBirth || null;
            userData.gender = row.Gender || null;
            userData.idCard = row.IDCard || null;
            userData.address = row.Address || null;
        } else if (roleId === 2) {
            userData.professionalRank = row.ProfessionalRank || null;
        } else if (roleId === 4) {
            userData.relationship = row.Relationship || null;
        }

        res.status(httpStatus.OK).json(
            new ApiResponse(httpStatus.OK, userData, 'Lấy thông tin người dùng thành công')
        );
    } catch (error) {
        next(error);
    }
};

export default {
    login:          createLoginHandler([4], ['Username', 'Email', 'Phone']), // Parent login
    loginAdmin:     createLoginHandler([1], ['Username']),
    loginPrincipal: createLoginHandler([2], ['Username', 'Email', 'Phone']),
    loginTeacher:   createLoginHandler([3], ['Username', 'Email', 'Phone']),
    logout,
    changePassword,
    getMe,
};
