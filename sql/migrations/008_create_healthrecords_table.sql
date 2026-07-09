-- ============================================================================
-- Migration: 008_create_healthrecords_table.sql
-- Purpose : Tạo bảng HealthRecords nếu chưa tồn tại
-- ============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;

-- Kiểm tra xem bảng HealthRecords đã tồn tại chưa
SET @table_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'HealthRecords'
);

-- Tạo bảng HealthRecords nếu chưa có
CREATE TABLE IF NOT EXISTS `HealthRecords` (
  `RecordID` int NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `StudentID` int NOT NULL COMMENT 'FK -> Students.StudentID',
  `TermPeriod` varchar(50) NOT NULL COMMENT 'Kỳ đo (VD: 2026-07)',
  `Height` decimal(5,2) DEFAULT NULL COMMENT 'Chiều cao (cm)',
  `Weight` decimal(5,2) DEFAULT NULL COMMENT 'Cân nặng (kg)',
  `BMI` decimal(5,2) DEFAULT NULL COMMENT 'Chỉ số BMI',
  `Notes` text DEFAULT NULL COMMENT 'Ghi chú của giáo viên',
  PRIMARY KEY (`RecordID`),
  KEY `idx_health_student` (`StudentID`),
  KEY `idx_health_term` (`TermPeriod`),
  KEY `idx_health_student_term` (`StudentID`, `TermPeriod`),
  CONSTRAINT `fk_health_student` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Hồ sơ sức khỏe (chiều cao, cân nặng, BMI)';

COMMIT;
