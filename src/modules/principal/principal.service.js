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
      t.Email     AS email,
      u.AvatarURL AS avatarUrl
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
      p.ParentID   AS id,
      p.FullName   AS fullName,
      u.Username   AS username,
      p.Email      AS email,
      p.AvatarURL  AS avatarUrl
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
  const avatarSelect = roleId === 4
    ? 'p.AvatarURL AS avatarUrl'
    : 'u.AvatarURL AS avatarUrl';

  const joinClause = roleId === 4
    ? 'LEFT JOIN Parents p ON u.UserID = p.ParentID'
    : 'LEFT JOIN Teachers t ON u.UserID = t.TeacherID';

  const query = `
    SELECT
      u.UserID                                    AS id,
      COALESCE(t.FullName, p.FullName)             AS fullName,
      u.Username                                  AS username,
      COALESCE(t.Email, p.Email)                   AS email,
      ${avatarSelect}
    FROM Users u
    INNER JOIN Roles r ON r.RoleID = u.RoleID
    ${joinClause}
    WHERE u.RoleID = ?
    ORDER BY fullName ASC
  `;
  const [rows] = await pool.query(query, [roleId]);
  return rows;
};

/**
 * Lấy thông tin chi tiết tài khoản giáo viên + danh sách lớp đang phụ trách.
 *
 * Trả về đầy đủ field từ Users + Teachers, kèm `classes: [...]` join từ ClassTeachers ↔ Classes.
 * Trả `null` nếu id không tồn tại (để controller 404).
 *
 * @param {number} id - TeacherID (= UserID)
 * @returns {Promise<object|null>}
 */
export const getTeacherDetail = async (id) => {
  const teacherQuery = `
    SELECT
      u.UserID         AS id,
      u.Username       AS username,
      u.Status         AS status,
      u.AvatarURL      AS avatarUrl,
      u.RoleID         AS roleId,
      r.RoleName       AS roleName,
      t.FullName       AS fullName,
      t.PhoneNumber    AS phoneNumber,
      t.Email          AS email,
      t.DateOfBirth    AS dateOfBirth,
      t.Gender         AS gender,
      t.IDCard         AS idCard,
      t.Address        AS address,
      t.ProfessionalRank AS professionalRank,
      t.WorkStatus     AS workStatus
    FROM Users u
    INNER JOIN Roles    r ON r.RoleID = u.RoleID
    INNER JOIN Teachers t ON u.UserID = t.TeacherID
    WHERE u.UserID = ? AND u.RoleID = 3
  `;
  const [rows] = await pool.query(teacherQuery, [id]);
  if (rows.length === 0) return null;

  const classesQuery = `
    SELECT
      ct.ClassID   AS classId,
      c.ClassName  AS className,
      ct.RoleInClass AS roleInClass,
      ct.AssignedDate AS assignedDate
    FROM ClassTeachers ct
    INNER JOIN Classes c ON c.ClassID = ct.ClassID
    WHERE ct.TeacherID = ?
    ORDER BY ct.AssignedDate DESC
  `;
  const [classes] = await pool.query(classesQuery, [id]);

  return { ...rows[0], classes, totalClasses: classes.length };
};

/**
 * Lấy thông tin chi tiết tài khoản phụ huynh + danh sách con.
 *
 * Trả về đầy đủ field từ Users + Parents, kèm `children: [...]` join từ StudentParents ↔ Students.
 * Trả `null` nếu id không tồn tại (để controller 404).
 *
 * @param {number} id - ParentID (= UserID)
 * @returns {Promise<object|null>}
 */
export const getParentDetail = async (id) => {
  const parentQuery = `
    SELECT
      u.UserID         AS id,
      u.Username       AS username,
      u.Status         AS status,
      u.AvatarURL      AS avatarUrl,
      u.RoleID         AS roleId,
      r.RoleName       AS roleName,
      p.FullName       AS fullName,
      p.DateOfBirth    AS dateOfBirth,
      p.PhoneNumber    AS phoneNumber,
      p.Email          AS email,
      p.IDCard         AS idCard,
      p.Job            AS job,
      p.Address        AS address,
      p.AvatarURL      AS parentAvatarUrl
    FROM Users u
    INNER JOIN Roles   r ON r.RoleID = u.RoleID
    INNER JOIN Parents p ON u.UserID = p.ParentID
    WHERE u.UserID = ? AND u.RoleID = 4
  `;
  const [rows] = await pool.query(parentQuery, [id]);
  if (rows.length === 0) return null;

  const childrenQuery = `
    SELECT
      sp.StudentID     AS studentId,
      s.FullName       AS fullName,
      s.DateOfBirth    AS dateOfBirth,
      s.Gender         AS gender,
      s.ClassID        AS classId,
      c.ClassName      AS className,
      sp.Relationship  AS relationship,
      sp.IsPrimary     AS isPrimary
    FROM StudentParents sp
    INNER JOIN Students s ON s.StudentID = sp.StudentID
    LEFT  JOIN Classes  c ON c.ClassID  = s.ClassID
    WHERE sp.ParentID = ?
    ORDER BY sp.IsPrimary DESC, s.FullName ASC
  `;
  const [children] = await pool.query(childrenQuery, [id]);

  return { ...rows[0], children };
};
