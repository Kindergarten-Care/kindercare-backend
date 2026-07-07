import pool from '../../config/db.js';

/**
 * Lấy thông tin profile của hiệu trưởng theo PrincipalID.
 * Join với Users để lấy AvatarURL vì bảng Principals không có cột này
 * (tương tự pattern của bảng Parents cũng join Users.AvatarURL).
 * @param {number} principalId
 * @returns {Promise<Object|null>} Principal profile hoặc null nếu không tìm thấy
 */
export const getPrincipalProfileById = async (principalId) => {
  const query = `
    SELECT
      p.PrincipalID  AS principalId,
      p.FullName     AS fullName,
      p.PhoneNumber  AS phoneNumber,
      p.Email        AS email,
      u.AvatarURL    AS avatarUrl,
      u.Username     AS username
    FROM Principals p
    LEFT JOIN Users u ON u.UserID = p.PrincipalID
    WHERE p.PrincipalID = ?
  `;
  const [rows] = await pool.query(query, [principalId]);
  return rows.length > 0 ? rows[0] : null;
};

/**
 * Lấy danh sách tài khoản giáo viên cho hiệu trưởng — chỉ trả 4 trường tối thiểu:
 * id (TeacherID), fullName, username, email.
 *
 * INNER JOIN Users ↔ Teachers để đảm bảo chỉ trả về user thật sự là Teacher
 * (loại bỏ user có RoleID=3 mà chưa có row Teachers — dữ liệu rác).
 *
 * @returns {Promise<Array<{id:number, fullName:string, username:string, email:string|null}>>}
 */
export const getTeachersList = async () => {
  const query = `
    SELECT
      t.TeacherID AS id,
      t.FullName  AS fullName,
      u.Username  AS username,
      t.Email     AS email
    FROM Users u
    INNER JOIN Teachers t ON u.UserID = t.TeacherID
    WHERE u.RoleID = 3
    ORDER BY t.FullName ASC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Lấy danh sách tài khoản phụ huynh cho hiệu trưởng — chỉ trả 4 trường tối thiểu:
 * id (ParentID), fullName, username, email.
 *
 * INNER JOIN Users ↔ Parents để đảm bảo chỉ trả về user thật sự là Parent
 * (loại bỏ user có RoleID=4 mà chưa có row Parents — dữ liệu rác).
 *
 * @returns {Promise<Array<{id:number, fullName:string, username:string, email:string|null}>>}
 */
export const getParentsList = async () => {
  const query = `
    SELECT
      p.ParentID AS id,
      p.FullName AS fullName,
      u.Username AS username,
      p.Email    AS email
    FROM Users u
    INNER JOIN Parents p ON u.UserID = p.ParentID
    WHERE u.RoleID = 4
    ORDER BY p.FullName ASC
  `;
  const [rows] = await pool.query(query);
  return rows;
};

/**
 * Whitelist ánh xạ role name (FE gửi lên) → roleId (DB).
 * Chỉ cho phép teacher/parent — admin/principal không cho hiệu trưởng tự truy xuất
 * (đã có /users/by-role cho mục đích đó).
 */
export const ROLE_NAME_TO_ID = {
  teacher: 3,
  parent: 4,
};

/**
 * Lấy danh sách tài khoản theo role (gộp teacher + parent) — 4 trường tối thiểu:
 * id (TeacherID/ParentID), fullName, username, email.
 *
 * LEFT JOIN 2 bảng Teachers/Parents, có điều kiện u.UserID = ... AND RoleID tương ứng
 * để tránh cross-join. INNER JOIN với Roles để đảm bảo user có role hợp lệ.
 *
 * @param {number} roleId - RoleID (đã được validate ở controller qua whitelist)
 * @returns {Promise<Array<{id:number, fullName:string, username:string, email:string|null}>>}
 */
export const getAccountsByRole = async (roleId) => {
  const query = `
    SELECT
      u.UserID                                    AS id,
      COALESCE(t.FullName, p.FullName)             AS fullName,
      u.Username                                  AS username,
      COALESCE(t.Email, p.Email)                  AS email
    FROM Users u
    INNER JOIN Roles r ON r.RoleID = u.RoleID
    LEFT  JOIN Teachers t ON u.RoleID = 3 AND u.UserID = t.TeacherID
    LEFT  JOIN Parents  p ON u.RoleID = 4 AND u.UserID = p.ParentID
    WHERE u.RoleID = ?
    ORDER BY fullName ASC
  `;
  const [rows] = await pool.query(query, [roleId]);
  return rows;
};
