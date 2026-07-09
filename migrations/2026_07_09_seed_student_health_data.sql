-- ============================================================================
-- Seed test data for Teacher Student Health module
-- Uses INSERT IGNORE to handle re-runs without duplicates
-- ============================================================================

SET NAMES utf8mb4;

-- 1. Allergies
INSERT IGNORE INTO `Allergies` (`AllergyID`, `StudentID`, `Allergen`, `Severity`, `Reaction`, `Notes`, `IsActive`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 117, 'Đậu phộng (lạc)',     'Severe',   'Sốc phản vệ, khó thở',           'Bố mẹ đã thông báo, cần tránh hoàn toàn', 1, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
(2, 109, 'Sữa bò',              'Moderate', 'Phát ban đỏ, ngứa',                NULL,                                            1, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
(3, 107, 'Trứng',                'Mild',     'Nổi mề đay nhẹ',                   'Theo dõi khi ăn trứng',                         1, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
(4, 116, 'Hải sản có vỏ (tôm, cua)', 'Moderate', 'Đau bụng, buồn nôn',         'Tránh cho bé ăn hải sản',                       1, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
(5, 120, 'Bụi phấn hoa',         'Mild',     'Hắt hơi, sổ mũi',                'Mùa xuân cần chú ý',                            1, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
(6, 115, 'Sô cô la',             'Moderate', 'Nổi mẩn đỏ quanh miệng',          'Chỉ ăn một lượng nhỏ',                          1, UNIX_TIMESTAMP(), UNIX_TIMESTAMP());

-- 2. Medications (MedicationRequests)
INSERT IGNORE INTO `MedicationRequests` (`MedRequestID`, `StudentID`, `ParentID`, `RequestDate`, `ScheduledDate`, `MedicineDetails`, `Dosage`, `Frequency`, `TimeToTake`, `ParentNote`, `MedicineImageURL`, `Status`, `TeacherNote`, `UpdatedTime`, `AdministeredAt`, `AdministeredBy`) VALUES
(1, 117, 4, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 'Paracetamol 250mg', '1 gói',  '2 lần/ngày',  'Sáng, chiều',  'Bé sốt 38.5 độ từ sáng nay', NULL, 'Pending',  NULL, UNIX_TIMESTAMP(), NULL, NULL),
(2, 109, 4, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 'Amoxicillin 250mg', '5ml',    '3 lần/ngày',  'Sáng, trưa, chiều', 'Uống sau ăn 30 phút', NULL, 'Pending',  NULL, UNIX_TIMESTAMP(), NULL, NULL),
(3, 107, 4, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 'Vitamin C 100mg',  '1 viên', '1 lần/ngày',  'Sáng',         'Bổ sung vitamin mùa đông', NULL, 'Done',     'Đã cho bé uống 9h sáng', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 5),
(4, 116, 4, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 'Siro ho Prospan',   '5ml',    '2 lần/ngày',  'Sáng, tối',   'Bé ho nhiều về đêm',  NULL, 'Pending',  NULL, UNIX_TIMESTAMP(), NULL, NULL),
(5, 1,   4, UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), 'Ibuprofen 100mg',  '5ml',    'Khi sốt >38.5','Bất kỳ',    'Sốt về chiều',           NULL, 'Skipped',  'Bé không sốt trong ngày', UNIX_TIMESTAMP(), NULL, NULL);

-- 3. Medical Requests with different statuses
INSERT IGNORE INTO `MedicationRequests` (`MedRequestID`, `StudentID`, `ParentID`, `RequestDate`, `ScheduledDate`, `MedicineDetails`, `Dosage`, `Frequency`, `TimeToTake`, `ParentNote`, `MedicineImageURL`, `Status`, `TeacherNote`, `UpdatedTime`) VALUES
(6, 119, 4, UNIX_TIMESTAMP() - 3600, UNIX_TIMESTAMP() - 3600, 'Cetirizine 5mg', '1 viên', '1 lần/ngày', 'Tối',  'Bé dị ứng thời tiết',  NULL, 'Pending',  NULL, UNIX_TIMESTAMP()),
(7, 118, 4, UNIX_TIMESTAMP() - 7200, UNIX_TIMESTAMP() - 7200, 'Berberin',       '2 viên', '2 lần/ngày', 'Sáng, tối', 'Bé bị tiêu chảy nhẹ', NULL, 'Pending',  NULL, UNIX_TIMESTAMP());

-- 4. Development Assessments (use INSERT IGNORE for UNIQUE constraint on StudentID + TermPeriod)
INSERT IGNORE INTO `DevelopmentAssessments` (`AssessmentID`, `StudentID`, `TermPeriod`, `PhysicalScore`, `EmotionalScore`, `SocialScore`, `LanguageScore`, `CognitiveScore`, `OverallNote`, `AssessedBy`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 117, '2026-07', 4, 5, 4, 5, 4, 'Bé phát triển tốt, tích cực tham gia hoạt động nhóm', 5, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
(2, 109, '2026-07', 3, 4, 5, 4, 3, 'Bé hoà đồng, cần cải thiện vận động tinh',       5, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
(3, 107, '2026-07', 5, 4, 4, 4, 5, 'Bé năng động, học hỏi nhanh',                    5, UNIX_TIMESTAMP(), UNIX_TIMESTAMP()),
(4, 116, '2026-07', 4, 3, 4, 4, 4, 'Bé cần chú ý hơn về kiểm soát cảm xúc',         5, UNIX_TIMESTAMP(), UNIX_TIMESTAMP());

-- 5. Health Log example (Temperature log)
INSERT IGNORE INTO `HealthRecords` (`RecordID`, `StudentID`, `TermPeriod`, `Height`, `Weight`, `BMI`, `Notes`) VALUES
(1, 117, '2026-07', NULL, NULL, NULL, 'Sáng: nhiệt độ 38.2°C, uống hạ sốt. Chiều: 37.5°C.');

-- Verification
SELECT 'Seed data check:' AS status;
SELECT COUNT(*) AS total_allergies FROM Allergies WHERE IsActive=1;
SELECT COUNT(*) AS total_medications FROM MedicationRequests WHERE ScheduledDate IS NOT NULL;
SELECT COUNT(*) AS total_medical_requests FROM MedicationRequests;
SELECT COUNT(*) AS total_assessments FROM DevelopmentAssessments WHERE TermPeriod='2026-07';
