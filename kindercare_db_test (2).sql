-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: kindercare-mysql:3306
-- Thời gian đã tạo: Th6 14, 2026 lúc 12:48 PM
-- Phiên bản máy phục vụ: 8.0.45
-- Phiên bản PHP: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `kindercare_db_test`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `AcademicYears`
--

CREATE TABLE `AcademicYears` (
  `YearID` int NOT NULL,
  `YearName` varchar(50) NOT NULL,
  `StartDate` bigint NOT NULL,
  `EndDate` bigint NOT NULL,
  `IsActive` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `AcademicYears`
--

INSERT INTO `AcademicYears` (`YearID`, `YearName`, `StartDate`, `EndDate`, `IsActive`) VALUES
(1, 'Niên khóa 2026-2027', 1788566400, 1811721600, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Admins`
--

CREATE TABLE `Admins` (
  `AdminID` int NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Admins`
--

INSERT INTO `Admins` (`AdminID`, `FullName`, `PhoneNumber`, `Email`) VALUES
(1, 'Hệ thống Admin IT', '0988888888', 'admin@kindercare.edu.vn');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Attendances`
--

CREATE TABLE `Attendances` (
  `AttendanceID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `AttendanceDate` bigint NOT NULL,
  `Status` varchar(50) NOT NULL,
  `CheckInTime` bigint DEFAULT NULL,
  `CheckOutTime` bigint DEFAULT NULL,
  `PickedUpBy` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `BaseFees`
--

CREATE TABLE `BaseFees` (
  `FeeID` int NOT NULL,
  `YearID` int DEFAULT NULL,
  `MonthlyTuition` decimal(15,2) NOT NULL,
  `DailyMealFee` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Buildings`
--

CREATE TABLE `Buildings` (
  `BuildingID` int NOT NULL,
  `BuildingName` varchar(100) NOT NULL,
  `CampusID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Buildings`
--

INSERT INTO `Buildings` (`BuildingID`, `BuildingName`, `CampusID`) VALUES
(1, 'Tòa A (Khối Mầm)', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Campuses`
--

CREATE TABLE `Campuses` (
  `CampusID` int NOT NULL,
  `CampusName` varchar(100) NOT NULL,
  `Address` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Campuses`
--

INSERT INTO `Campuses` (`CampusID`, `CampusName`, `Address`) VALUES
(1, 'Cơ sở 1 - Quận 1', '65 Huỳnh Thúc Kháng, Bến Nghé, Q1');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Classes`
--

CREATE TABLE `Classes` (
  `ClassID` int NOT NULL,
  `ClassName` varchar(50) NOT NULL,
  `GradeID` int DEFAULT NULL,
  `BuildingID` int DEFAULT NULL,
  `YearID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Classes`
--

INSERT INTO `Classes` (`ClassID`, `ClassName`, `GradeID`, `BuildingID`, `YearID`) VALUES
(1, 'Mầm 1', 1, 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ClassTeachers`
--

CREATE TABLE `ClassTeachers` (
  `ClassID` int NOT NULL,
  `TeacherID` int NOT NULL,
  `RoleInClass` varchar(50) DEFAULT NULL,
  `AssignedDate` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Conversations`
--

CREATE TABLE `Conversations` (
  `ConversationID` int NOT NULL,
  `TeacherID` int NOT NULL,
  `ParentID` int NOT NULL,
  `LastMessage` text,
  `UpdatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `DailyActivities`
--

CREATE TABLE `DailyActivities` (
  `ActivityID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `ActivityDate` bigint NOT NULL,
  `EatingStatus` varchar(50) DEFAULT NULL,
  `SleepingStatus` varchar(50) DEFAULT NULL,
  `HygieneStatus` varchar(50) DEFAULT NULL,
  `TeacherNote` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `DailySchedules`
--

CREATE TABLE `DailySchedules` (
  `DailyScheduleID` int NOT NULL,
  `ClassID` int NOT NULL,
  `ScheduleDate` bigint NOT NULL,
  `StartTime` bigint NOT NULL,
  `EndTime` bigint NOT NULL,
  `ActivityName` varchar(150) NOT NULL,
  `Details` text,
  `Location` varchar(100) DEFAULT NULL,
  `ActivityType` enum('pickup','meal','study','nap','play','dropoff','other') DEFAULT 'study',
  `Status` enum('Chưa diễn ra','Đang diễn ra','Xong') DEFAULT 'Chưa diễn ra',
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `DailySchedules`
--

INSERT INTO `DailySchedules` (`DailyScheduleID`, `ClassID`, `ScheduleDate`, `StartTime`, `EndTime`, `ActivityName`, `Details`, `Location`, `ActivityType`, `Status`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, 1784160000, 1784187000, 1784188800, 'Đón bé & Chào hỏi', NULL, 'Cổng A', 'pickup', 'Xong', 1781359832, 1781359832),
(2, 1, 1784160000, 1784188800, 1784190600, 'Ăn sáng', 'Cháo yến mạch + sữa', NULL, 'meal', 'Xong', 1781359832, 1781359832),
(3, 1, 1784160000, 1784190600, 1784196000, 'Hoạt động sáng tạo', 'Vẽ tranh & tô màu', NULL, 'study', 'Xong', 1781359832, 1781359832),
(4, 1, 1784160000, 1784196000, 1784199600, 'Vận động ngoài trời', 'Sân vườn - Chơi tự do', 'Sân vườn', 'play', 'Xong', 1781359832, 1781359832),
(5, 1, 1784160000, 1784199600, 1784201400, 'Ăn trưa', 'Cơm + canh + thịt', NULL, 'meal', 'Xong', 1781359832, 1781359832),
(6, 1, 1784160000, 1784201400, 1784206800, 'Ngủ trưa', 'Phòng ngủ - 25°C', 'Phòng ngủ', 'nap', 'Xong', 1781359832, 1781359832),
(7, 1, 1784160000, 1784206800, 1784210400, 'Giờ chơi nhóm', 'Xếp hình & kể chuyện', NULL, 'play', 'Xong', 1781359832, 1781359832),
(8, 1, 1784160000, 1784210400, 1784212200, 'Học tiếng Anh', 'Từ vựng chủ đề con vật', NULL, 'study', 'Xong', 1781359832, 1781359832),
(9, 1, 1784160000, 1784212200, 1784214000, 'Ăn xế', 'Bánh mì + sữa chua', NULL, 'meal', 'Xong', 1781359832, 1781359832),
(10, 1, 1784160000, 1784221200, 1784223000, 'Giờ tan học', NULL, 'Cổng chính', 'dropoff', 'Xong', 1781359832, 1781359832);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `DailyStudentLessons`
--

CREATE TABLE `DailyStudentLessons` (
  `LessonLogID` int NOT NULL,
  `StudentID` int NOT NULL,
  `LessonDate` bigint NOT NULL,
  `SubjectName` varchar(50) NOT NULL,
  `LessonTitle` varchar(150) NOT NULL,
  `Details` text NOT NULL,
  `IconType` varchar(50) DEFAULT 'default',
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `DailyStudentLessons`
--

INSERT INTO `DailyStudentLessons` (`LessonLogID`, `StudentID`, `LessonDate`, `SubjectName`, `LessonTitle`, `Details`, `IconType`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, 1783987200, 'TẠO HÌNH', 'Học vẽ hình tròn', 'Bé vẽ mặt trời, bánh xe và bóng bay.', 'draw', 1781359832, 1781359832),
(2, 1, 1783987200, 'TIẾNG ANH', 'Từ vựng về con vật', 'cat, dog, bird, fish — kèm hình minh họa.', 'english', 1781359832, 1781359832),
(3, 1, 1783987200, 'ÂM NHẠC', 'Hát “Cả nhà thương nhau”', 'Bé hát và vỗ tay theo nhịp rất tốt.', 'music', 1781359832, 1781359832);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `EventClasses`
--

CREATE TABLE `EventClasses` (
  `EventID` int NOT NULL,
  `ClassID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Events`
--

CREATE TABLE `Events` (
  `EventID` int NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `StartTime` bigint NOT NULL,
  `EndTime` bigint NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'Upcoming',
  `CreatedBy` int DEFAULT NULL,
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Extracurriculars`
--

CREATE TABLE `Extracurriculars` (
  `ActivityID` int NOT NULL,
  `ActivityName` varchar(100) NOT NULL,
  `MonthlyFee` decimal(15,2) NOT NULL,
  `Description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Feedbacks`
--

CREATE TABLE `Feedbacks` (
  `FeedbackID` int NOT NULL,
  `ParentID` int DEFAULT NULL,
  `Type` varchar(20) NOT NULL,
  `Content` text NOT NULL,
  `Rating` int DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'Pending',
  `ResponseContent` text,
  `RespondedByID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Grades`
--

CREATE TABLE `Grades` (
  `GradeID` int NOT NULL,
  `GradeName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Grades`
--

INSERT INTO `Grades` (`GradeID`, `GradeName`) VALUES
(1, 'Mầm'),
(2, 'Chồi'),
(3, 'Lá');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `HealthRecords`
--

CREATE TABLE `HealthRecords` (
  `RecordID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `TermPeriod` varchar(50) NOT NULL,
  `Height` decimal(5,2) DEFAULT NULL,
  `Weight` decimal(5,2) DEFAULT NULL,
  `BMI` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Invoices`
--

CREATE TABLE `Invoices` (
  `InvoiceID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `PackageID` int DEFAULT NULL,
  `PeriodRange` varchar(100) DEFAULT NULL,
  `BillingMonth` varchar(10) NOT NULL,
  `TuitionFee` decimal(15,2) DEFAULT '0.00',
  `ExpectedMealFee` decimal(15,2) DEFAULT '0.00',
  `ExtracurricularFee` decimal(15,2) DEFAULT '0.00',
  `Surcharge` decimal(15,2) DEFAULT '0.00',
  `RefundAmount` decimal(15,2) DEFAULT '0.00',
  `DiscountAmount` decimal(15,2) DEFAULT '0.00',
  `TotalAmount` decimal(15,2) GENERATED ALWAYS AS ((((((coalesce(`TuitionFee`,0) + coalesce(`ExpectedMealFee`,0)) + coalesce(`ExtracurricularFee`,0)) + coalesce(`Surcharge`,0)) - coalesce(`RefundAmount`,0)) - coalesce(`DiscountAmount`,0))) STORED,
  `PaymentStatus` varchar(50) DEFAULT 'Unpaid',
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Invoices`
--

INSERT INTO `Invoices` (`InvoiceID`, `StudentID`, `PackageID`, `PeriodRange`, `BillingMonth`, `TuitionFee`, `ExpectedMealFee`, `ExtracurricularFee`, `Surcharge`, `RefundAmount`, `DiscountAmount`, `PaymentStatus`, `CreatedAt`) VALUES
(1, 1, 3, NULL, '05-2026', 4500000.00, 1430000.00, 0.00, 0.00, 0.00, 150000.00, 'Unpaid', 1781083042);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `LeaveRequests`
--

CREATE TABLE `LeaveRequests` (
  `RequestID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `ParentID` int DEFAULT NULL,
  `FromDate` bigint NOT NULL,
  `ToDate` bigint NOT NULL,
  `Reason` text,
  `EvidenceURL` text,
  `Status` varchar(50) DEFAULT 'Pending',
  `ApproverID` int DEFAULT NULL,
  `IsMealFeeDeducted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `MedicationRequests`
--

CREATE TABLE `MedicationRequests` (
  `MedRequestID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `ParentID` int DEFAULT NULL,
  `RequestDate` bigint NOT NULL,
  `MedicineDetails` text NOT NULL,
  `Dosage` text NOT NULL,
  `Status` varchar(50) DEFAULT 'Pending',
  `TeacherNote` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Menus`
--

CREATE TABLE `Menus` (
  `MenuID` int NOT NULL,
  `ClassID` int DEFAULT NULL,
  `MenuDate` bigint NOT NULL,
  `MealType` varchar(50) NOT NULL,
  `DishName` text NOT NULL,
  `Calories` int DEFAULT NULL,
  `NutritionalDetails` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Messages`
--

CREATE TABLE `Messages` (
  `MessageID` bigint NOT NULL,
  `ConversationID` int NOT NULL,
  `SenderID` int NOT NULL,
  `Content` text NOT NULL,
  `MessageType` enum('text','image','file','call_log') DEFAULT 'text',
  `IsRead` tinyint(1) DEFAULT '0',
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Newsfeeds`
--

CREATE TABLE `Newsfeeds` (
  `PostID` int NOT NULL,
  `ClassID` int DEFAULT NULL,
  `TeacherID` int DEFAULT NULL,
  `Content` text,
  `MediaURL` text,
  `PostedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `NewsfeedTags`
--

CREATE TABLE `NewsfeedTags` (
  `PostID` int NOT NULL,
  `StudentID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Notifications`
--

CREATE TABLE `Notifications` (
  `NotifID` int NOT NULL,
  `UserID` int DEFAULT NULL,
  `Title` varchar(255) NOT NULL,
  `Message` text NOT NULL,
  `Type` varchar(50) DEFAULT NULL,
  `ActionLink` text,
  `IsRead` tinyint(1) DEFAULT '0',
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Parents`
--

CREATE TABLE `Parents` (
  `ParentID` int NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `IDCard` varchar(20) DEFAULT NULL,
  `Job` varchar(100) DEFAULT NULL,
  `Address` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Parents`
--

INSERT INTO `Parents` (`ParentID`, `FullName`, `PhoneNumber`, `Email`, `IDCard`, `Job`, `Address`) VALUES
(4, 'Nguyễn Anh Tuấn', '0911111111', 'tuan.nguyen@gmail.com', NULL, 'Kỹ sư', '65 Huỳnh Thúc Kháng, Q1'),
(6, 'Hồ Công Danh', '086655189', 'hocong.danh16@gmail.com', '07020002832', 'IT', 'Bình Tân, HCM');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `PaymentPackages`
--

CREATE TABLE `PaymentPackages` (
  `PackageID` int NOT NULL,
  `PackageName` varchar(50) NOT NULL,
  `DurationInMonths` int NOT NULL,
  `DiscountPercentage` decimal(5,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `PaymentPackages`
--

INSERT INTO `PaymentPackages` (`PackageID`, `PackageName`, `DurationInMonths`, `DiscountPercentage`) VALUES
(1, 'Tháng', 1, 0.00),
(2, 'Quý', 3, 0.00),
(3, 'Nửa năm', 6, 5.00),
(4, 'Năm', 12, 10.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Principals`
--

CREATE TABLE `Principals` (
  `PrincipalID` int NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Principals`
--

INSERT INTO `Principals` (`PrincipalID`, `FullName`, `PhoneNumber`, `Email`) VALUES
(2, 'Trần Thị Mai', '0999999999', 'mai.tran@kindercare.edu.vn');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `QuickReplies`
--

CREATE TABLE `QuickReplies` (
  `ReplyID` int NOT NULL,
  `TeacherID` int DEFAULT NULL,
  `Shortcut` varchar(50) DEFAULT NULL,
  `Content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Roles`
--

CREATE TABLE `Roles` (
  `RoleID` int NOT NULL,
  `RoleName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Roles`
--

INSERT INTO `Roles` (`RoleID`, `RoleName`) VALUES
(1, 'IT Admin'),
(2, 'Principal'),
(3, 'Teacher'),
(4, 'Parent'),
(5, 'Guest');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `StudentAssessments`
--

CREATE TABLE `StudentAssessments` (
  `AssessmentID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `AssessmentMonth` varchar(10) NOT NULL,
  `PhysicalScore` int DEFAULT NULL,
  `CognitiveScore` int DEFAULT NULL,
  `LanguageScore` int DEFAULT NULL,
  `SocioEmotionalScore` int DEFAULT NULL,
  `AestheticScore` int DEFAULT NULL,
  `TeacherComment` text,
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `StudentExtracurriculars`
--

CREATE TABLE `StudentExtracurriculars` (
  `EnrollmentID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `ActivityID` int DEFAULT NULL,
  `RegisteredMonth` varchar(10) NOT NULL,
  `Status` varchar(20) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `StudentParents`
--

CREATE TABLE `StudentParents` (
  `StudentID` int NOT NULL,
  `ParentID` int NOT NULL,
  `Relationship` varchar(50) NOT NULL,
  `IsPrimary` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `StudentParents`
--

INSERT INTO `StudentParents` (`StudentID`, `ParentID`, `Relationship`, `IsPrimary`) VALUES
(1, 4, 'Ba', 1),
(19, 6, 'Ba', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Students`
--

CREATE TABLE `Students` (
  `StudentID` int NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `DateOfBirth` bigint NOT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Allergies` text,
  `AdmissionDate` bigint DEFAULT NULL,
  `EnrollmentStatus` varchar(50) DEFAULT 'Active',
  `AvatarURL` text,
  `ClassID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Students`
--

INSERT INTO `Students` (`StudentID`, `FullName`, `DateOfBirth`, `Gender`, `Allergies`, `AdmissionDate`, `EnrollmentStatus`, `AvatarURL`, `ClassID`) VALUES
(1, 'Nguyễn Minh Khang', 1684108800, 'Nam', 'Dị ứng lạc', NULL, 'Active', NULL, 1),
(19, 'Nguyễn Minh Chánh', 1464739200, 'Nam', NULL, NULL, 'Active', NULL, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `SystemLogs`
--

CREATE TABLE `SystemLogs` (
  `LogID` int NOT NULL,
  `UserID` int DEFAULT NULL,
  `Action` text NOT NULL,
  `Timestamp` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `TeacherRankHistory`
--

CREATE TABLE `TeacherRankHistory` (
  `HistoryID` int NOT NULL,
  `TeacherID` int DEFAULT NULL,
  `OldRank` varchar(50) DEFAULT NULL,
  `NewRank` varchar(50) DEFAULT NULL,
  `UpdatedBy` int DEFAULT NULL,
  `UpdatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Teachers`
--

CREATE TABLE `Teachers` (
  `TeacherID` int NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `DateOfBirth` bigint DEFAULT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `IDCard` varchar(20) DEFAULT NULL,
  `Address` text,
  `ProfessionalRank` varchar(50) DEFAULT NULL,
  `WorkStatus` varchar(50) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Teachers`
--

INSERT INTO `Teachers` (`TeacherID`, `FullName`, `PhoneNumber`, `Email`, `DateOfBirth`, `Gender`, `IDCard`, `Address`, `ProfessionalRank`, `WorkStatus`) VALUES
(3, 'Nguyễn Thị Lan', '0901234567', 'lan.nguyen@kindercare.edu.vn', 642729600, 'Nữ', '079190001234', '123 Nguyễn Huệ, Quận 1', 'Hạng III', 'Active'),
(5, 'Lê Quang Huy', '0912345678', 'huy.le@kindercare.edu.vn', 593308800, 'Nam', '079088001122', '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM', 'Hạng II', 'Active');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Timetables`
--

CREATE TABLE `Timetables` (
  `ScheduleID` int NOT NULL,
  `ClassID` int DEFAULT NULL,
  `DayOfWeek` varchar(20) NOT NULL,
  `Subject` varchar(100) NOT NULL,
  `StartTime` bigint DEFAULT NULL,
  `EndTime` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Transactions`
--

CREATE TABLE `Transactions` (
  `TransactionID` int NOT NULL,
  `InvoiceID` int DEFAULT NULL,
  `AmountPaid` decimal(15,2) NOT NULL,
  `PaymentMethod` varchar(50) DEFAULT NULL,
  `TransactionCode` varchar(100) DEFAULT NULL,
  `TransactionDate` bigint DEFAULT (unix_timestamp()),
  `Status` varchar(50) DEFAULT 'Success'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Users`
--

CREATE TABLE `Users` (
  `UserID` int NOT NULL,
  `Username` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `RoleID` int DEFAULT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'Active',
  `AvatarURL` text,
  `ResetPasswordToken` varchar(255) DEFAULT NULL,
  `TokenExpiry` bigint DEFAULT NULL,
  `ReceiveEmailNotif` tinyint(1) DEFAULT '1',
  `ReceivePushNotif` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Users`
--

INSERT INTO `Users` (`UserID`, `Username`, `PasswordHash`, `RoleID`, `fcm_token`, `Status`, `AvatarURL`, `ResetPasswordToken`, `TokenExpiry`, `ReceiveEmailNotif`, `ReceivePushNotif`) VALUES
(1, 'admin_it', 'hash_pass', 1, NULL, 'Active', NULL, NULL, NULL, 1, 1),
(2, 'hieutruong_mai', 'hash_pass', 2, NULL, 'Active', NULL, NULL, NULL, 1, 1),
(3, 'gv_lan', 'hash_pass', 3, NULL, 'Active', NULL, NULL, NULL, 1, 1),
(4, 'ph_tuan', '$2a$12$iWf2E00ASg54.I3mqkNCgOAGwuNK38VGkW3y.5wxCad2GopnYTjr6', 4, NULL, 'Active', NULL, NULL, NULL, 1, 1),
(5, 'gv_quanghuy', '$2a$12$iWf2E00ASg54.I3mqkNCgOAGwuNK38VGkW3y.5wxCad2GopnYTjr6', 3, NULL, 'Active', NULL, NULL, NULL, 1, 1),
(6, 'hcngdanh', '$2a$12$Oy1J6YGhPdXGU6hqYIGQoe2PVmtYAOx9k3XXOKgYaIeqF/RzX1/VC', 4, NULL, 'Active', NULL, NULL, NULL, 1, 1);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `AcademicYears`
--
ALTER TABLE `AcademicYears`
  ADD PRIMARY KEY (`YearID`);

--
-- Chỉ mục cho bảng `Admins`
--
ALTER TABLE `Admins`
  ADD PRIMARY KEY (`AdminID`);

--
-- Chỉ mục cho bảng `Attendances`
--
ALTER TABLE `Attendances`
  ADD PRIMARY KEY (`AttendanceID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Chỉ mục cho bảng `BaseFees`
--
ALTER TABLE `BaseFees`
  ADD PRIMARY KEY (`FeeID`),
  ADD KEY `YearID` (`YearID`);

--
-- Chỉ mục cho bảng `Buildings`
--
ALTER TABLE `Buildings`
  ADD PRIMARY KEY (`BuildingID`),
  ADD KEY `CampusID` (`CampusID`);

--
-- Chỉ mục cho bảng `Campuses`
--
ALTER TABLE `Campuses`
  ADD PRIMARY KEY (`CampusID`);

--
-- Chỉ mục cho bảng `Classes`
--
ALTER TABLE `Classes`
  ADD PRIMARY KEY (`ClassID`),
  ADD KEY `GradeID` (`GradeID`),
  ADD KEY `BuildingID` (`BuildingID`),
  ADD KEY `YearID` (`YearID`);

--
-- Chỉ mục cho bảng `ClassTeachers`
--
ALTER TABLE `ClassTeachers`
  ADD PRIMARY KEY (`ClassID`,`TeacherID`),
  ADD KEY `TeacherID` (`TeacherID`);

--
-- Chỉ mục cho bảng `Conversations`
--
ALTER TABLE `Conversations`
  ADD PRIMARY KEY (`ConversationID`),
  ADD KEY `TeacherID` (`TeacherID`),
  ADD KEY `ParentID` (`ParentID`);

--
-- Chỉ mục cho bảng `DailyActivities`
--
ALTER TABLE `DailyActivities`
  ADD PRIMARY KEY (`ActivityID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Chỉ mục cho bảng `DailySchedules`
--
ALTER TABLE `DailySchedules`
  ADD PRIMARY KEY (`DailyScheduleID`),
  ADD KEY `idx_class_date` (`ClassID`,`ScheduleDate`);

--
-- Chỉ mục cho bảng `DailyStudentLessons`
--
ALTER TABLE `DailyStudentLessons`
  ADD PRIMARY KEY (`LessonLogID`),
  ADD KEY `idx_student_lesson_date` (`StudentID`,`LessonDate`);

--
-- Chỉ mục cho bảng `EventClasses`
--
ALTER TABLE `EventClasses`
  ADD PRIMARY KEY (`EventID`,`ClassID`),
  ADD KEY `ClassID` (`ClassID`);

--
-- Chỉ mục cho bảng `Events`
--
ALTER TABLE `Events`
  ADD PRIMARY KEY (`EventID`),
  ADD KEY `CreatedBy` (`CreatedBy`);

--
-- Chỉ mục cho bảng `Extracurriculars`
--
ALTER TABLE `Extracurriculars`
  ADD PRIMARY KEY (`ActivityID`);

--
-- Chỉ mục cho bảng `Feedbacks`
--
ALTER TABLE `Feedbacks`
  ADD PRIMARY KEY (`FeedbackID`),
  ADD KEY `ParentID` (`ParentID`),
  ADD KEY `RespondedByID` (`RespondedByID`);

--
-- Chỉ mục cho bảng `Grades`
--
ALTER TABLE `Grades`
  ADD PRIMARY KEY (`GradeID`);

--
-- Chỉ mục cho bảng `HealthRecords`
--
ALTER TABLE `HealthRecords`
  ADD PRIMARY KEY (`RecordID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Chỉ mục cho bảng `Invoices`
--
ALTER TABLE `Invoices`
  ADD PRIMARY KEY (`InvoiceID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `PackageID` (`PackageID`);

--
-- Chỉ mục cho bảng `LeaveRequests`
--
ALTER TABLE `LeaveRequests`
  ADD PRIMARY KEY (`RequestID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ParentID` (`ParentID`),
  ADD KEY `ApproverID` (`ApproverID`);

--
-- Chỉ mục cho bảng `MedicationRequests`
--
ALTER TABLE `MedicationRequests`
  ADD PRIMARY KEY (`MedRequestID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ParentID` (`ParentID`);

--
-- Chỉ mục cho bảng `Menus`
--
ALTER TABLE `Menus`
  ADD PRIMARY KEY (`MenuID`),
  ADD KEY `ClassID` (`ClassID`);

--
-- Chỉ mục cho bảng `Messages`
--
ALTER TABLE `Messages`
  ADD PRIMARY KEY (`MessageID`),
  ADD KEY `ConversationID` (`ConversationID`),
  ADD KEY `SenderID` (`SenderID`);

--
-- Chỉ mục cho bảng `Newsfeeds`
--
ALTER TABLE `Newsfeeds`
  ADD PRIMARY KEY (`PostID`),
  ADD KEY `ClassID` (`ClassID`),
  ADD KEY `TeacherID` (`TeacherID`);

--
-- Chỉ mục cho bảng `NewsfeedTags`
--
ALTER TABLE `NewsfeedTags`
  ADD PRIMARY KEY (`PostID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Chỉ mục cho bảng `Notifications`
--
ALTER TABLE `Notifications`
  ADD PRIMARY KEY (`NotifID`),
  ADD KEY `UserID` (`UserID`);

--
-- Chỉ mục cho bảng `Parents`
--
ALTER TABLE `Parents`
  ADD PRIMARY KEY (`ParentID`);

--
-- Chỉ mục cho bảng `PaymentPackages`
--
ALTER TABLE `PaymentPackages`
  ADD PRIMARY KEY (`PackageID`);

--
-- Chỉ mục cho bảng `Principals`
--
ALTER TABLE `Principals`
  ADD PRIMARY KEY (`PrincipalID`);

--
-- Chỉ mục cho bảng `QuickReplies`
--
ALTER TABLE `QuickReplies`
  ADD PRIMARY KEY (`ReplyID`),
  ADD KEY `TeacherID` (`TeacherID`);

--
-- Chỉ mục cho bảng `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`RoleID`);

--
-- Chỉ mục cho bảng `StudentAssessments`
--
ALTER TABLE `StudentAssessments`
  ADD PRIMARY KEY (`AssessmentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Chỉ mục cho bảng `StudentExtracurriculars`
--
ALTER TABLE `StudentExtracurriculars`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ActivityID` (`ActivityID`);

--
-- Chỉ mục cho bảng `StudentParents`
--
ALTER TABLE `StudentParents`
  ADD PRIMARY KEY (`StudentID`,`ParentID`),
  ADD KEY `ParentID` (`ParentID`);

--
-- Chỉ mục cho bảng `Students`
--
ALTER TABLE `Students`
  ADD PRIMARY KEY (`StudentID`),
  ADD KEY `ClassID` (`ClassID`);

--
-- Chỉ mục cho bảng `SystemLogs`
--
ALTER TABLE `SystemLogs`
  ADD PRIMARY KEY (`LogID`),
  ADD KEY `UserID` (`UserID`);

--
-- Chỉ mục cho bảng `TeacherRankHistory`
--
ALTER TABLE `TeacherRankHistory`
  ADD PRIMARY KEY (`HistoryID`),
  ADD KEY `TeacherID` (`TeacherID`),
  ADD KEY `UpdatedBy` (`UpdatedBy`);

--
-- Chỉ mục cho bảng `Teachers`
--
ALTER TABLE `Teachers`
  ADD PRIMARY KEY (`TeacherID`);

--
-- Chỉ mục cho bảng `Timetables`
--
ALTER TABLE `Timetables`
  ADD PRIMARY KEY (`ScheduleID`),
  ADD KEY `ClassID` (`ClassID`);

--
-- Chỉ mục cho bảng `Transactions`
--
ALTER TABLE `Transactions`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `InvoiceID` (`InvoiceID`);

--
-- Chỉ mục cho bảng `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD KEY `RoleID` (`RoleID`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `AcademicYears`
--
ALTER TABLE `AcademicYears`
  MODIFY `YearID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `Attendances`
--
ALTER TABLE `Attendances`
  MODIFY `AttendanceID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `BaseFees`
--
ALTER TABLE `BaseFees`
  MODIFY `FeeID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Buildings`
--
ALTER TABLE `Buildings`
  MODIFY `BuildingID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `Campuses`
--
ALTER TABLE `Campuses`
  MODIFY `CampusID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `Classes`
--
ALTER TABLE `Classes`
  MODIFY `ClassID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `Conversations`
--
ALTER TABLE `Conversations`
  MODIFY `ConversationID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `DailyActivities`
--
ALTER TABLE `DailyActivities`
  MODIFY `ActivityID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `DailySchedules`
--
ALTER TABLE `DailySchedules`
  MODIFY `DailyScheduleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `DailyStudentLessons`
--
ALTER TABLE `DailyStudentLessons`
  MODIFY `LessonLogID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `Events`
--
ALTER TABLE `Events`
  MODIFY `EventID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Extracurriculars`
--
ALTER TABLE `Extracurriculars`
  MODIFY `ActivityID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Feedbacks`
--
ALTER TABLE `Feedbacks`
  MODIFY `FeedbackID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Grades`
--
ALTER TABLE `Grades`
  MODIFY `GradeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `HealthRecords`
--
ALTER TABLE `HealthRecords`
  MODIFY `RecordID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Invoices`
--
ALTER TABLE `Invoices`
  MODIFY `InvoiceID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `LeaveRequests`
--
ALTER TABLE `LeaveRequests`
  MODIFY `RequestID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `MedicationRequests`
--
ALTER TABLE `MedicationRequests`
  MODIFY `MedRequestID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Menus`
--
ALTER TABLE `Menus`
  MODIFY `MenuID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Messages`
--
ALTER TABLE `Messages`
  MODIFY `MessageID` bigint NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Newsfeeds`
--
ALTER TABLE `Newsfeeds`
  MODIFY `PostID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `NotifID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `PaymentPackages`
--
ALTER TABLE `PaymentPackages`
  MODIFY `PackageID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `QuickReplies`
--
ALTER TABLE `QuickReplies`
  MODIFY `ReplyID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Roles`
--
ALTER TABLE `Roles`
  MODIFY `RoleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `StudentAssessments`
--
ALTER TABLE `StudentAssessments`
  MODIFY `AssessmentID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `StudentExtracurriculars`
--
ALTER TABLE `StudentExtracurriculars`
  MODIFY `EnrollmentID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Students`
--
ALTER TABLE `Students`
  MODIFY `StudentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `SystemLogs`
--
ALTER TABLE `SystemLogs`
  MODIFY `LogID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `TeacherRankHistory`
--
ALTER TABLE `TeacherRankHistory`
  MODIFY `HistoryID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Timetables`
--
ALTER TABLE `Timetables`
  MODIFY `ScheduleID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Transactions`
--
ALTER TABLE `Transactions`
  MODIFY `TransactionID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Users`
--
ALTER TABLE `Users`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `Admins`
--
ALTER TABLE `Admins`
  ADD CONSTRAINT `Admins_ibfk_1` FOREIGN KEY (`AdminID`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `Attendances`
--
ALTER TABLE `Attendances`
  ADD CONSTRAINT `Attendances_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`);

--
-- Ràng buộc cho bảng `BaseFees`
--
ALTER TABLE `BaseFees`
  ADD CONSTRAINT `BaseFees_ibfk_1` FOREIGN KEY (`YearID`) REFERENCES `AcademicYears` (`YearID`);

--
-- Ràng buộc cho bảng `Buildings`
--
ALTER TABLE `Buildings`
  ADD CONSTRAINT `Buildings_ibfk_1` FOREIGN KEY (`CampusID`) REFERENCES `Campuses` (`CampusID`);

--
-- Ràng buộc cho bảng `Classes`
--
ALTER TABLE `Classes`
  ADD CONSTRAINT `Classes_ibfk_1` FOREIGN KEY (`GradeID`) REFERENCES `Grades` (`GradeID`),
  ADD CONSTRAINT `Classes_ibfk_2` FOREIGN KEY (`BuildingID`) REFERENCES `Buildings` (`BuildingID`),
  ADD CONSTRAINT `Classes_ibfk_3` FOREIGN KEY (`YearID`) REFERENCES `AcademicYears` (`YearID`);

--
-- Ràng buộc cho bảng `ClassTeachers`
--
ALTER TABLE `ClassTeachers`
  ADD CONSTRAINT `ClassTeachers_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`),
  ADD CONSTRAINT `ClassTeachers_ibfk_2` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`);

--
-- Ràng buộc cho bảng `Conversations`
--
ALTER TABLE `Conversations`
  ADD CONSTRAINT `Conversations_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`),
  ADD CONSTRAINT `Conversations_ibfk_2` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`);

--
-- Ràng buộc cho bảng `DailyActivities`
--
ALTER TABLE `DailyActivities`
  ADD CONSTRAINT `DailyActivities_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`);

--
-- Ràng buộc cho bảng `DailySchedules`
--
ALTER TABLE `DailySchedules`
  ADD CONSTRAINT `FK_DailySchedules_Classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `DailyStudentLessons`
--
ALTER TABLE `DailyStudentLessons`
  ADD CONSTRAINT `FK_DailyStudentLessons_Students` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `EventClasses`
--
ALTER TABLE `EventClasses`
  ADD CONSTRAINT `EventClasses_ibfk_1` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`) ON DELETE CASCADE,
  ADD CONSTRAINT `EventClasses_ibfk_2` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `Events`
--
ALTER TABLE `Events`
  ADD CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`CreatedBy`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `Feedbacks`
--
ALTER TABLE `Feedbacks`
  ADD CONSTRAINT `Feedbacks_ibfk_1` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`),
  ADD CONSTRAINT `Feedbacks_ibfk_2` FOREIGN KEY (`RespondedByID`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `HealthRecords`
--
ALTER TABLE `HealthRecords`
  ADD CONSTRAINT `HealthRecords_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`);

--
-- Ràng buộc cho bảng `Invoices`
--
ALTER TABLE `Invoices`
  ADD CONSTRAINT `Invoices_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `Invoices_ibfk_2` FOREIGN KEY (`PackageID`) REFERENCES `PaymentPackages` (`PackageID`);

--
-- Ràng buộc cho bảng `LeaveRequests`
--
ALTER TABLE `LeaveRequests`
  ADD CONSTRAINT `LeaveRequests_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `LeaveRequests_ibfk_2` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`),
  ADD CONSTRAINT `LeaveRequests_ibfk_3` FOREIGN KEY (`ApproverID`) REFERENCES `Teachers` (`TeacherID`);

--
-- Ràng buộc cho bảng `MedicationRequests`
--
ALTER TABLE `MedicationRequests`
  ADD CONSTRAINT `MedicationRequests_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `MedicationRequests_ibfk_2` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`);

--
-- Ràng buộc cho bảng `Menus`
--
ALTER TABLE `Menus`
  ADD CONSTRAINT `Menus_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`);

--
-- Ràng buộc cho bảng `Messages`
--
ALTER TABLE `Messages`
  ADD CONSTRAINT `Messages_ibfk_1` FOREIGN KEY (`ConversationID`) REFERENCES `Conversations` (`ConversationID`),
  ADD CONSTRAINT `Messages_ibfk_2` FOREIGN KEY (`SenderID`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `Newsfeeds`
--
ALTER TABLE `Newsfeeds`
  ADD CONSTRAINT `Newsfeeds_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`),
  ADD CONSTRAINT `Newsfeeds_ibfk_2` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`);

--
-- Ràng buộc cho bảng `NewsfeedTags`
--
ALTER TABLE `NewsfeedTags`
  ADD CONSTRAINT `NewsfeedTags_ibfk_1` FOREIGN KEY (`PostID`) REFERENCES `Newsfeeds` (`PostID`) ON DELETE CASCADE,
  ADD CONSTRAINT `NewsfeedTags_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `Notifications`
--
ALTER TABLE `Notifications`
  ADD CONSTRAINT `Notifications_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `Parents`
--
ALTER TABLE `Parents`
  ADD CONSTRAINT `Parents_ibfk_1` FOREIGN KEY (`ParentID`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `Principals`
--
ALTER TABLE `Principals`
  ADD CONSTRAINT `Principals_ibfk_1` FOREIGN KEY (`PrincipalID`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `QuickReplies`
--
ALTER TABLE `QuickReplies`
  ADD CONSTRAINT `QuickReplies_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`);

--
-- Ràng buộc cho bảng `StudentAssessments`
--
ALTER TABLE `StudentAssessments`
  ADD CONSTRAINT `StudentAssessments_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`);

--
-- Ràng buộc cho bảng `StudentExtracurriculars`
--
ALTER TABLE `StudentExtracurriculars`
  ADD CONSTRAINT `StudentExtracurriculars_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `StudentExtracurriculars_ibfk_2` FOREIGN KEY (`ActivityID`) REFERENCES `Extracurriculars` (`ActivityID`);

--
-- Ràng buộc cho bảng `StudentParents`
--
ALTER TABLE `StudentParents`
  ADD CONSTRAINT `StudentParents_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `StudentParents_ibfk_2` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`);

--
-- Ràng buộc cho bảng `Students`
--
ALTER TABLE `Students`
  ADD CONSTRAINT `Students_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`);

--
-- Ràng buộc cho bảng `SystemLogs`
--
ALTER TABLE `SystemLogs`
  ADD CONSTRAINT `SystemLogs_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `TeacherRankHistory`
--
ALTER TABLE `TeacherRankHistory`
  ADD CONSTRAINT `TeacherRankHistory_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`),
  ADD CONSTRAINT `TeacherRankHistory_ibfk_2` FOREIGN KEY (`UpdatedBy`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `Teachers`
--
ALTER TABLE `Teachers`
  ADD CONSTRAINT `Teachers_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `Timetables`
--
ALTER TABLE `Timetables`
  ADD CONSTRAINT `Timetables_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`);

--
-- Ràng buộc cho bảng `Transactions`
--
ALTER TABLE `Transactions`
  ADD CONSTRAINT `Transactions_ibfk_1` FOREIGN KEY (`InvoiceID`) REFERENCES `Invoices` (`InvoiceID`);

--
-- Ràng buộc cho bảng `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `Roles` (`RoleID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
