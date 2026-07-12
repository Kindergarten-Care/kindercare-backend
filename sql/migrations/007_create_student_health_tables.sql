-- ============================================================================
-- Migration: 007_create_student_health_tables.sql
-- Purpose : Hoàn thiện schema cho tính năng "Y tế & Sức khỏe"
--           - Allergies chuẩn hoá (1 row / dị ứng / học sinh)
--           - DevelopmentAssessments (đánh giá 5 miền phát triển)
--           - Bổ sung Notes cho HealthRecords
--           - Bổ sung ScheduledDate / AdministeredBy / AdministeredAt cho
--             MedicationRequests để hỗ trợ "đơn thuốc hôm nay" + "xác nhận đã cho uống"
-- ============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- ----------------------------------------------------------------------------
-- 1. Bảng Allergies (chuẩn hoá, thay thế Students.Allergies text)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `Allergies` (
  `AllergyID` int NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `StudentID` int NOT NULL COMMENT 'FK -> Students.StudentID',
  `Allergen` varchar(150) NOT NULL COMMENT 'Tên chất gây dị ứng (VD: Đậu phộng, Trứng, Sữa bò)',
  `Severity` enum('Mild','Moderate','Severe') NOT NULL DEFAULT 'Mild' COMMENT 'Mức độ',
  `Reaction` varchar(255) DEFAULT NULL COMMENT 'Triệu chứng phản ứng (phát ban, ngứa, ...)',
  `Notes` text DEFAULT NULL COMMENT 'Ghi chú thêm của giáo viên / phụ huynh',
  `IsActive` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = còn hiệu lực, 0 = đã hết',
  `CreatedAt` bigint NOT NULL DEFAULT (unix_timestamp()) COMMENT 'Thời điểm tạo',
  `UpdatedAt` bigint NOT NULL DEFAULT (unix_timestamp()) ON UPDATE CURRENT_TIMESTAMP COMMENT 'Thời điểm cập nhật',
  PRIMARY KEY (`AllergyID`),
  KEY `idx_allergies_student` (`StudentID`),
  KEY `idx_allergies_active` (`IsActive`),
  CONSTRAINT `fk_allergies_student` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Danh sách dị ứng của học sinh (chuẩn hoá)';

-- ----------------------------------------------------------------------------
-- 2. ALTER HealthRecords: thêm Notes
-- ----------------------------------------------------------------------------

SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'HealthRecords'
    AND COLUMN_NAME  = 'Notes'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `HealthRecords` ADD COLUMN `Notes` text DEFAULT NULL COMMENT ''Ghi chú của giáo viên'' AFTER `BMI`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

-- ----------------------------------------------------------------------------
-- 3. ALTER MedicationRequests:
--    - ScheduledDate (bigint) : ngày dự kiến cho uống (hỗ trợ "đơn thuốc hôm nay")
--    - AdministeredAt  (bigint) : thời điểm giáo viên xác nhận đã cho uống
--    - AdministeredBy  (int)   : TeacherID xác nhận
--    - TeacherNote (đã có sẵn) dùng cho ghi chú sau khi cho uống
-- ----------------------------------------------------------------------------

SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'MedicationRequests'
    AND COLUMN_NAME  = 'ScheduledDate'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `MedicationRequests` ADD COLUMN `ScheduledDate` bigint DEFAULT NULL COMMENT ''Ngày dự kiến cho uống (Unix timestamp)'' AFTER `RequestDate`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'MedicationRequests'
    AND COLUMN_NAME  = 'AdministeredAt'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `MedicationRequests` ADD COLUMN `AdministeredAt` bigint DEFAULT NULL COMMENT ''Thời điểm giáo viên xác nhận cho uống'' AFTER `TeacherNote`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'MedicationRequests'
    AND COLUMN_NAME  = 'AdministeredBy'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `MedicationRequests` ADD COLUMN `AdministeredBy` int DEFAULT NULL COMMENT ''FK -> Teachers.TeacherID, người xác nhận cho uống'' AFTER `AdministeredAt`',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

SET @col_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME   = 'MedicationRequests'
    AND COLUMN_NAME  = 'Status'
);
SET @sql := IF(@col_exists = 0,
  'ALTER TABLE `MedicationRequests` ADD COLUMN `Status` varchar(50) DEFAULT ''Pending'' COMMENT ''Pending | Done | Skipped''',
  'SELECT 1');
PREPARE stmt FROM @sql; EXECUTE stmt; DEALLOCATE PREPARE stmt;

CREATE INDEX IF NOT EXISTS `idx_medreq_scheduled` ON `MedicationRequests` (`ScheduledDate`, `Status`);
CREATE INDEX IF NOT EXISTS `idx_medreq_student_date` ON `MedicationRequests` (`StudentID`, `ScheduledDate`);

-- ----------------------------------------------------------------------------
-- 4. Bảng DevelopmentAssessments (đánh giá 5 miền phát triển)
--    - Physical / Emotional / Social / Language / Cognitive (mỗi cái 0-5)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS `DevelopmentAssessments` (
  `AssessmentID` int NOT NULL AUTO_INCREMENT COMMENT 'PK',
  `StudentID` int NOT NULL COMMENT 'FK -> Students.StudentID',
  `TermPeriod` varchar(50) NOT NULL COMMENT 'Kỳ đánh giá (VD: 2026-07)',
  `PhysicalScore` tinyint DEFAULT NULL COMMENT 'Hoạt động thể chất (0-5)',
  `EmotionalScore` tinyint DEFAULT NULL COMMENT 'Cảm xúc (0-5)',
  `SocialScore` tinyint DEFAULT NULL COMMENT 'Xã hội (0-5)',
  `LanguageScore` tinyint DEFAULT NULL COMMENT 'Ngôn ngữ (0-5)',
  `CognitiveScore` tinyint DEFAULT NULL COMMENT 'Nhận thức (0-5)',
  `OverallNote` text DEFAULT NULL COMMENT 'Ghi chú tổng',
  `AssessedBy` int DEFAULT NULL COMMENT 'FK -> Teachers.TeacherID',
  `CreatedAt` bigint NOT NULL DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint NOT NULL DEFAULT (unix_timestamp()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`AssessmentID`),
  UNIQUE KEY `unique_student_term` (`StudentID`, `TermPeriod`),
  KEY `idx_devassess_term` (`TermPeriod`),
  CONSTRAINT `fk_devassess_student` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE,
  CONSTRAINT `fk_devassess_teacher` FOREIGN KEY (`AssessedBy`) REFERENCES `Teachers` (`TeacherID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Đánh giá 5 miền phát triển của học sinh';

COMMIT;
