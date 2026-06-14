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
  return rows;
};
