-- ============================================================================
-- Migration: 2026_07_09_create_student_health_tables.sql
-- Purpose:   Tạo các bảng thiếu cho module Student Health (Teacher) + bổ sung
--            cột Notes trên HealthRecords (BE đã chuẩn bị insert Notes).
-- Target:    MySQL 8.x (utf8mb4_0900_ai_ci)
-- Idempotent: sử dụng IF NOT EXISTS + INFORMATION_SCHEMA check
-- ============================================================================

SET NAMES utf8mb4;

-- ----------------------------------------------------------------------------
-- 1. Allergies  (chuẩn hoá, một row / một dị ứng / một học sinh)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `Allergies` (
  `AllergyID`  INT NOT NULL AUTO_INCREMENT,
  `StudentID`  INT NOT NULL,
  `Allergen`   VARCHAR(150) NOT NULL,
  `Severity`   ENUM('Mild','Moderate','Severe') NOT NULL DEFAULT 'Mild',
  `Reaction`   VARCHAR(255) NULL,
  `Notes`      TEXT NULL,
  `IsActive`   TINYINT(1) NOT NULL DEFAULT 1,
  `CreatedAt`  BIGINT NULL,
  `UpdatedAt`  BIGINT NULL,
  PRIMARY KEY (`AllergyID`),
  KEY `idx_allergies_student` (`StudentID`),
  KEY `idx_allergies_active`  (`IsActive`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add FK chỉ khi chưa có (tránh lỗi khi re-run)
SET @fk_exists := (
  SELECT COUNT(1)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'Allergies'
    AND CONSTRAINT_NAME = 'fk_allergies_student'
);
SET @ddl := IF(
  @fk_exists = 0,
  'ALTER TABLE `Allergies` ADD CONSTRAINT `fk_allergies_student` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE',
  'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ----------------------------------------------------------------------------
-- 2. DevelopmentAssessments  (đánh giá phát triển theo kỳ)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `DevelopmentAssessments` (
  `AssessmentID`    INT NOT NULL AUTO_INCREMENT,
  `StudentID`       INT NOT NULL,
  `TermPeriod`      VARCHAR(7) NOT NULL,
  `PhysicalScore`   TINYINT NULL,
  `EmotionalScore`  TINYINT NULL,
  `SocialScore`     TINYINT NULL,
  `LanguageScore`   TINYINT NULL,
  `CognitiveScore`  TINYINT NULL,
  `OverallNote`     TEXT NULL,
  `AssessedBy`      INT NULL,
  `CreatedAt`       BIGINT NULL,
  `UpdatedAt`       BIGINT NULL,
  PRIMARY KEY (`AssessmentID`),
  UNIQUE KEY `uq_dev_assessments_student_term` (`StudentID`, `TermPeriod`),
  KEY `idx_dev_assessments_term` (`TermPeriod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET @fk_exists := (
  SELECT COUNT(1)
  FROM information_schema.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'DevelopmentAssessments'
    AND CONSTRAINT_NAME = 'fk_dev_assessments_student'
);
SET @ddl := IF(
  @fk_exists = 0,
  'ALTER TABLE `DevelopmentAssessments` ADD CONSTRAINT `fk_dev_assessments_student` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE',
  'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ----------------------------------------------------------------------------
-- 3. Bổ sung cột Notes trên HealthRecords (BE đã insert Notes nhưng schema
--    gốc trong dump không có cột này).
-- ----------------------------------------------------------------------------
SET @col_exists := (
  SELECT COUNT(1)
  FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'HealthRecords'
    AND COLUMN_NAME = 'Notes'
);
SET @ddl := IF(
  @col_exists = 0,
  'ALTER TABLE `HealthRecords` ADD COLUMN `Notes` TEXT NULL AFTER `BMI`',
  'SELECT 1'
);
PREPARE stmt FROM @ddl;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================================================
-- Done.
-- ============================================================================