-- =====================================================
-- WeeklySchedule Templates & Items Tables
-- Created: 2026-07-06
-- Description: Lưu trữ thời khóa biểu theo tuần cho từng lớp
-- =====================================================

-- --------------------------------------------------------
-- Table structure for table `WeeklyScheduleTemplates`
-- --------------------------------------------------------

CREATE TABLE `WeeklyScheduleTemplates` (
  `TemplateID` int NOT NULL AUTO_INCREMENT,
  `ClassID` int NOT NULL COMMENT 'Lớp học áp dụng',
  `TeacherID` int DEFAULT NULL COMMENT 'GV tạo (NULL = template mặc định)',
  `YearID` int NOT NULL COMMENT 'Niên khóa',
  `Month` int NOT NULL COMMENT 'Tháng (1-12)',
  `Year` int NOT NULL COMMENT 'Năm',
  `WeekNumber` tinyint NOT NULL COMMENT 'Tuần thứ (1,2,3,4)',
  `WeekTheme` varchar(200) DEFAULT NULL COMMENT 'Chủ đề tuần',
  `WeekStartDate` varchar(10) DEFAULT NULL COMMENT 'Ngày bắt đầu tuần (YYYY-MM-DD)',
  `WeekEndDate` varchar(10) DEFAULT NULL COMMENT 'Ngày kết thúc tuần (YYYY-MM-DD)',
  `Status` enum('Draft','Submitted','UnderReview','Approved','Rejected','RevisionRequested') NOT NULL DEFAULT 'Draft' COMMENT 'Trạng thái duyệt',
  `SubmittedAt` bigint DEFAULT NULL COMMENT 'Thời điểm gửi duyệt',
  `ReviewedByID` int DEFAULT NULL COMMENT 'ID người duyệt (Principal)',
  `ReviewedAt` bigint DEFAULT NULL COMMENT 'Thời điểm duyệt',
  `ReviewerComment` text DEFAULT NULL COMMENT 'Phản hồi từ hiệu trưởng',
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`TemplateID`),
  UNIQUE KEY `unique_class_week_month` (`ClassID`, `YearID`, `Month`, `WeekNumber`),
  KEY `idx_class_month` (`ClassID`, `Year`, `Month`),
  KEY `idx_status` (`Status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Template thời khóa biểu theo tuần cho từng lớp';

-- --------------------------------------------------------
-- Table structure for table `WeeklyScheduleItems`
-- --------------------------------------------------------

CREATE TABLE `WeeklyScheduleItems` (
  `ItemID` int NOT NULL AUTO_INCREMENT,
  `TemplateID` int NOT NULL COMMENT 'FK -> WeeklyScheduleTemplates.TemplateID',
  `DayOfWeek` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL COMMENT 'Thứ trong tuần',
  `StartTime` time NOT NULL COMMENT 'Giờ bắt đầu (HH:MM:SS)',
  `EndTime` time NOT NULL COMMENT 'Giờ kết thúc (HH:MM:SS)',
  `ActivityName` varchar(150) NOT NULL COMMENT 'Tên hoạt động',
  `ActivityType` enum('pickup','meal','study','nap','play','dropoff','other') NOT NULL DEFAULT 'other' COMMENT 'Loại hoạt động',
  `Details` text DEFAULT NULL COMMENT 'Mô tả chi tiết hoạt động',
  `Location` varchar(100) DEFAULT NULL COMMENT 'Địa điểm',
  `OrderIndex` int NOT NULL DEFAULT '0' COMMENT 'Thứ tự hiển thị trong ngày',
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp()) ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ItemID`),
  KEY `idx_template_day` (`TemplateID`, `DayOfWeek`),
  KEY `idx_template_order` (`TemplateID`, `OrderIndex`),
  CONSTRAINT `fk_schedule_template` FOREIGN KEY (`TemplateID`) REFERENCES `WeeklyScheduleTemplates` (`TemplateID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Chi tiết các hoạt động trong thời khóa biểu tuần';

-- --------------------------------------------------------
-- Table structure for table `WeeklyScheduleHistory`
-- --------------------------------------------------------

CREATE TABLE `WeeklyScheduleHistory` (
  `HistoryID` int NOT NULL AUTO_INCREMENT,
  `TemplateID` int NOT NULL COMMENT 'FK -> WeeklyScheduleTemplates.TemplateID',
  `Action` enum('Created','Updated','Submitted','UnderReview','Approved','Rejected','RevisionRequested','ReSubmitted') NOT NULL COMMENT 'Hành động',
  `FromStatus` varchar(30) DEFAULT NULL COMMENT 'Trạng thái trước',
  `ToStatus` varchar(30) DEFAULT NULL COMMENT 'Trạng thái sau',
  `ActorID` int DEFAULT NULL COMMENT 'ID người thực hiện',
  `ActorRole` enum('Teacher','Principal','System') NOT NULL COMMENT 'Vai trò người thực hiện',
  `Comment` text DEFAULT NULL COMMENT 'Ghi chú',
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  PRIMARY KEY (`HistoryID`),
  KEY `idx_template` (`TemplateID`),
  CONSTRAINT `fk_history_template` FOREIGN KEY (`TemplateID`) REFERENCES `WeeklyScheduleTemplates` (`TemplateID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Lịch sử thay đổi trạng thái thời khóa biểu';

-- --------------------------------------------------------
-- Sample data: Template 4 tuần cho Class 1, Month 7/2026
-- --------------------------------------------------------

INSERT INTO `WeeklyScheduleTemplates` (`ClassID`, `YearID`, `Month`, `Year`, `WeekNumber`, `WeekTheme`, `WeekStartDate`, `WeekEndDate`, `Status`) VALUES
(1, 1, 7, 2026, 1, 'Tuần 1: Khám phá biển cả', '2026-07-06', '2026-07-10', 'Draft'),
(1, 1, 7, 2026, 2, 'Tuần 2: Thế giới động vật', '2026-07-13', '2026-07-17', 'Draft'),
(1, 1, 7, 2026, 3, 'Tuần 3: Mùa hè sáng tạo', '2026-07-20', '2026-07-24', 'Draft'),
(1, 1, 7, 2026, 4, 'Tuần 4: Bảo vệ môi trường', '2026-07-27', '2026-07-31', 'Draft');

-- --------------------------------------------------------
-- Sample data: Items cho Tuần 1
-- --------------------------------------------------------

INSERT INTO `WeeklyScheduleItems` (`TemplateID`, `DayOfWeek`, `StartTime`, `EndTime`, `ActivityName`, `ActivityType`, `Details`, `Location`, `OrderIndex`) VALUES
-- Monday
(1, 'Monday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'pickup', 'Tập bài dân vũ Cá Vàng Bơi', 'Sân trường', 1),
(1, 'Monday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'meal', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 2),
(1, 'Monday', '09:00:00', '10:15:00', 'Học tạo hình - Vẽ biển cả', 'study', 'Bé vẽ tranh đại dương', 'Lớp học', 3),
(1, 'Monday', '10:15:00', '11:15:00', 'Vui chơi tự do - Góc biển', 'play', 'Xếp hình cá, chơi với đồ chơi biển', 'Lớp học', 4),
(1, 'Monday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'nap', 'Cơm trưa + giấc ngủ trưa', 'Phòng ngủ', 5),
(1, 'Monday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'meal', 'Trái cây + sữa', 'Phòng ăn', 6),
(1, 'Monday', '14:30:00', '16:00:00', 'Kể chuyện - Nàng tiên cá', 'study', 'Cô kể chuyện Nàng Tiên Cá', 'Lớp học', 7),
(1, 'Monday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'dropoff', 'Chuẩn bị đồ dùng và đợi ba mẹ đón', 'Cổng A', 8),

-- Tuesday
(1, 'Tuesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'pickup', 'Tập bài dân vũ', 'Sân trường', 1),
(1, 'Tuesday', '08:30:00', '09:00:00', 'Ăn sáng', 'meal', 'Bánh mì + sữa', 'Phòng ăn', 2),
(1, 'Tuesday', '09:00:00', '10:15:00', 'Âm nhạc - Hát về biển', 'study', 'Dạy bé hát bài "Cá Vàng Bơi"', 'Lớp học', 3),
(1, 'Tuesday', '10:15:00', '11:15:00', 'Vận động ngoài trời - Cá mập bắt cá con', 'play', 'Trò chơi vận động', 'Sân vườn', 4),
(1, 'Tuesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'nap', 'Cơm trưa + giấc ngủ', 'Phòng ngủ', 5),
(1, 'Tuesday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'meal', 'Cháo + trái cây', 'Phòng ăn', 6),
(1, 'Tuesday', '14:30:00', '16:00:00', 'Góc khám phá - Vỏ sò', 'study', 'Quan sát vỏ sò, san hô', 'Lớp học', 7),
(1, 'Tuesday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'dropoff', 'Chuẩn bị đồ', 'Cổng A', 8),

-- Wednesday
(1, 'Wednesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'pickup', 'Tập bài dân vũ', 'Sân trường', 1),
(1, 'Wednesday', '08:30:00', '09:00:00', 'Ăn sáng', 'meal', 'Xôi + sữa', 'Phòng ăn', 2),
(1, 'Wednesday', '09:00:00', '10:15:00', 'Làm quen chữ - Chữ B (Biển)', 'study', 'Nhận mặt chữ B, tập viết', 'Lớp học', 3),
(1, 'Wednesday', '10:15:00', '11:15:00', 'Vui chơi - Xếp hình cá', 'play', 'Xếp hình cá bằng lego', 'Lớp học', 4),
(1, 'Wednesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'nap', 'Cơm + canh', 'Phòng ngủ', 5),
(1, 'Wednesday', '14:00:00', '14:30:00', 'Ăn xế', 'meal', 'Bánh flan', 'Phòng ăn', 6),
(1, 'Wednesday', '14:30:00', '16:00:00', 'Kỹ năng sống - Gọn gàng', 'study', 'Dạy bé cất đồ chơi', 'Lớp học', 7),
(1, 'Wednesday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'dropoff', 'Chuẩn bị đồ', 'Cổng A', 8),

-- Thursday
(1, 'Thursday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'pickup', 'Tập bài dân vũ', 'Sân trường', 1),
(1, 'Thursday', '08:30:00', '09:00:00', 'Ăn sáng', 'meal', 'Mì + trứng', 'Phòng ăn', 2),
(1, 'Thursday', '09:00:00', '10:15:00', 'Toán - Đếm cá', 'study', 'Đếm trong phạm vi 5', 'Lớp học', 3),
(1, 'Thursday', '10:15:00', '11:15:00', 'Vui chơi tự do', 'play', 'Chơi đồ chơi biển', 'Lớp học', 4),
(1, 'Thursday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'nap', 'Cơm + thịt', 'Phòng ngủ', 5),
(1, 'Thursday', '14:00:00', '14:30:00', 'Ăn xế', 'meal', 'Trái cây', 'Phòng ăn', 6),
(1, 'Thursday', '14:30:00', '16:00:00', 'Thủ công - Làm cá ngược', 'study', 'Xếp giấy thành cá', 'Lớp học', 7),
(1, 'Thursday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'dropoff', 'Chuẩn bị đồ', 'Cổng A', 8),

-- Friday
(1, 'Friday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'pickup', 'Tập bài dân vũ', 'Sân trường', 1),
(1, 'Friday', '08:30:00', '09:00:00', 'Ăn sáng', 'meal', 'Bánh bao + sữa', 'Phòng ăn', 2),
(1, 'Friday', '09:00:00', '10:15:00', 'Tiếng Anh - Sea animals', 'study', 'Học từ vựng cá, tôm, cua', 'Lớp học', 3),
(1, 'Friday', '10:15:00', '11:15:00', 'Vận động - Nhảy lò cò', 'play', 'Trò chơi vận động', 'Sân vườn', 4),
(1, 'Friday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'nap', 'Cơm + rau', 'Phòng ngủ', 5),
(1, 'Friday', '14:00:00', '14:30:00', 'Ăn xế', 'meal', 'Sữa chua', 'Phòng ăn', 6),
(1, 'Friday', '14:30:00', '16:00:00', 'Mĩ thuật - Nặn đất sét cá', 'study', 'Nặn cá bằng đất sét', 'Lớp học', 7),
(1, 'Friday', '16:00:00', '17:00:00', 'Trả trẻ & Dọn lớp', 'dropoff', 'Dọn dẹp và trả trẻ', 'Cổng A', 8),

-- Saturday
(1, 'Saturday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'pickup', 'Tập bài dân vũ cuối tuần', 'Sân trường', 1),
(1, 'Saturday', '08:30:00', '09:00:00', 'Ăn sáng', 'meal', 'Bánh mì + sữa', 'Phòng ăn', 2),
(1, 'Saturday', '09:00:00', '10:00:00', 'Hoạt động nghệ thuật', 'study', 'Vẽ tranh tự do về biển', 'Lớp học', 3),
(1, 'Saturday', '10:00:00', '11:00:00', 'Kể chuyện & Hát múa', 'study', 'Thi kể chuyện về biển', 'Lớp học', 4),
(1, 'Saturday', '11:00:00', '12:00:00', 'Ăn trưa sớm', 'meal', 'Cơm + canh', 'Phòng ăn', 5),
(1, 'Saturday', '12:00:00', '13:30:00', 'Ngủ trưa', 'nap', 'Giấc ngủ ngắn', 'Phòng ngủ', 6),
(1, 'Saturday', '13:30:00', '14:30:00', 'Ăn xế & Sinh hoạt cuối tuần', 'meal', 'Trái cây + trò chơi nhẹ', 'Lớp học', 7),
(1, 'Saturday', '14:30:00', '15:30:00', 'Trả trẻ cuối tuần', 'dropoff', 'Trả trẻ cho phụ huynh', 'Cổng A', 8);
