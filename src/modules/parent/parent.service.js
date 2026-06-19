import pool from '../../config/db.js';

/**
 * Get all children of a parent by ParentID
 * @param {number} parentId
 * @returns {Promise<Array>} List of children
 */
export const getChildrenByParentId = async (parentId) => {
  const query = `
    SELECT 
      s.StudentID AS studentId,
      s.FullName AS fullName,
      s.DateOfBirth AS dateOfBirth,
      s.Gender AS gender,
      s.Allergies AS allergies,
      s.AdmissionDate AS admissionDate,
      s.EnrollmentStatus AS enrollmentStatus,
      s.AvatarURL AS avatarUrl,
      s.ClassID AS classId,
      c.ClassName AS className,
      g.GradeName AS gradeName,
      ay.YearName AS academicYearName,
      b.BuildingID AS buildingId,
      b.BuildingName AS buildingName,
      cp.CampusID AS campusId,
      cp.CampusName AS campusName,
      cp.Address AS campusAddress,
      sp.Relationship AS relationship,
      sp.IsPrimary AS isPrimary
    FROM StudentParents sp
    JOIN Students s ON sp.StudentID = s.StudentID
    LEFT JOIN Classes c ON s.ClassID = c.ClassID
    LEFT JOIN Grades g ON c.GradeID = g.GradeID
    LEFT JOIN AcademicYears ay ON c.YearID = ay.YearID
    LEFT JOIN Buildings b ON c.BuildingID = b.BuildingID
    LEFT JOIN Campuses cp ON b.CampusID = cp.CampusID
    WHERE sp.ParentID = ?
  `;
  const [rows] = await pool.query(query, [parentId]);

  if (rows.length === 0) {
    return [];
  }

  // Extract unique, non-null class IDs
  const classIds = [...new Set(rows.map(r => r.classId).filter(id => id !== null))];

  let teachers = [];
  if (classIds.length > 0) {
    const placeholders = classIds.map(() => '?').join(',');
    const [teacherRows] = await pool.query(
      `SELECT 
        ct.ClassID AS classId,
        t.TeacherID AS teacherId,
        t.FullName AS fullName,
        t.PhoneNumber AS phoneNumber,
        t.Email AS email,
        ct.RoleInClass AS roleInClass
       FROM ClassTeachers ct
       JOIN Teachers t ON ct.TeacherID = t.TeacherID
       WHERE ct.ClassID IN (${placeholders})`,
      classIds
    );
    teachers = teacherRows;
  }

  // Map teachers by classId
  const teachersByClass = {};
  for (const teacher of teachers) {
    if (!teachersByClass[teacher.classId]) {
      teachersByClass[teacher.classId] = [];
    }
    teachersByClass[teacher.classId].push({
      teacherId: teacher.teacherId,
      fullName: teacher.fullName,
      phoneNumber: teacher.phoneNumber,
      email: teacher.email,
      roleInClass: teacher.roleInClass
    });
  }

  // Attach teachers to each child
  return rows.map(child => ({
    ...child,
    teachers: teachersByClass[child.classId] || []
  }));
};

/**
 * Get parent profile by ParentID
 * @param {number} parentId
 * @returns {Promise<Object|null>} Parent profile
 */
export const getParentProfileById = async (parentId) => {
  const query = `
    SELECT 
      ParentID AS parentId,
      FullName AS fullName,
      PhoneNumber AS phoneNumber,
      Email AS email,
      IDCard AS idCard,
      Job AS job,
      Address AS address,
      AvatarURL AS avatarUrl
    FROM Parents
    WHERE ParentID = ?
  `;
  const [rows] = await pool.query(query, [parentId]);
  return rows.length > 0 ? rows[0] : null;
};


