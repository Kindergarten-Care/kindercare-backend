import pool from '../../config/db.js';
import bcrypt from 'bcryptjs';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';
import csvParser from 'csv-parser';
import ExcelJS from 'exceljs';
import { Readable } from 'stream';
import { sendPushToUser } from '../notification/notification.service.js';
import logger from '../../config/logger.js';
import { getWeeksByMonthly } from '../teacher/sub/weeklySchedule.service.js';

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
  const fullNameSelect = roleId === 4
    ? 'p.FullName AS fullName'
    : 't.FullName AS fullName';

  const emailSelect = roleId === 4
    ? 'p.Email AS email'
    : 't.Email AS email';

  const phoneSelect = roleId === 4
    ? 'p.PhoneNumber AS phoneNumber'
    : 't.PhoneNumber AS phoneNumber';

  const avatarSelect = roleId === 4
    ? 'p.AvatarURL AS avatarUrl'
    : 'u.AvatarURL AS avatarUrl';

  const joinClause = roleId === 4
    ? 'INNER JOIN Parents p ON u.UserID = p.ParentID'
    : 'INNER JOIN Teachers t ON u.UserID = t.TeacherID';

  const query = `
    SELECT
      u.UserID                                    AS id,
      ${fullNameSelect},
      u.Username                                  AS username,
      u.Status                                    AS status,
      ${emailSelect},
      ${phoneSelect},
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
      p.AvatarURL      AS avatarUrl,
      u.RoleID         AS roleId,
      r.RoleName       AS roleName,
      p.FullName       AS fullName,
      p.DateOfBirth    AS dateOfBirth,
      p.PhoneNumber    AS phoneNumber,
      p.Email          AS email,
      p.IDCard         AS idCard,
      p.Job            AS job,
      p.Address        AS address
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
      s.AvatarURL      AS avatarUrl,
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

/**
 * Lấy thông tin chi tiết học sinh + danh sách phụ huynh.
 *
 * @param {number} id - StudentID
 * @returns {Promise<object|null>}
 */

export const getUnassignedStudents = async () => {
  const query = `
    SELECT StudentID as studentId, FullName as fullName, AvatarURL as avatarUrl, DateOfBirth as dateOfBirth, AdmissionDate as admissionDate
    FROM Students
    WHERE ClassID IS NULL AND EnrollmentStatus = 'Active'
  `;
  const [rows] = await pool.query(query);
  return rows;
};

export const getStudentDetail = async (id) => {
  const studentQuery = `
    SELECT
      s.StudentID      AS id,
      s.FullName       AS fullName,
      s.DateOfBirth    AS dateOfBirth,
      s.Gender         AS gender,
      s.Allergies      AS allergies,
      s.AdmissionDate  AS admissionDate,
      s.EnrollmentStatus AS status,
      s.AvatarURL      AS avatarUrl,
      s.ClassID        AS classId,
      c.ClassName      AS className
    FROM Students s
    LEFT JOIN Classes c ON s.ClassID = c.ClassID
    WHERE s.StudentID = ?
  `;
  const [rows] = await pool.query(studentQuery, [id]);
  if (rows.length === 0) return null;

  const parentsQuery = `
    SELECT
      p.ParentID       AS parentId,
      p.FullName       AS fullName,
      p.PhoneNumber    AS phoneNumber,
      p.Email          AS email,
      sp.Relationship  AS relationship,
      sp.IsPrimary     AS isPrimary
    FROM StudentParents sp
    INNER JOIN Parents p ON p.ParentID = sp.ParentID
    WHERE sp.StudentID = ?
  `;
  const [parents] = await pool.query(parentsQuery, [id]);

  return { ...rows[0], parents };
};

export const updateStudent = async (studentId, { fullName, dateOfBirth, gender, allergies, avatarUrl }) => {
  const fields = [];
  const params = [];

  if (fullName !== undefined) {
    fields.push('FullName = ?');
    params.push(fullName);
  }
  if (dateOfBirth !== undefined) {
    fields.push('DateOfBirth = ?');
    params.push(dateOfBirth);
  }
  if (gender !== undefined) {
    fields.push('Gender = ?');
    params.push(gender);
  }
  if (allergies !== undefined) {
    fields.push('Allergies = ?');
    params.push(allergies);
  }
  if (avatarUrl !== undefined) {
    fields.push('AvatarURL = ?');
    params.push(avatarUrl);
  }

  if (!fields.length) {
    return false;
  }

  params.push(studentId);
  const [result] = await pool.query(
    `UPDATE Students SET ${fields.join(', ')} WHERE StudentID = ?`,
    params
  );

  return result.affectedRows > 0;
};

/**
 * Đặt lại mật khẩu của tài khoản về mặc định (123456)
 *
 * @param {number} userId - UserID của tài khoản cần reset
 * @returns {Promise<boolean>} true nếu thành công, false nếu không tìm thấy user
 */
export const resetAccountPassword = async (userId) => {
  const saltRounds = 10;
  const defaultPassword = '123456';
  const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

  const [result] = await pool.query(
    'UPDATE Users SET PasswordHash = ? WHERE UserID = ?',
    [hashedPassword, userId]
  );

  return result.affectedRows > 0;
};

/**
 * Khóa tài khoản (Chuyển status thành 'Inactive')
 *
 * @param {number} userId - UserID của tài khoản cần khóa
 * @returns {Promise<boolean>} true nếu thành công, false nếu không tìm thấy user
 */
export const lockAccount = async (userId) => {
  const query = 'UPDATE Users SET Status = "Inactive" WHERE UserID = ?';
  const [result] = await pool.query(query, [userId]);
  return result.affectedRows > 0;
};

/**
 * Mở khóa tài khoản (Chuyển status thành 'Active')
 *
 * @param {number} userId - UserID của tài khoản cần mở khóa
 * @returns {Promise<boolean>} true nếu thành công, false nếu không tìm thấy user
 */
export const unlockAccount = async (userId) => {
  const query = 'UPDATE Users SET Status = "Active" WHERE UserID = ?';
  const [result] = await pool.query(query, [userId]);
  return result.affectedRows > 0;
};

export const getGradesAndClasses = async () => {
  const query = `
    SELECT
      g.GradeID AS gradeId,
      g.GradeName AS gradeName,
      c.ClassID AS classId,
      c.ClassName AS className,
      y.YearName AS yearName,
      COUNT(ct.TeacherID) AS teacherCount
    FROM Grades g
    LEFT JOIN Classes c ON g.GradeID = c.GradeID AND (
      c.YearID = (SELECT YearID FROM AcademicYears WHERE IsActive = 1 LIMIT 1)
    )
    LEFT JOIN AcademicYears y ON c.YearID = y.YearID
    LEFT JOIN ClassTeachers ct ON c.ClassID = ct.ClassID
    GROUP BY g.GradeID, g.GradeName, c.ClassID, c.ClassName, y.YearName
    ORDER BY g.GradeID, c.ClassName
  `;
  const [rows] = await pool.query(query);

  const result = [];
  const map = new Map();

  for (const row of rows) {
    if (!map.has(row.gradeId)) {
      const grade = {
        gradeId: row.gradeId,
        gradeName: row.gradeName,
        classes: []
      };
      map.set(row.gradeId, grade);
      result.push(grade);
    }
    if (row.classId) {
      map.get(row.gradeId).classes.push({
        classId: row.classId,
        className: row.className,
        yearName: row.yearName,
        teacherCount: row.teacherCount
      });
    }
  }

  return result;
};

export const createGradeAndClasses = async (gradeName, classes) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Check if grade exists
    const [existingGrades] = await connection.query(
      'SELECT GradeID FROM Grades WHERE GradeName = ?',
      [gradeName]
    );

    let gradeId;
    if (existingGrades.length > 0) {
      gradeId = existingGrades[0].GradeID;
    } else {
      // Create new grade
      const [insertGradeResult] = await connection.query(
        'INSERT INTO Grades (GradeName) VALUES (?)',
        [gradeName]
      );
      gradeId = insertGradeResult.insertId;
    }

    // Get active year
    const [activeYears] = await connection.query('SELECT YearID FROM AcademicYears WHERE IsActive = 1 LIMIT 1');
    const activeYearId = activeYears.length > 0 ? activeYears[0].YearID : null;

    // 2. Create classes if provided
    if (Array.isArray(classes) && classes.length > 0) {
      for (const className of classes) {
        // Check if class exists in this grade for the active year
        let existingClassesQuery = 'SELECT ClassID FROM Classes WHERE ClassName = ? AND GradeID = ?';
        let existingClassesParams = [className, gradeId];
        
        if (activeYearId) {
          existingClassesQuery += ' AND YearID = ?';
          existingClassesParams.push(activeYearId);
        } else {
          existingClassesQuery += ' AND YearID IS NULL';
        }

        const [existingClasses] = await connection.query(existingClassesQuery, existingClassesParams);

        if (existingClasses.length === 0) {
          await connection.query(
            'INSERT INTO Classes (ClassName, GradeID, YearID) VALUES (?, ?, ?)',
            [className, gradeId, activeYearId]
          );
        }
      }
    }

    await connection.commit();
    return gradeId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const createAccount = async (role, payload) => {
  const { username, fullName, phoneNumber, email, gender } = payload;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Kiểm tra username
    const [existingUsers] = await connection.query(
      'SELECT UserID FROM Users WHERE Username = ?',
      [username]
    );
    if (existingUsers.length > 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Tên đăng nhập đã tồn tại');
    }

    // 2. Hash mật khẩu mặc định '123456'
    const saltRounds = 10;
    const defaultPassword = '123456';
    const hashedPassword = await bcrypt.hash(defaultPassword, saltRounds);

    // 3. Xác định RoleID
    const roleId = role === 'teacher' ? 3 : 4;

    // 4. Tạo User
    const [userResult] = await connection.query(
      'INSERT INTO Users (Username, PasswordHash, RoleID, Status) VALUES (?, ?, ?, ?)',
      [username, hashedPassword, roleId, 'Active']
    );
    const userId = userResult.insertId;

    // 5. Tạo Teacher hoặc Parent
    if (role === 'teacher') {
      await connection.query(
        'INSERT INTO Teachers (TeacherID, FullName, PhoneNumber, Email, Gender) VALUES (?, ?, ?, ?, ?)',
        [userId, fullName, phoneNumber || null, email || null, gender || null]
      );
    } else if (role === 'parent') {
      await connection.query(
        'INSERT INTO Parents (ParentID, FullName, PhoneNumber, Email) VALUES (?, ?, ?, ?)',
        [userId, fullName, phoneNumber, email || null]
      );
    }

    await connection.commit();
    return userId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

/**
 * Lấy thông tin chi tiết lớp học gồm: Khối - Tên lớp, ds giáo viên, ds học sinh, điểm danh hôm nay.
 * @param {number} classId
 * @returns {Promise<Object|null>}
 */
export const getClassDetail = async (classId) => {
  // 1. Lấy thông tin Khối & Lớp
  const classQuery = `
    SELECT c.ClassID AS classId, c.ClassName AS className, g.GradeName AS gradeName, y.YearName AS yearName
    FROM Classes c
    JOIN Grades g ON c.GradeID = g.GradeID
    LEFT JOIN AcademicYears y ON c.YearID = y.YearID
    WHERE c.ClassID = ?
  `;
  const [classRows] = await pool.query(classQuery, [classId]);
  if (classRows.length === 0) return null;

  const classInfo = classRows[0];

  // 2. Lấy danh sách Giáo viên (FullName, Email, PhoneNumber lấy từ Teachers; AvatarURL lấy từ Users)
  const teachersQuery = `
    SELECT
      u.UserID AS id,
      t.FullName AS fullName,
      t.Email AS email,
      t.PhoneNumber AS phoneNumber,
      u.AvatarURL AS avatarUrl,
      ct.RoleInClass AS roleInClass
    FROM ClassTeachers ct
    JOIN Teachers t ON ct.TeacherID = t.TeacherID
    JOIN Users u ON t.TeacherID = u.UserID
    WHERE ct.ClassID = ?
  `;
  const [teachers] = await pool.query(teachersQuery, [classId]);

  // 3. Lấy danh sách Học sinh
  const studentsQuery = `
    SELECT
      StudentID AS studentId,
      FullName AS fullName,
      AvatarURL AS avatarUrl,
      DateOfBirth AS dateOfBirth,
      AdmissionDate AS admissionDate
    FROM Students
    WHERE ClassID = ?
  `;
  const [students] = await pool.query(studentsQuery, [classId]);

  // 4. Tổng hợp Điểm danh hôm nay — tính chính xác unix timestamp midnight VN time (+07:00)
  // Dùng explicit offset +07:00 khi tạo Date để đảm bảo đúng dù server chạy UTC hay UTC+7
  const nowVN = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const vnDateStr = `${nowVN.getFullYear()}-${String(nowVN.getMonth() + 1).padStart(2, '0')}-${String(nowVN.getDate()).padStart(2, '0')}`;
  const startOfTodayUnix = Math.floor(new Date(`${vnDateStr}T00:00:00+07:00`).getTime() / 1000);
  const endOfTodayUnix = Math.floor(new Date(`${vnDateStr}T23:59:59+07:00`).getTime() / 1000);

  const attendanceQuery = `
    SELECT a.Status AS status, COUNT(*) AS count
    FROM Attendances a
    JOIN Students s ON a.StudentID = s.StudentID
    WHERE s.ClassID = ? AND a.AttendanceDate BETWEEN ? AND ?
    GROUP BY a.Status
  `;
  const [attendanceRows] = await pool.query(attendanceQuery, [classId, startOfTodayUnix, endOfTodayUnix]);

  const attendanceStatus = { present: 0, absent: 0, excused: 0 };
  attendanceRows.forEach(row => {
    if (row.status === 'Present') attendanceStatus.present = row.count;
    else if (row.status === 'Absent') attendanceStatus.absent = row.count;
    else if (row.status === 'Excused') attendanceStatus.excused = row.count;
  });

  return {
    ...classInfo,
    teachers,
    totalStudents: students.length,
    attendanceToday: attendanceStatus,
    students
  };
};

export const assignTeacherToClass = async (classId, teacherId, roleInClass, assignedDate) => {
  const [classRows] = await pool.query('SELECT ClassName, YearID FROM Classes WHERE ClassID = ?', [classId]);
  if (classRows.length === 0) throw new Error('Không tìm thấy lớp');
  const yearId = classRows[0].YearID;

  const [teacherRows] = await pool.query('SELECT FullName FROM Teachers WHERE TeacherID = ?', [teacherId]);
  if (teacherRows.length === 0) throw new Error('Không tìm thấy giáo viên');

  const assignedTimestamp = assignedDate || Math.floor(Date.now() / 1000);

  // Xóa phân công cũ của giáo viên này trong cùng năm học (mỗi giáo viên chỉ 1 lớp/năm)
  if (yearId) {
    await pool.query(`
      DELETE ct FROM ClassTeachers ct
      JOIN Classes c ON ct.ClassID = c.ClassID
      WHERE ct.TeacherID = ? AND c.YearID = ?
    `, [teacherId, yearId]);
  } else {
    // Nếu lớp không có YearID (fallback), xóa tất cả phân công cũ của giáo viên này ở các lớp không có YearID
    await pool.query(`
      DELETE ct FROM ClassTeachers ct
      JOIN Classes c ON ct.ClassID = c.ClassID
      WHERE ct.TeacherID = ? AND c.YearID IS NULL
    `, [teacherId]);
  }

  // Insert or Update class assignment
  await pool.query(
    'INSERT INTO ClassTeachers (ClassID, TeacherID, RoleInClass, AssignedDate) VALUES (?, ?, ?, ?) ' +
    'ON DUPLICATE KEY UPDATE RoleInClass = VALUES(RoleInClass), AssignedDate = VALUES(AssignedDate)',
    [classId, teacherId, roleInClass || 'Giáo viên phụ', assignedTimestamp]
  );

  // Add work history
  await pool.query(
    'INSERT INTO TeacherWorkHistories (TeacherID, Title, Tag, Description, Kind, EventDate) VALUES (?, ?, ?, ?, ?, ?)',
    [
      teacherId,
      `Bổ nhiệm làm ${roleInClass || 'Giáo viên phụ'} lớp ${classRows[0].ClassName}`,
      'Bổ nhiệm',
      `Phân công giảng dạy tại lớp ${classRows[0].ClassName}`,
      'Assignment',
      assignedTimestamp
    ]
  );
};

export const getAllStudents = async () => {
  const query = `
    SELECT 
      s.StudentID as id,
      s.FullName as fullName,
      s.AvatarURL as avatarUrl,
      s.DateOfBirth as dateOfBirth,
      s.Gender as gender,
      c.ClassName as currentClass
    FROM Students s
    LEFT JOIN Classes c ON s.ClassID = c.ClassID
    ORDER BY s.FullName ASC
  `;
  const [rows] = await pool.query(query);
  return rows;
};


export const searchParentsByPhone = async (phone) => {
  const [rows] = await pool.query(
    'SELECT ParentID as id, FullName as fullName, PhoneNumber as phoneNumber, Email as email, Job as occupation, Address as address FROM Parents WHERE PhoneNumber = ?',
    [phone]
  );
  return rows[0] || null;
};

export const getPaymentConfigs = async () => {
  // Get all packages
  const [packages] = await pool.query('SELECT PackageID as id, PackageName as name, DurationInMonths as duration, DiscountPercentage as discount FROM PaymentPackages');
  
  // Get active year base fees
  const [fees] = await pool.query(`
    SELECT bf.MonthlyTuition, bf.DailyMealFee 
    FROM BaseFees bf
    JOIN AcademicYears ay ON bf.YearID = ay.YearID
    WHERE ay.IsActive = 1
    LIMIT 1
  `);

  return {
    packages,
    baseFee: fees[0] || { MonthlyTuition: 0, DailyMealFee: 0 }
  };
};

export const getAllFees = async () => {
  const [packages] = await pool.query(
    'SELECT PackageID as id, PackageName as name, DurationInMonths as duration, DiscountPercentage as discount FROM PaymentPackages'
  );

  const [baseFees] = await pool.query(`
    SELECT
      bf.FeeID as id,
      bf.YearID as yearId,
      ay.YearName as yearName,
      ay.IsActive as isActive,
      bf.MonthlyTuition as monthlyTuition,
      bf.DailyMealFee as dailyMealFee
    FROM BaseFees bf
    LEFT JOIN AcademicYears ay ON bf.YearID = ay.YearID
    ORDER BY bf.YearID DESC
  `);

  const [extracurriculars] = await pool.query(`
    SELECT
      ActivityID as id,
      ActivityName as name,
      MonthlyFee as monthlyFee,
      Description as description
    FROM Extracurriculars
    ORDER BY ActivityID ASC
  `);

  return {
    packages,
    baseFees,
    extracurriculars,
  };
};

export const createExtracurricular = async ({ name, monthlyFee, description }) => {
  const [result] = await pool.query(
    'INSERT INTO Extracurriculars (ActivityName, MonthlyFee, Description) VALUES (?, ?, ?)',
    [name, monthlyFee, description || null]
  );

  return {
    id: result.insertId,
    name,
    monthlyFee,
    description: description || null,
  };
};

export const updateExtracurricular = async (activityId, { name, monthlyFee, description }) => {
  const fields = [];
  const params = [];

  if (name !== undefined) {
    fields.push('ActivityName = ?');
    params.push(name);
  }
  if (monthlyFee !== undefined) {
    fields.push('MonthlyFee = ?');
    params.push(monthlyFee);
  }
  if (description !== undefined) {
    fields.push('Description = ?');
    params.push(description);
  }

  if (!fields.length) {
    return false;
  }

  params.push(activityId);
  const [result] = await pool.query(
    `UPDATE Extracurriculars SET ${fields.join(', ')} WHERE ActivityID = ?`,
    params
  );

  return result.affectedRows > 0;
};

export const updateBaseFee = async (feeId, { monthlyTuition, dailyMealFee }) => {
  const fields = [];
  const params = [];

  if (monthlyTuition !== undefined) {
    fields.push('MonthlyTuition = ?');
    params.push(monthlyTuition);
  }
  if (dailyMealFee !== undefined) {
    fields.push('DailyMealFee = ?');
    params.push(dailyMealFee);
  }

  if (!fields.length) {
    return false;
  }

  params.push(feeId);
  const [result] = await pool.query(
    `UPDATE BaseFees SET ${fields.join(', ')} WHERE FeeID = ?`,
    params
  );

  return result.affectedRows > 0;
};

export const createPaymentPackage = async ({ name, duration, discount }) => {
  const [result] = await pool.query(
    'INSERT INTO PaymentPackages (PackageName, DurationInMonths, DiscountPercentage) VALUES (?, ?, ?)',
    [name, duration, discount ?? 0]
  );

  return {
    id: result.insertId,
    name,
    duration,
    discount: discount ?? 0,
  };
};

export const updatePaymentPackage = async (packageId, { name, duration, discount }) => {
  const fields = [];
  const params = [];

  if (name !== undefined) {
    fields.push('PackageName = ?');
    params.push(name);
  }
  if (duration !== undefined) {
    fields.push('DurationInMonths = ?');
    params.push(duration);
  }
  if (discount !== undefined) {
    fields.push('DiscountPercentage = ?');
    params.push(discount);
  }

  if (!fields.length) {
    return false;
  }

  params.push(packageId);
  const [result] = await pool.query(
    `UPDATE PaymentPackages SET ${fields.join(', ')} WHERE PackageID = ?`,
    params
  );

  return result.affectedRows > 0;
};

export const getInvoices = async ({ studentId, billingMonth, paymentStatus, invoiceType } = {}) => {
  const conditions = [];
  const params = [];

  if (studentId) {
    conditions.push('i.StudentID = ?');
    params.push(studentId);
  }
  if (billingMonth) {
    conditions.push('i.BillingMonth = ?');
    params.push(billingMonth);
  }
  if (paymentStatus) {
    conditions.push('i.PaymentStatus = ?');
    params.push(paymentStatus);
  }
  if (invoiceType) {
    conditions.push('i.InvoiceType = ?');
    params.push(invoiceType);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(`
    SELECT
      i.InvoiceID as id,
      i.StudentID as studentId,
      s.FullName as studentFullName,
      s.ClassID as classId,
      c.ClassName as className,
      i.PackageID as packageId,
      pp.PackageName as packageName,
      i.PeriodRange as periodRange,
      i.BillingMonth as billingMonth,
      i.TuitionFee as tuitionFee,
      i.ExpectedMealFee as expectedMealFee,
      i.ExtracurricularFee as extracurricularFee,
      i.Surcharge as surcharge,
      i.RefundAmount as refundAmount,
      i.DiscountAmount as discountAmount,
      i.TotalAmount as totalAmount,
      i.PaymentStatus as paymentStatus,
      i.InvoiceType as invoiceType,
      i.CreatedAt as createdAt,
      i.DueDate as dueDate,
      i.ReminderSentAt as reminderSentAt,
      i.OverdueReminderSentAt as overdueReminderSentAt
    FROM Invoices i
    LEFT JOIN Students s ON i.StudentID = s.StudentID
    LEFT JOIN Classes c ON s.ClassID = c.ClassID
    LEFT JOIN PaymentPackages pp ON i.PackageID = pp.PackageID
    ${whereClause}
    ORDER BY i.CreatedAt DESC
  `, params);

  return rows;
};

export const getInvoiceDetail = async (invoiceId) => {
  const [rows] = await pool.query(`
    SELECT
      i.InvoiceID as id,
      i.StudentID as studentId,
      s.FullName as studentFullName,
      s.ClassID as classId,
      c.ClassName as className,
      i.PackageID as packageId,
      pp.PackageName as packageName,
      i.PeriodRange as periodRange,
      i.BillingMonth as billingMonth,
      i.TuitionFee as tuitionFee,
      i.ExpectedMealFee as expectedMealFee,
      i.ExtracurricularFee as extracurricularFee,
      i.Surcharge as surcharge,
      i.RefundAmount as refundAmount,
      i.DiscountAmount as discountAmount,
      i.TotalAmount as totalAmount,
      i.PaymentStatus as paymentStatus,
      i.InvoiceType as invoiceType,
      i.CreatedAt as createdAt,
      i.DueDate as dueDate,
      i.ReminderSentAt as reminderSentAt,
      i.OverdueReminderSentAt as overdueReminderSentAt
    FROM Invoices i
    LEFT JOIN Students s ON i.StudentID = s.StudentID
    LEFT JOIN Classes c ON s.ClassID = c.ClassID
    LEFT JOIN PaymentPackages pp ON i.PackageID = pp.PackageID
    WHERE i.InvoiceID = ?
  `, [invoiceId]);

  if (rows.length === 0) return null;

  const [transactions] = await pool.query(`
    SELECT
      TransactionID as id,
      AmountPaid as amountPaid,
      PaymentMethod as paymentMethod,
      TransactionCode as transactionCode,
      TransactionDate as transactionDate,
      Status as status
    FROM Transactions
    WHERE InvoiceID = ?
    ORDER BY TransactionDate DESC
  `, [invoiceId]);

  return { ...rows[0], transactions };
};

export const enrollStudent = async ({ student, parent, account, isNewParent, packageId }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let parentId = parent.id;

    if (isNewParent) {
      // 1. Create User
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(account.password, salt);
      
      const [userResult] = await connection.query(
        'INSERT INTO Users (Username, PasswordHash, RoleID, Status) VALUES (?, ?, 4, "Active")',
        [account.username, hashedPassword]
      );
      parentId = userResult.insertId;

      // 2. Create Parent
      await connection.query(
        'INSERT INTO Parents (ParentID, FullName, PhoneNumber, Email, Job, Address) VALUES (?, ?, ?, ?, ?, ?)',
        [parentId, parent.fullName, parent.phoneNumber, parent.email, parent.occupation, parent.address]
      );
    }

    // 3. Create Student
    const [studentResult] = await connection.query(
      'INSERT INTO Students (FullName, DateOfBirth, Gender, Allergies, AdmissionDate, EnrollmentStatus, ClassID) VALUES (?, ?, ?, ?, ?, "Active", NULL)',
      [student.fullName, student.dateOfBirth, student.gender, student.allergies, student.admissionDate]
    );
    const studentId = studentResult.insertId;

    // 4. Link Student and Parent
    await connection.query(
      'INSERT INTO StudentParents (StudentID, ParentID, Relationship, IsPrimary) VALUES (?, ?, "Phụ huynh", 1)',
      [studentId, parentId]
    );

    // 5. Create StudentTuitionPlan if packageId is provided
    if (packageId) {
      // Get base fee for current active year
      const [fees] = await connection.query(`
        SELECT bf.MonthlyTuition
        FROM BaseFees bf
        JOIN AcademicYears ay ON bf.YearID = ay.YearID
        WHERE ay.IsActive = 1
        LIMIT 1
      `);
      const monthlyTuitionSnapshot = fees.length > 0 ? fees[0].MonthlyTuition : 0;
      
      // Calculate start month from admission date (format YYYY-MM)
      const admissionDateObj = new Date(student.admissionDate * 1000);
      const startMonth = `${admissionDateObj.getFullYear()}-${String(admissionDateObj.getMonth() + 1).padStart(2, '0')}`;

      await connection.query(
        'INSERT INTO StudentTuitionPlans (StudentID, PackageID, StartMonth, MonthlyTuitionSnapshot, Status) VALUES (?, ?, ?, ?, "Active")',
        [studentId, packageId, startMonth, monthlyTuitionSnapshot]
      );
    }

    await connection.commit();
    return { studentId, parentId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const addParentToStudent = async (studentId, { parentId, isNewParent, parent, account, relationship, isPrimary }) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    let finalParentId = parentId;

    if (isNewParent) {
      // 1. Create User (if account provided) or just parent
      let userId = null;
      if (account) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(account.password, salt);
        const [userResult] = await connection.query(
          'INSERT INTO Users (Username, PasswordHash, RoleID, Status) VALUES (?, ?, 4, "Active")',
          [account.username, hashedPassword]
        );
        userId = userResult.insertId;
      }
      
      // 2. Create Parent
      const [parentResult] = await connection.query(
        'INSERT INTO Parents (ParentID, FullName, PhoneNumber, Email, Job, Address) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, parent.fullName, parent.phoneNumber, parent.email, parent.occupation, parent.address]
      );
      finalParentId = userId || parentResult.insertId;
    }

    // 3. Link Student and Parent
    await connection.query(
      'INSERT INTO StudentParents (StudentID, ParentID, Relationship, IsPrimary) VALUES (?, ?, ?, ?)',
      [studentId, finalParentId, relationship, isPrimary ? 1 : 0]
    );

    await connection.commit();
    return { studentId, parentId: finalParentId };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const parseCsvRows = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    Readable.from(fileBuffer)
      .pipe(csvParser())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
};

const parseXlsxRows = async (fileBuffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(fileBuffer);
  const worksheet = workbook.worksheets[0];
  if (!worksheet) return [];

  const headerRow = worksheet.getRow(1);
  const headers = [];
  headerRow.eachCell({ includeEmpty: false }, (cell, colNumber) => {
    headers[colNumber] = String(cell.value ?? '').trim();
  });

  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // skip header

    const rowData = {};
    row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
      const header = headers[colNumber];
      if (!header) return;

      let value = cell.value;
      // ExcelJS trả Date object nếu ô được format là ngày tháng — chuẩn hóa về dd/mm/yyyy
      // để dùng chung logic parse ngày với CSV bên dưới.
      if (value instanceof Date) {
        const d = String(value.getUTCDate()).padStart(2, '0');
        const m = String(value.getUTCMonth() + 1).padStart(2, '0');
        const y = value.getUTCFullYear();
        value = `${d}/${m}/${y}`;
      } else if (value && typeof value === 'object' && 'result' in value) {
        // Formula cell — dùng giá trị đã tính sẵn
        value = value.result;
      }

      rowData[header] = value !== null && value !== undefined ? String(value).trim() : '';
    });

    if (Object.keys(rowData).length > 0) rows.push(rowData);
  });

  return rows;
};

const SUPPORTED_IMPORT_EXTENSIONS = ['.csv', '.xlsx'];

export const importStudentsFromCSV = async (fileBuffer, originalFilename = '') => {
  const extension = originalFilename.toLowerCase().slice(originalFilename.lastIndexOf('.'));

  let results;
  if (extension === '.xlsx') {
    results = await parseXlsxRows(fileBuffer);
  } else if (extension === '.csv' || !SUPPORTED_IMPORT_EXTENSIONS.includes(extension)) {
    // Mặc định coi là CSV nếu không xác định được đuôi file (giữ hành vi cũ khi
    // FE không gửi kèm tên file gốc).
    results = await parseCsvRows(fileBuffer);
  } else {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Chỉ hỗ trợ file .csv hoặc .xlsx');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Snapshot học phí của năm học đang active — dùng chung cho mọi học sinh
    // có PackageID trong file (học sinh mới import chưa có lớp nên không thể
    // join Students → Classes → BaseFees như registerTuitionPlan bình thường).
    const [activeFeeRows] = await connection.query(`
      SELECT bf.MonthlyTuition
      FROM BaseFees bf
      JOIN AcademicYears ay ON bf.YearID = ay.YearID
      WHERE ay.IsActive = 1
      LIMIT 1
    `);
    const monthlyTuitionSnapshot = activeFeeRows.length > 0 ? activeFeeRows[0].MonthlyTuition : 0;

    const [packageRows] = await connection.query('SELECT PackageID FROM PaymentPackages');
    const validPackageIds = new Set(packageRows.map((p) => p.PackageID));

    let count = 0;
    let tuitionPlansCreated = 0;
    for (const row of results) {
      if (!row.FullName) continue;

      // Format dates from DD/MM/YYYY to timestamp
      let dateOfBirth = null;
      if (row.DateOfBirth) {
        const parts = row.DateOfBirth.split('/');
        if (parts.length === 3) {
          dateOfBirth = Math.floor(new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`).getTime() / 1000);
        }
      }

      let admissionDate = Math.floor(Date.now() / 1000);
      if (row.AdmissionDate) {
         const parts = row.AdmissionDate.split('/');
         if (parts.length === 3) {
           admissionDate = Math.floor(new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`).getTime() / 1000);
         }
      }

      const [studentResult] = await connection.query(
        'INSERT INTO Students (FullName, DateOfBirth, Gender, Allergies, AdmissionDate, EnrollmentStatus, ClassID) VALUES (?, ?, ?, ?, ?, "Active", NULL)',
        [row.FullName, dateOfBirth, row.Gender, row.Allergies, admissionDate]
      );
      count++;

      // Đăng ký gói học phí nếu file có cột PackageID hợp lệ
      const packageId = row.PackageID ? parseInt(row.PackageID, 10) : null;
      if (packageId && validPackageIds.has(packageId)) {
        const admissionDateObj = new Date(admissionDate * 1000);
        const startMonth = `${String(admissionDateObj.getUTCMonth() + 1).padStart(2, '0')}-${admissionDateObj.getUTCFullYear()}`;

        await connection.query(
          'INSERT INTO StudentTuitionPlans (StudentID, PackageID, StartMonth, MonthlyTuitionSnapshot, Status) VALUES (?, ?, ?, ?, "Active")',
          [studentResult.insertId, packageId, startMonth, monthlyTuitionSnapshot]
        );
        tuitionPlansCreated++;
      }
    }

    await connection.commit();
    return { imported: count, tuitionPlansCreated };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const assignStudentsToClass = async (studentIds, classId) => {
  if (studentIds.length === 0) return;
  const [classRows] = await pool.query('SELECT ClassID FROM Classes WHERE ClassID = ?', [classId]);
  if (classRows.length === 0) throw new Error('Không tìm thấy lớp');

  await pool.query('UPDATE Students SET ClassID = ? WHERE StudentID IN (?)', [classId, studentIds]);
};

export const endAcademicYear = async () => {
  // Find current active year
  const [activeYears] = await pool.query('SELECT YearID, YearName FROM AcademicYears WHERE IsActive = 1');
  if (activeYears.length === 0) throw new Error('Không có năm học nào đang hoạt động');
  
  // GradeID = 3 represents "Khối Lá". We need to find students in Khối Lá classes.
  // Wait, let's find students in Khối Lá:
  const queryLopLa = `
    SELECT s.StudentID 
    FROM Students s
    JOIN Classes c ON s.ClassID = c.ClassID
    JOIN Grades g ON c.GradeID = g.GradeID
    WHERE g.GradeName LIKE '%Lá%' OR g.GradeName LIKE '%5 tuổi%'
  `;
  const [laStudents] = await pool.query(queryLopLa);
  
  let graduatedCount = 0;
  if (laStudents.length > 0) {
    const studentIds = laStudents.map(s => s.StudentID);
    const updateResult = await pool.query(
      'UPDATE Students SET EnrollmentStatus = "Graduated", ClassID = NULL WHERE StudentID IN (?)',
      [studentIds]
    );
    graduatedCount = updateResult[0].affectedRows;
  }

  // Update remaining students to ClassID = NULL so they are waiting for placement in the new year.
  const [updateRemaining] = await pool.query(
    'UPDATE Students SET ClassID = NULL WHERE EnrollmentStatus = "Active"'
  );

  return {
    message: 'Đã hoàn tất tổng kết năm học',
    graduatedStudents: graduatedCount,
    waitingPlacement: updateRemaining.affectedRows
  };
};

export const startAcademicYear = async ({ yearName, startDate, endDate, monthlyTuition, dailyMealFee, isActive = true }) => {
  // Check if year already exists
  const [existing] = await pool.query('SELECT YearID FROM AcademicYears WHERE YearName = ?', [yearName]);
  if (existing.length > 0) throw new Error('Năm học này đã tồn tại');

  if (isActive) {
    // Set all years to inactive
    await pool.query('UPDATE AcademicYears SET IsActive = 0');
  }

  // Insert new year
  const [insertYear] = await pool.query(
    'INSERT INTO AcademicYears (YearName, StartDate, EndDate, IsActive) VALUES (?, ?, ?, ?)',
    [yearName, startDate, endDate, isActive ? 1 : 0]
  );
  const newYearId = insertYear.insertId;

  // Clone classes from the most recent inactive year
  // First find the last year ID
  const [lastYearRows] = await pool.query('SELECT YearID FROM AcademicYears WHERE YearID != ? ORDER BY YearID DESC LIMIT 1', [newYearId]);
  
  let clonedClassesCount = 0;
  if (lastYearRows.length > 0) {
    const lastYearId = lastYearRows[0].YearID;
    
    // Copy base fees
    await pool.query(
      'INSERT INTO BaseFees (YearID, MonthlyTuition, DailyMealFee) VALUES (?, ?, ?)',
      [newYearId, monthlyTuition, dailyMealFee]
    );

    // Copy classes
    const [oldClasses] = await pool.query('SELECT ClassName, GradeID, BuildingID FROM Classes WHERE YearID = ?', [lastYearId]);
    if (oldClasses.length > 0) {
      for (const c of oldClasses) {
        await pool.query(
          'INSERT INTO Classes (ClassName, GradeID, BuildingID, YearID) VALUES (?, ?, ?, ?)',
          [c.ClassName, c.GradeID, c.BuildingID, newYearId]
        );
      }
      clonedClassesCount = oldClasses.length;
    }
  } else {
    // Just create base fees
    await pool.query(
      'INSERT INTO BaseFees (YearID, MonthlyTuition, DailyMealFee) VALUES (?, ?, ?)',
      [newYearId, monthlyTuition, dailyMealFee]
    );
  }

  return {
    newYearId,
    yearName,
    clonedClassesCount,
    message: 'Năm học mới đã được bắt đầu'
  };
};

export const getAcademicYears = async () => {
  const [rows] = await pool.query('SELECT * FROM AcademicYears ORDER BY YearID DESC');
  return rows;
};

export const activateAcademicYear = async (yearId) => {
  // Check if year exists
  const [existing] = await pool.query('SELECT YearID FROM AcademicYears WHERE YearID = ?', [yearId]);
  if (existing.length === 0) throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy năm học');

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Set all to inactive
    await connection.query('UPDATE AcademicYears SET IsActive = 0');
    // Set the selected to active
    await connection.query('UPDATE AcademicYears SET IsActive = 1 WHERE YearID = ?', [yearId]);

    await connection.commit();
    return { message: 'Đã kích hoạt năm học thành công' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const EVENT_TYPES = ['Class', 'School', 'Holiday', 'Student'];

export const getEvents = async ({ eventType } = {}) => {
  const conditions = [];
  const params = [];

  if (eventType) {
    if (!EVENT_TYPES.includes(eventType)) {
      throw new ApiError(httpStatus.BAD_REQUEST, `eventType không hợp lệ, phải là một trong: ${EVENT_TYPES.join(', ')}`);
    }
    conditions.push('e.EventType = ?');
    params.push(eventType);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(`
    SELECT
      e.EventID as id,
      e.Title as title,
      e.Description as description,
      e.StartTime as startTime,
      e.EndTime as endTime,
      e.Location as location,
      e.Status as status,
      e.EventType as eventType,
      e.CreatedBy as createdBy,
      e.CreatedAt as createdAt,
      (
        SELECT COALESCE(JSON_ARRAYAGG(ec.ClassID), '[]')
        FROM EventClasses ec WHERE ec.EventID = e.EventID
      ) as classIds,
      (
        SELECT COALESCE(JSON_ARRAYAGG(es.StudentID), '[]')
        FROM EventStudents es WHERE es.EventID = e.EventID
      ) as studentIds
    FROM Events e
    ${whereClause}
    ORDER BY e.StartTime DESC
  `, params);

  return rows.map((row) => ({
    ...row,
    classIds: typeof row.classIds === 'string' ? JSON.parse(row.classIds) : row.classIds,
    studentIds: typeof row.studentIds === 'string' ? JSON.parse(row.studentIds) : row.studentIds,
  }));
};

const getEventById = async (eventId, connection = pool) => {
  const [rows] = await connection.query(`
    SELECT
      e.EventID as id,
      e.Title as title,
      e.Description as description,
      e.StartTime as startTime,
      e.EndTime as endTime,
      e.Location as location,
      e.Status as status,
      e.EventType as eventType,
      e.CreatedBy as createdBy,
      e.CreatedAt as createdAt,
      (
        SELECT COALESCE(JSON_ARRAYAGG(ec.ClassID), '[]')
        FROM EventClasses ec WHERE ec.EventID = e.EventID
      ) as classIds,
      (
        SELECT COALESCE(JSON_ARRAYAGG(es.StudentID), '[]')
        FROM EventStudents es WHERE es.EventID = e.EventID
      ) as studentIds
    FROM Events e
    WHERE e.EventID = ?
  `, [eventId]);

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    ...row,
    classIds: typeof row.classIds === 'string' ? JSON.parse(row.classIds) : row.classIds,
    studentIds: typeof row.studentIds === 'string' ? JSON.parse(row.studentIds) : row.studentIds,
  };
};

export const createEvent = async ({
  title,
  description,
  startTime,
  endTime,
  location,
  status = 'Upcoming',
  eventType,
  createdBy,
  classIds = [],
  studentIds = [],
}) => {
  if (!EVENT_TYPES.includes(eventType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `eventType không hợp lệ, phải là một trong: ${EVENT_TYPES.join(', ')}`);
  }

  if (eventType === 'Class' && classIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'eventType "Class" cần truyền ít nhất 1 classId trong classIds');
  }
  if (eventType === 'Student' && studentIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'eventType "Student" cần truyền ít nhất 1 studentId trong studentIds');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `INSERT INTO Events (Title, Description, StartTime, EndTime, Location, Status, EventType, CreatedBy)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description || null, startTime, endTime, location || null, status, eventType, createdBy || null]
    );
    const eventId = result.insertId;

    if (eventType === 'Class' && classIds.length > 0) {
      const values = classIds.map((classId) => [eventId, classId]);
      await connection.query('INSERT INTO EventClasses (EventID, ClassID) VALUES ?', [values]);
    }

    if (eventType === 'Student' && studentIds.length > 0) {
      const values = studentIds.map((studentId) => [eventId, studentId]);
      await connection.query('INSERT INTO EventStudents (EventID, StudentID) VALUES ?', [values]);
    }

    await connection.commit();

    const event = {
      id: eventId,
      title,
      description: description || null,
      startTime,
      endTime,
      location: location || null,
      status,
      eventType,
      createdBy: createdBy || null,
      classIds: eventType === 'Class' ? classIds : [],
      studentIds: eventType === 'Student' ? studentIds : [],
    };

    // Gửi thông báo sau khi đã commit thành công — lỗi gửi push không được
    // làm hỏng việc tạo sự kiện đã xong (giống pattern notifyParentsOfInvoice).
    notifyParentsOfEvent(event, 'created').catch((error) => {
      logger.error(`[Event Notification] Lỗi khi gửi thông báo cho EventID ${eventId}: ${error.message}`);
    });

    return event;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const updateEvent = async (eventId, {
  title,
  description,
  startTime,
  endTime,
  location,
  status,
  eventType,
  classIds,
  studentIds,
}) => {
  const existing = await getEventById(eventId);
  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy sự kiện');
  }

  const resolvedEventType = eventType || existing.eventType;
  if (!EVENT_TYPES.includes(resolvedEventType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `eventType không hợp lệ, phải là một trong: ${EVENT_TYPES.join(', ')}`);
  }

  const resolvedClassIds = classIds !== undefined ? classIds : existing.classIds;
  const resolvedStudentIds = studentIds !== undefined ? studentIds : existing.studentIds;

  if (resolvedEventType === 'Class' && resolvedClassIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'eventType "Class" cần truyền ít nhất 1 classId trong classIds');
  }
  if (resolvedEventType === 'Student' && resolvedStudentIds.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'eventType "Student" cần truyền ít nhất 1 studentId trong studentIds');
  }

  const fields = [];
  const params = [];
  if (title !== undefined) { fields.push('Title = ?'); params.push(title); }
  if (description !== undefined) { fields.push('Description = ?'); params.push(description); }
  if (startTime !== undefined) { fields.push('StartTime = ?'); params.push(startTime); }
  if (endTime !== undefined) { fields.push('EndTime = ?'); params.push(endTime); }
  if (location !== undefined) { fields.push('Location = ?'); params.push(location); }
  if (status !== undefined) { fields.push('Status = ?'); params.push(status); }
  if (eventType !== undefined) { fields.push('EventType = ?'); params.push(eventType); }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    if (fields.length > 0) {
      params.push(eventId);
      await connection.query(`UPDATE Events SET ${fields.join(', ')} WHERE EventID = ?`, params);
    }

    // Nếu eventType hoặc classIds/studentIds được truyền, làm mới lại toàn bộ liên kết
    if (classIds !== undefined || eventType !== undefined) {
      await connection.query('DELETE FROM EventClasses WHERE EventID = ?', [eventId]);
      if (resolvedEventType === 'Class' && resolvedClassIds.length > 0) {
        const values = resolvedClassIds.map((classId) => [eventId, classId]);
        await connection.query('INSERT INTO EventClasses (EventID, ClassID) VALUES ?', [values]);
      }
    }
    if (studentIds !== undefined || eventType !== undefined) {
      await connection.query('DELETE FROM EventStudents WHERE EventID = ?', [eventId]);
      if (resolvedEventType === 'Student' && resolvedStudentIds.length > 0) {
        const values = resolvedStudentIds.map((studentId) => [eventId, studentId]);
        await connection.query('INSERT INTO EventStudents (EventID, StudentID) VALUES ?', [values]);
      }
    }

    await connection.commit();

    const updated = await getEventById(eventId);

    notifyParentsOfEvent(updated, 'updated').catch((error) => {
      logger.error(`[Event Notification] Lỗi khi gửi thông báo cập nhật cho EventID ${eventId}: ${error.message}`);
    });

    return updated;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const deleteEvent = async (eventId) => {
  const existing = await getEventById(eventId);
  if (!existing) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy sự kiện');
  }

  // Gửi thông báo hủy TRƯỚC khi xóa — sau khi xóa, EventClasses/EventStudents
  // đã mất theo cascade nên sẽ không còn xác định được ai cần nhận thông báo.
  await notifyParentsOfEvent(existing, 'cancelled').catch((error) => {
    logger.error(`[Event Notification] Lỗi khi gửi thông báo hủy cho EventID ${eventId}: ${error.message}`);
  });

  // ON DELETE CASCADE trên EventClasses/EventStudents tự dọn theo Events
  await pool.query('DELETE FROM Events WHERE EventID = ?', [eventId]);

  return { message: 'Đã xóa sự kiện thành công' };
};

/**
 * Gửi thông báo cho phụ huynh liên quan tới 1 sự kiện (tạo mới / cập nhật / hủy).
 * - Class: phụ huynh của học sinh đang học trong các lớp classIds.
 * - Student: phụ huynh của các học sinh studentIds.
 * - School / Holiday: toàn bộ phụ huynh trong trường.
 * @param {object} event
 * @param {'created'|'updated'|'cancelled'} kind
 */
const notifyParentsOfEvent = async (event, kind = 'created') => {
  let parentIds = [];

  if (event.eventType === 'Class') {
    const [rows] = await pool.query(
      `SELECT DISTINCT sp.ParentID
       FROM Students s
       JOIN StudentParents sp ON sp.StudentID = s.StudentID
       WHERE s.ClassID IN (?)`,
      [event.classIds]
    );
    parentIds = rows.map((r) => r.ParentID);
  } else if (event.eventType === 'Student') {
    const [rows] = await pool.query(
      'SELECT DISTINCT ParentID FROM StudentParents WHERE StudentID IN (?)',
      [event.studentIds]
    );
    parentIds = rows.map((r) => r.ParentID);
  } else {
    const [rows] = await pool.query('SELECT ParentID FROM Parents');
    parentIds = rows.map((r) => r.ParentID);
  }

  if (parentIds.length === 0) return;

  const startDate = new Date(event.startTime * 1000).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  const titleByKind = {
    created: 'Sự kiện mới',
    updated: 'Sự kiện đã được cập nhật',
    cancelled: 'Sự kiện đã bị hủy',
  };
  const bodyByKind = {
    created: `${event.title} — bắt đầu lúc ${startDate}${event.location ? ` tại ${event.location}` : ''}`,
    updated: `${event.title} vừa được cập nhật — bắt đầu lúc ${startDate}${event.location ? ` tại ${event.location}` : ''}`,
    cancelled: `Sự kiện "${event.title}" (dự kiến lúc ${startDate}) đã bị hủy`,
  };
  const typeByKind = {
    created: 'EVENT_CREATED',
    updated: 'EVENT_UPDATED',
    cancelled: 'EVENT_CANCELLED',
  };

  const results = await Promise.allSettled(
    parentIds.map((parentId) =>
      sendPushToUser(
        parentId,
        titleByKind[kind],
        bodyByKind[kind],
        { type: typeByKind[kind], eventId: String(event.id), eventType: event.eventType }
      )
    )
  );

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      logger.error(`[Event Notification] Lỗi gửi push ParentID ${parentIds[i]} cho EventID ${event.id}: ${result.reason?.message}`);
    }
  });
};

export const getHolidays = async ({ yearId } = {}) => {
  const conditions = [];
  const params = [];

  if (yearId) {
    conditions.push('h.YearID = ?');
    params.push(yearId);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(`
    SELECT
      h.HolidayID as id,
      h.HolidayDate as holidayDate,
      h.HolidayName as holidayName,
      h.YearID as yearId,
      ay.YearName as yearName
    FROM Holidays h
    LEFT JOIN AcademicYears ay ON h.YearID = ay.YearID
    ${whereClause}
    ORDER BY h.HolidayDate ASC
  `, params);

  return rows;
};

export const createHoliday = async ({ holidayDate, holidayName, yearId }) => {
  if (yearId) {
    const [yearRows] = await pool.query('SELECT YearID FROM AcademicYears WHERE YearID = ?', [yearId]);
    if (yearRows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy năm học');
    }
  }

  const [result] = await pool.query(
    'INSERT INTO Holidays (HolidayDate, HolidayName, YearID) VALUES (?, ?, ?)',
    [holidayDate, holidayName || null, yearId || null]
  );

  return {
    id: result.insertId,
    holidayDate,
    holidayName: holidayName || null,
    yearId: yearId || null,
  };
};

export const updateHoliday = async (holidayId, { holidayDate, holidayName, yearId }) => {
  const [existing] = await pool.query('SELECT HolidayID FROM Holidays WHERE HolidayID = ?', [holidayId]);
  if (existing.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy ngày nghỉ lễ');
  }

  if (yearId !== undefined && yearId !== null) {
    const [yearRows] = await pool.query('SELECT YearID FROM AcademicYears WHERE YearID = ?', [yearId]);
    if (yearRows.length === 0) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy năm học');
    }
  }

  const fields = [];
  const params = [];
  if (holidayDate !== undefined) { fields.push('HolidayDate = ?'); params.push(holidayDate); }
  if (holidayName !== undefined) { fields.push('HolidayName = ?'); params.push(holidayName); }
  if (yearId !== undefined) { fields.push('YearID = ?'); params.push(yearId); }

  if (fields.length === 0) {
    return false;
  }

  params.push(holidayId);
  await pool.query(`UPDATE Holidays SET ${fields.join(', ')} WHERE HolidayID = ?`, params);

  return true;
};

export const deleteHoliday = async (holidayId) => {
  const [result] = await pool.query('DELETE FROM Holidays WHERE HolidayID = ?', [holidayId]);
  return result.affectedRows > 0;
};

// ── Monthly Schedule Approval ───────────────────────────────────────────────

export const getMonthlySchedules = async ({ year, month, approvedStatus, classId } = {}) => {
  const conditions = [];
  const params = [];

  if (year !== undefined) { conditions.push('ms.Year = ?'); params.push(year); }
  if (month !== undefined) { conditions.push('ms.Month = ?'); params.push(month); }
  if (approvedStatus !== undefined) { conditions.push('ms.ApprovedStatus = ?'); params.push(approvedStatus); }
  if (classId !== undefined) { conditions.push('ms.ClassID = ?'); params.push(classId); }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(`
    SELECT
      ms.MonthlyScheduleID as id,
      ms.ClassID as classId,
      c.ClassName as className,
      g.GradeName as gradeName,
      ms.Month as month,
      ms.Year as year,
      ms.MonthTheme as monthTheme,
      ms.ApprovedStatus as approvedStatus,
      ms.IsActive as isActive,
      ms.CreatedAt as createdAt,
      ms.UpdatedAt as updatedAt
    FROM MonthlySchedules ms
    JOIN Classes c ON ms.ClassID = c.ClassID
    LEFT JOIN Grades g ON c.GradeID = g.GradeID
    ${whereClause}
    ORDER BY ms.Year DESC, ms.Month DESC, ms.CreatedAt DESC
  `, params);

  return rows;
};

export const getMonthlyScheduleDetail = async (monthlyScheduleId) => {
  const [rows] = await pool.query(`
    SELECT
      ms.MonthlyScheduleID as id,
      ms.ClassID as classId,
      c.ClassName as className,
      g.GradeName as gradeName,
      ms.Month as month,
      ms.Year as year,
      ms.MonthTheme as monthTheme,
      ms.ApprovedStatus as approvedStatus,
      ms.IsActive as isActive,
      ms.CreatedAt as createdAt,
      ms.UpdatedAt as updatedAt
    FROM MonthlySchedules ms
    JOIN Classes c ON ms.ClassID = c.ClassID
    LEFT JOIN Grades g ON c.GradeID = g.GradeID
    WHERE ms.MonthlyScheduleID = ?
  `, [monthlyScheduleId]);

  if (rows.length === 0) return null;

  const weeks = await getWeeksByMonthly(monthlyScheduleId);

  return { ...rows[0], weeks };
};

export const approveMonthlySchedule = async (monthlyScheduleId, approvedStatus) => {
  const [existing] = await pool.query(
    'SELECT MonthlyScheduleID, ClassID, Month, Year FROM MonthlySchedules WHERE MonthlyScheduleID = ?',
    [monthlyScheduleId]
  );
  if (existing.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu tháng');
  }

  await pool.query(
    'UPDATE MonthlySchedules SET ApprovedStatus = ?, UpdatedAt = ? WHERE MonthlyScheduleID = ?',
    [approvedStatus, Math.floor(Date.now() / 1000), monthlyScheduleId]
  );

  const schedule = existing[0];
  notifyTeachersOfScheduleApproval(schedule, approvedStatus).catch((error) => {
    logger.error(`[Schedule Notification] Lỗi khi gửi thông báo duyệt cho MonthlyScheduleID ${monthlyScheduleId}: ${error.message}`);
  });

  return { message: approvedStatus === 1 ? 'Đã duyệt thời khóa biểu tháng' : 'Đã từ chối thời khóa biểu tháng' };
};

export const activeMonthlySchedule = async (monthlyScheduleId, isActive) => {
  const [existing] = await pool.query(
    'SELECT MonthlyScheduleID, ClassID, ApprovedStatus FROM MonthlySchedules WHERE MonthlyScheduleID = ?',
    [monthlyScheduleId]
  );
  if (existing.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy thời khóa biểu tháng');
  }

  const schedule = existing[0];

  if (isActive && schedule.ApprovedStatus !== 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Chỉ có thể kích hoạt thời khóa biểu đã được duyệt');
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    if (isActive) {
      // Vô hiệu hóa các thời khóa biểu tháng khác của CÙNG LỚP
      await connection.query(
        'UPDATE MonthlySchedules SET IsActive = 0 WHERE ClassID = ?',
        [schedule.ClassID]
      );
    }

    await connection.query(
      'UPDATE MonthlySchedules SET IsActive = ?, UpdatedAt = ? WHERE MonthlyScheduleID = ?',
      [isActive ? 1 : 0, Math.floor(Date.now() / 1000), monthlyScheduleId]
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  return { message: isActive ? 'Đã kích hoạt thời khóa biểu' : 'Đã vô hiệu hóa thời khóa biểu' };
};

const notifyTeachersOfScheduleApproval = async (schedule, approvedStatus) => {
  const [rows] = await pool.query(
    'SELECT DISTINCT TeacherID FROM ClassTeachers WHERE ClassID = ?',
    [schedule.ClassID]
  );
  const teacherIds = rows.map((r) => r.TeacherID);
  if (teacherIds.length === 0) return;

  const title = approvedStatus === 1 ? 'Thời khóa biểu đã được duyệt' : 'Thời khóa biểu bị từ chối';
  const body = approvedStatus === 1
    ? `Thời khóa biểu tháng ${schedule.Month}/${schedule.Year} đã được hiệu trưởng duyệt.`
    : `Thời khóa biểu tháng ${schedule.Month}/${schedule.Year} đã bị từ chối, vui lòng chỉnh sửa lại.`;

  const results = await Promise.allSettled(
    teacherIds.map((teacherId) =>
      sendPushToUser(
        teacherId,
        title,
        body,
        { type: 'MONTHLY_SCHEDULE_APPROVAL', monthlyScheduleId: String(schedule.MonthlyScheduleID), approvedStatus: String(approvedStatus) }
      )
    )
  );

  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      logger.error(`[Schedule Notification] Lỗi gửi push TeacherID ${teacherIds[i]} cho MonthlyScheduleID ${schedule.MonthlyScheduleID}: ${result.reason?.message}`);
    }
  });
};

// ── Menus ────────────────────────────────────────────────────────────────

export const getMenus = async ({ classId, year, weekNumber } = {}) => {
  const conditions = [];
  const params = [];

  if (classId !== undefined) { conditions.push('m.ClassID = ?'); params.push(classId); }
  if (year !== undefined) { conditions.push('m.Year = ?'); params.push(year); }
  if (weekNumber !== undefined) { conditions.push('m.WeekNumber = ?'); params.push(weekNumber); }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [rows] = await pool.query(`
    SELECT
      m.MenuID as id,
      m.ClassID as classId,
      c.ClassName as className,
      m.WeekNumber as weekNumber,
      m.Year as year,
      m.MenuName as menuName,
      m.CreatedAt as createdAt,
      m.UpdatedAt as updatedAt
    FROM Menus m
    JOIN Classes c ON m.ClassID = c.ClassID
    ${whereClause}
    ORDER BY m.Year DESC, m.WeekNumber DESC
  `, params);

  return rows;
};

const DAY_OF_WEEK_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MEAL_TYPE_ORDER = ['Breakfast', 'Lunch', 'Snack'];

export const getMenuDetail = async (menuId) => {
  const [rows] = await pool.query(`
    SELECT
      m.MenuID as id,
      m.ClassID as classId,
      c.ClassName as className,
      m.WeekNumber as weekNumber,
      m.Year as year,
      m.MenuName as menuName,
      m.CreatedAt as createdAt,
      m.UpdatedAt as updatedAt
    FROM Menus m
    JOIN Classes c ON m.ClassID = c.ClassID
    WHERE m.MenuID = ?
  `, [menuId]);

  if (rows.length === 0) return null;

  const [detailRows] = await pool.query(`
    SELECT
      MenuDetailID as id,
      MenuID as menuId,
      DayOfWeek as dayOfWeek,
      MealType as mealType,
      DishName as dishName,
      Calories as calories,
      NutritionalDetails as nutritionalDetails
    FROM MenuDetails
    WHERE MenuID = ?
    ORDER BY FIELD(DayOfWeek, ${DAY_OF_WEEK_ORDER.map(() => '?').join(',')}),
             FIELD(MealType, ${MEAL_TYPE_ORDER.map(() => '?').join(',')})
  `, [menuId, ...DAY_OF_WEEK_ORDER, ...MEAL_TYPE_ORDER]);

  return { ...rows[0], menuDetails: detailRows };
};

export const deleteMenu = async (menuId) => {
  // ON DELETE CASCADE trên MenuDetails.MenuID tự dọn theo Menus
  const [result] = await pool.query('DELETE FROM Menus WHERE MenuID = ?', [menuId]);
  return result.affectedRows > 0;
};

/**
 * Đọc toàn bộ file (CSV hoặc XLSX) thành lưới 2 chiều các chuỗi thô (raw grid),
 * không giả định vị trí header — dùng cho các file có nhiều vùng dữ liệu như menu import.
 */
const parseRawGrid = async (fileBuffer, extension) => {
  if (extension === '.xlsx') {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(fileBuffer);
    const worksheet = workbook.worksheets[0];
    if (!worksheet) return [];

    const grid = [];
    worksheet.eachRow({ includeEmpty: true }, (row) => {
      const rowValues = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        let value = cell.value;
        if (value && typeof value === 'object' && 'result' in value) value = value.result;
        rowValues.push(value !== null && value !== undefined ? String(value).trim() : '');
      });
      grid.push(rowValues);
    });
    return grid;
  }

  // CSV: đọc raw text, tự tách dòng/cột (không dùng csv-parser vì nó giả định
  // 1 header cố định cho toàn bộ file, không phù hợp layout nhiều vùng).
  const text = fileBuffer.toString('utf-8');
  return text
    .split(/\r?\n/)
    .filter((line) => line.length > 0)
    .map((line) => line.split(',').map((cell) => cell.trim()));
};

/**
 * Parse 1 file menu theo layout 2 vùng:
 * - Hàng 1: header vùng info (ClassID,WeekNumber,Year,MenuName)
 * - Hàng 2: data vùng info
 * - Hàng 3: dòng trống (bỏ qua)
 * - Hàng 4: header vùng chi tiết (DayOfWeek,MealType,DishName,Calories,NutritionalDetails)
 * - Hàng 5+: data vùng chi tiết
 */
const parseMenuFile = async (fileBuffer, originalFilename) => {
  const extension = originalFilename.toLowerCase().slice(originalFilename.lastIndexOf('.'));
  if (!['.csv', '.xlsx'].includes(extension)) {
    throw new Error(`Chỉ hỗ trợ file .csv hoặc .xlsx (file "${originalFilename}" không hợp lệ)`);
  }

  const grid = await parseRawGrid(fileBuffer, extension);
  const nonEmptyRows = grid.filter((row) => row.some((cell) => cell !== ''));

  if (nonEmptyRows.length < 4) {
    throw new Error('File không đúng định dạng — cần ít nhất: hàng header info, hàng data info, hàng header chi tiết, và 1 hàng chi tiết');
  }

  const infoHeader = nonEmptyRows[0].map((h) => h.trim());
  const infoData = nonEmptyRows[1];
  const infoRow = {};
  infoHeader.forEach((h, i) => { infoRow[h] = infoData[i] !== undefined ? infoData[i].trim() : ''; });

  const classId = parseInt(infoRow.ClassID, 10);
  const weekNumber = parseInt(infoRow.WeekNumber, 10);
  const year = parseInt(infoRow.Year, 10);
  const menuName = infoRow.MenuName || null;

  if (!classId || !weekNumber || !year) {
    throw new Error('Vùng thông tin (hàng 1-2) thiếu hoặc sai ClassID/WeekNumber/Year');
  }

  const detailHeader = nonEmptyRows[2].map((h) => h.trim());
  const detailRows = nonEmptyRows.slice(3);

  const details = detailRows.map((row) => {
    const item = {};
    detailHeader.forEach((h, i) => { item[h] = row[i] !== undefined ? row[i].trim() : ''; });
    return item;
  }).filter((item) => item.DayOfWeek || item.DishName);

  for (const item of details) {
    if (!DAY_OF_WEEK_ORDER.includes(item.DayOfWeek)) {
      throw new Error(`DayOfWeek "${item.DayOfWeek}" không hợp lệ (phải là: ${DAY_OF_WEEK_ORDER.join(', ')})`);
    }
    if (!MEAL_TYPE_ORDER.includes(item.MealType)) {
      throw new Error(`MealType "${item.MealType}" không hợp lệ (phải là: ${MEAL_TYPE_ORDER.join(', ')})`);
    }
    if (!item.DishName) {
      throw new Error(`Thiếu DishName cho dòng ${item.DayOfWeek}/${item.MealType}`);
    }
  }

  return { classId, weekNumber, year, menuName, details };
};

export const importMenus = async (files) => {
  const parsed = [];

  // Bước 1: parse + validate cấu trúc từng file TRƯỚC khi đụng vào DB —
  // đảm bảo lỗi format không để lại thay đổi nửa vời trong transaction.
  for (const file of files) {
    try {
      const menuData = await parseMenuFile(file.buffer, file.originalname);
      parsed.push({ filename: file.originalname, menuData, error: null });
    } catch (error) {
      parsed.push({ filename: file.originalname, menuData: null, error: error.message });
    }
  }

  const parseErrors = parsed.filter((p) => p.error);
  if (parseErrors.length > 0) {
    return parsed.map((p) => ({
      filename: p.filename,
      success: false,
      message: p.error || 'Không được xử lý do có file khác trong lô bị lỗi',
    }));
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const results = [];
    for (const { filename, menuData } of parsed) {
      const [classRows] = await connection.query('SELECT ClassID FROM Classes WHERE ClassID = ?', [menuData.classId]);
      if (classRows.length === 0) {
        throw new Error(`File "${filename}": không tìm thấy lớp với ClassID = ${menuData.classId}`);
      }

      const [existing] = await connection.query(
        'SELECT MenuID FROM Menus WHERE ClassID = ? AND WeekNumber = ? AND Year = ?',
        [menuData.classId, menuData.weekNumber, menuData.year]
      );
      if (existing.length > 0) {
        throw new Error(`File "${filename}": đã tồn tại thực đơn cho lớp này ở tuần ${menuData.weekNumber}/${menuData.year}`);
      }

      const [menuResult] = await connection.query(
        'INSERT INTO Menus (ClassID, WeekNumber, Year, MenuName) VALUES (?, ?, ?, ?)',
        [menuData.classId, menuData.weekNumber, menuData.year, menuData.menuName]
      );
      const menuId = menuResult.insertId;

      for (const item of menuData.details) {
        await connection.query(
          'INSERT INTO MenuDetails (MenuID, DayOfWeek, MealType, DishName, Calories, NutritionalDetails) VALUES (?, ?, ?, ?, ?, ?)',
          [menuId, item.DayOfWeek, item.MealType, item.DishName, item.Calories || null, item.NutritionalDetails || null]
        );
      }

      results.push({ filename, success: true, menuId });
    }

    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    // 1 file lỗi ở bước DB → rollback toàn bộ (all-or-nothing), nhưng vẫn chỉ rõ
    // file nào gây lỗi; các file khác được đánh dấu không xử lý được vì lô bị hủy.
    return parsed.map(({ filename }) => ({
      filename,
      success: false,
      message: error.message.startsWith(`File "${filename}"`)
        ? error.message
        : `Không được xử lý do lô import bị hủy (lỗi: ${error.message})`,
    }));
  } finally {
    connection.release();
  }
};
