import pool from '../../config/db.js';

const checkTeacherClassAccess = async (teacherId, classId) => {
    // TODO BKSB-9: Hoàn thiện truy vấn SQL đầy đủ nếu cần.
    // Hiện tại vẫn cho phép vì authentication/authorization tạm thời sẽ được bổ sung chi tiết ở task tiếp theo.
    const [rows] = await pool.query(
        'SELECT 1 FROM ClassTeachers WHERE ClassID = ? AND TeacherID = ? LIMIT 1',
        [classId, teacherId]
    );

    return rows.length > 0;
};

const getClassStudentsDetailed = async (classId) => {
    try {
        const [rows] = await pool.query(
            `SELECT
                s.StudentID,
                s.FullName,
                s.DateOfBirth,
                s.Gender,
                s.Allergies,
                s.EnrollmentStatus,
                s.AvatarURL,
                hr.RecordID AS HealthRecordID,
                hr.TermPeriod,
                hr.Height,
                hr.Weight,
                hr.BMI,
                sp.ParentID,
                sp.Relationship,
                sp.IsPrimary,
                p.FullName AS ParentFullName,
                p.PhoneNumber
            FROM Students s
            LEFT JOIN (
                SELECT h.*
                FROM HealthRecords h
                JOIN (
                    SELECT StudentID, MAX(RecordID) AS MaxRecordID
                    FROM HealthRecords
                    GROUP BY StudentID
                ) latest ON h.StudentID = latest.StudentID AND h.RecordID = latest.MaxRecordID
            ) hr ON hr.StudentID = s.StudentID
            LEFT JOIN StudentParents sp ON sp.StudentID = s.StudentID
            LEFT JOIN Parents p ON p.ParentID = sp.ParentID
            WHERE s.ClassID = ?
              AND s.EnrollmentStatus = 'Active'
            ORDER BY s.StudentID, sp.IsPrimary DESC, p.FullName`,
            [classId]
        );

        const studentsMap = {};

        for (const row of rows) {
            if (!studentsMap[row.StudentID]) {
                studentsMap[row.StudentID] = {
                    studentId: row.StudentID,
                    fullName: row.FullName,
                    dateOfBirth: row.DateOfBirth,
                    gender: row.Gender,
                    allergies: row.Allergies,
                    enrollmentStatus: row.EnrollmentStatus,
                    avatarUrl: row.AvatarURL,
                    latestHealthRecord: row.HealthRecordID
                        ? {
                            recordId: row.HealthRecordID,
                            termPeriod: row.TermPeriod,
                            height: row.Height !== null ? Number(row.Height) : null,
                            weight: row.Weight !== null ? Number(row.Weight) : null,
                            bmi: row.BMI !== null ? Number(row.BMI) : null,
                        }
                        : null,
                    parents: [],
                };
            }

            if (row.ParentID) {
                const parentExists = studentsMap[row.StudentID].parents.some(
                    (parent) => parent.parentId === row.ParentID
                );

                if (!parentExists) {
                    studentsMap[row.StudentID].parents.push({
                        parentId: row.ParentID,
                        fullName: row.ParentFullName,
                        relationship: row.Relationship,
                        phoneNumber: row.PhoneNumber,
                        isPrimary: row.IsPrimary === 1 || Boolean(row.IsPrimary),
                    });
                }
            }
        }

        return Object.values(studentsMap);
    } catch (error) {
        console.error('Error in getClassStudentsDetailed service:', error);
        throw error;
    }
};

export default {
    checkTeacherClassAccess,
    getClassStudentsDetailed,
    getDetailedStudentList: getClassStudentsDetailed,
};
