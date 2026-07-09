import pool from '../../config/db.js';
import bcrypt from 'bcryptjs';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';

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
      c.ClassName AS className
    FROM Grades g
    LEFT JOIN Classes c ON g.GradeID = c.GradeID AND (
      c.YearID = (SELECT YearID FROM AcademicYears WHERE IsActive = 1 LIMIT 1)
    )
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
        className: row.className
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
  const { username, fullName, phoneNumber, email } = payload;

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
        'INSERT INTO Teachers (TeacherID, FullName, PhoneNumber, Email) VALUES (?, ?, ?, ?)',
        [userId, fullName, phoneNumber || null, email || null]
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
    SELECT c.ClassID AS classId, c.ClassName AS className, g.GradeName AS gradeName
    FROM Classes c
    JOIN Grades g ON c.GradeID = g.GradeID
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
  const [classRows] = await pool.query('SELECT ClassName FROM Classes WHERE ClassID = ?', [classId]);
  if (classRows.length === 0) throw new Error('Không tìm thấy lớp');

  const [teacherRows] = await pool.query('SELECT FullName FROM Teachers WHERE TeacherID = ?', [teacherId]);
  if (teacherRows.length === 0) throw new Error('Không tìm thấy giáo viên');

  const assignedTimestamp = assignedDate || Math.floor(Date.now() / 1000);

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
