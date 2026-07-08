import pool from '../../config/db.js';
import ApiResponse from '../../utils/ApiResponse.js';
import httpStatus from 'http-status';

const getUsersByRole = async (req, res, next) => {
    try {
        const query = `
            SELECT
                u.UserID AS userId,
                u.Username AS username,
                u.RoleID AS roleId,
                r.RoleName AS roleName,
                u.Status AS status,
                u.AvatarURL AS avatarUrl,
                COALESCE(a.FullName, pr.FullName, t.FullName, p.FullName) AS fullName,
                COALESCE(a.Email, pr.Email, t.Email, p.Email) AS email,
                COALESCE(a.PhoneNumber, pr.PhoneNumber, t.PhoneNumber, p.PhoneNumber) AS phoneNumber,
                p.Job AS job,
                COALESCE(t.Address, p.Address) AS address,
                t.DateOfBirth AS dateOfBirth,
                t.Gender AS gender,
                t.IDCard AS idCard,
                t.ProfessionalRank AS professionalRank,
                t.WorkStatus AS workStatus
            FROM Users u
            LEFT JOIN Roles r ON u.RoleID = r.RoleID
            LEFT JOIN Admins a ON u.RoleID = 1 AND u.UserID = a.AdminID
            LEFT JOIN Principals pr ON u.RoleID = 2 AND u.UserID = pr.PrincipalID
            LEFT JOIN Teachers t ON u.RoleID = 3 AND u.UserID = t.TeacherID
            LEFT JOIN Parents p ON u.RoleID = 4 AND u.UserID = p.ParentID
            ORDER BY r.RoleName, u.UserID
        `;
        const [rows] = await pool.query(query);

        // Group users by their roleName
        const groupedUsers = rows.reduce((acc, row) => {
            const role = row.roleName || 'Unknown';
            if (!acc[role]) {
                acc[role] = [];
            }

            // Construct a cleaned user object
            const user = {
                userId: row.userId,
                username: row.username,
                roleId: row.roleId,
                roleName: row.roleName,
                status: row.status,
                avatarUrl: row.avatarUrl,
                fullName: row.fullName,
                email: row.email,
                phoneNumber: row.phoneNumber,
            };

            // Include role-specific fields
            if (row.roleId === 4) { // Parent
                user.job = row.job;
                user.address = row.address;
            } else if (row.roleId === 3) { // Teacher
                user.dateOfBirth = row.dateOfBirth;
                user.gender = row.gender;
                user.idCard = row.idCard;
                user.address = row.address;
                user.professionalRank = row.professionalRank;
                user.workStatus = row.workStatus;
            }

            acc[role].push(user);
            return acc;
        }, {});

        res.status(httpStatus.OK).json(
            new ApiResponse(
                httpStatus.OK,
                groupedUsers,
                'Lấy danh sách người dùng theo vai trò thành công'
            )
        );
    } catch (error) {
        next(error);
    }
};

export default {
    getUsersByRole,
};
