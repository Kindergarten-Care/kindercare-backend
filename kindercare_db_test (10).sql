-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: kindercare-mysql:3306
-- Generation Time: Jul 09, 2026 at 02:22 PM
-- Server version: 8.0.45
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `kindercare_db_test`
--

-- --------------------------------------------------------

--
-- Table structure for table `AcademicYears`
--

CREATE TABLE `AcademicYears` (
  `YearID` int NOT NULL,
  `YearName` varchar(50) NOT NULL,
  `StartDate` bigint NOT NULL,
  `EndDate` bigint NOT NULL,
  `IsActive` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `AcademicYears`
--

INSERT INTO `AcademicYears` (`YearID`, `YearName`, `StartDate`, `EndDate`, `IsActive`) VALUES
(1, 'Niên khóa 2026-2027', 1788566400, 1811721600, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Admins`
--

CREATE TABLE `Admins` (
  `AdminID` int NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Admins`
--

INSERT INTO `Admins` (`AdminID`, `FullName`, `PhoneNumber`, `Email`) VALUES
(1, 'Admin Hệ Thống', '0909000111', 'admin@kindercare.app');

-- --------------------------------------------------------

--
-- Table structure for table `Allergies`
--

CREATE TABLE `Allergies` (
  `AllergyID` int NOT NULL COMMENT 'PK',
  `StudentID` int NOT NULL COMMENT 'FK -> Students.StudentID',
  `Allergen` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Tên chất gây dị ứng (VD: Đậu phộng, Trứng, Sữa bò)',
  `Severity` enum('Mild','Moderate','Severe') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Mild' COMMENT 'Mức độ',
  `Reaction` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'Triệu chứng phản ứng (phát ban, ngứa, ...)',
  `Notes` text COLLATE utf8mb4_unicode_ci COMMENT 'Ghi chú thêm của giáo viên / phụ huynh',
  `IsActive` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = còn hiệu lực, 0 = đã hết',
  `CreatedAt` bigint NOT NULL DEFAULT (unix_timestamp()) COMMENT 'Thời điểm tạo',
  `UpdatedAt` bigint NOT NULL DEFAULT (unix_timestamp()) COMMENT 'Thời điểm cập nhật'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh sách dị ứng của học sinh (chuẩn hoá)';

--
-- Dumping data for table `Allergies`
--

INSERT INTO `Allergies` (`AllergyID`, `StudentID`, `Allergen`, `Severity`, `Reaction`, `Notes`, `IsActive`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 19, 'Đậu phộng', 'Severe', 'Phát ban, khó thở', NULL, 1, 1783559299, 1783559299),
(2, 117, 'Đậu phộng (lạc)', 'Severe', 'Sốc phản vệ, khó thở', 'Bố mẹ đã thông báo, cần tránh hoàn toàn', 1, 1783560392, 1783560392),
(3, 109, 'Sữa bò', 'Moderate', 'Phát ban đỏ, ngứa', NULL, 1, 1783560392, 1783560392),
(4, 107, 'Trứng', 'Mild', 'Nổi mề đay nhẹ', 'Theo dõi khi ăn trứng', 1, 1783560392, 1783560392),
(5, 116, 'Hải sản có vỏ (tôm, cua)', 'Moderate', 'Đau bụng, buồn nôn', 'Tránh cho bé ăn hải sản', 1, 1783560392, 1783560392),
(6, 120, 'Bụi phấn hoa', 'Mild', 'Hắt hơi, sổ mũi', 'Mùa xuân cần chú ý', 1, 1783560392, 1783560392),
(7, 115, 'Sô cô la', 'Moderate', 'Nổi mẩn đỏ quanh miệng', 'Chỉ ăn một lượng nhỏ', 1, 1783560392, 1783560392),
(8, 117, 'Đậu phộng (lạc)', 'Severe', 'Sốc phản vệ, khó thở', 'Bố mẹ đã thông báo, cần tránh hoàn toàn', 1, 1783560469, 1783560469),
(9, 109, 'Sữa bò', 'Moderate', 'Phát ban đỏ, ngứa', NULL, 1, 1783560469, 1783560469),
(10, 107, 'Trứng', 'Mild', 'Nổi mề đay nhẹ', 'Theo dõi khi ăn trứng', 1, 1783560469, 1783560469),
(11, 116, 'Hải sản có vỏ (tôm, cua)', 'Moderate', 'Đau bụng, buồn nôn', 'Tránh cho bé ăn hải sản', 1, 1783560469, 1783560469),
(12, 120, 'Bụi phấn hoa', 'Mild', 'Hắt hơi, sổ mũi', 'Mùa xuân cần chú ý', 1, 1783560469, 1783560469),
(13, 115, 'Sô cô la', 'Moderate', 'Nổi mẩn đỏ quanh miệng', 'Chỉ ăn một lượng nhỏ', 1, 1783560469, 1783560469);

-- --------------------------------------------------------

--
-- Table structure for table `Attendances`
--

CREATE TABLE `Attendances` (
  `AttendanceID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `AttendanceDate` bigint NOT NULL,
  `Status` varchar(50) NOT NULL,
  `CheckInTime` bigint DEFAULT NULL,
  `CheckOutTime` bigint DEFAULT NULL,
  `CheckedInByTeacherID` int DEFAULT NULL,
  `CheckedOutByTeacherID` int DEFAULT NULL,
  `ProxyAuthorizationID` int DEFAULT NULL,
  `DroppedOffByParentID` int DEFAULT NULL,
  `PickedUpByParentID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Attendances`
--

INSERT INTO `Attendances` (`AttendanceID`, `StudentID`, `AttendanceDate`, `Status`, `CheckInTime`, `CheckOutTime`, `CheckedInByTeacherID`, `CheckedOutByTeacherID`, `ProxyAuthorizationID`, `DroppedOffByParentID`, `PickedUpByParentID`) VALUES
(296, 19, 1783555200, 'Present', 1783565580, NULL, NULL, NULL, NULL, NULL, NULL),
(297, 1, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(298, 105, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(299, 106, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(300, 107, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(301, 108, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(302, 109, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(303, 110, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(304, 111, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(305, 112, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(306, 113, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(307, 114, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(308, 115, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(309, 116, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(310, 117, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(311, 118, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(312, 119, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(313, 120, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(314, 121, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(315, 122, 1783555200, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `BaseFees`
--

CREATE TABLE `BaseFees` (
  `FeeID` int NOT NULL,
  `YearID` int DEFAULT NULL,
  `MonthlyTuition` decimal(15,2) NOT NULL,
  `DailyMealFee` decimal(15,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `BaseFees`
--

INSERT INTO `BaseFees` (`FeeID`, `YearID`, `MonthlyTuition`, `DailyMealFee`) VALUES
(1, 1, 4000000.00, 50000.00);

-- --------------------------------------------------------

--
-- Table structure for table `Buildings`
--

CREATE TABLE `Buildings` (
  `BuildingID` int NOT NULL,
  `BuildingName` varchar(100) NOT NULL,
  `CampusID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Buildings`
--

INSERT INTO `Buildings` (`BuildingID`, `BuildingName`, `CampusID`) VALUES
(1, 'Tòa A (Khối Mầm)', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Campuses`
--

CREATE TABLE `Campuses` (
  `CampusID` int NOT NULL,
  `CampusName` varchar(100) NOT NULL,
  `Address` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Campuses`
--

INSERT INTO `Campuses` (`CampusID`, `CampusName`, `Address`) VALUES
(1, 'Cơ sở 1 - Quận 1', '65 Huỳnh Thúc Kháng, Bến Nghé, Q1');

-- --------------------------------------------------------

--
-- Table structure for table `Classes`
--

CREATE TABLE `Classes` (
  `ClassID` int NOT NULL,
  `ClassName` varchar(50) NOT NULL,
  `GradeID` int DEFAULT NULL,
  `BuildingID` int DEFAULT NULL,
  `YearID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Classes`
--

INSERT INTO `Classes` (`ClassID`, `ClassName`, `GradeID`, `BuildingID`, `YearID`) VALUES
(1, 'Mầm 1', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `ClassTeachers`
--

CREATE TABLE `ClassTeachers` (
  `ClassID` int NOT NULL,
  `TeacherID` int NOT NULL,
  `RoleInClass` varchar(50) DEFAULT NULL,
  `AssignedDate` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `ClassTeachers`
--

INSERT INTO `ClassTeachers` (`ClassID`, `TeacherID`, `RoleInClass`, `AssignedDate`) VALUES
(1, 5, 'Giáo viên trưởng', 1781082000);

-- --------------------------------------------------------

--
-- Table structure for table `DailyActivities`
--

CREATE TABLE `DailyActivities` (
  `ActivityID` int NOT NULL,
  `StudentID` int NOT NULL,
  `LogDate` date NOT NULL COMMENT 'Ngày ghi nhận nhật ký (YYYY-MM-DD)',
  `BreakfastStatus` varchar(50) DEFAULT NULL COMMENT 'Ăn sáng: Ăn hết / Ăn chậm / Bỏ bữa',
  `LunchStatus` varchar(50) DEFAULT NULL COMMENT 'Ăn trưa: Ăn hết / Ăn chậm / Bỏ bữa',
  `NapStatus` varchar(50) DEFAULT NULL COMMENT 'Ngủ trưa: Ngủ ngoan / Khó ngủ / Quấy khóc',
  `SnackStatus` varchar(50) DEFAULT NULL COMMENT 'Ăn xế: Ăn hết / Ăn chậm',
  `HygieneStatus` varchar(50) DEFAULT 'Bình thường' COMMENT 'Vệ sinh: Tốt / Bình thường / Cần chú ý',
  `TeacherNote` text COMMENT 'Lời phê/ghi chú chi tiết của giáo viên gửi phụ huynh',
  `ActivityStatus` varchar(50) DEFAULT NULL,
  `RecordedBy` int DEFAULT NULL COMMENT 'ID của Giáo viên đánh giá',
  `UpdatedAt` bigint NOT NULL COMMENT 'Lưu thời gian cập nhật cuối cùng (UNIX)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `DailyActivities`
--

INSERT INTO `DailyActivities` (`ActivityID`, `StudentID`, `LogDate`, `BreakfastStatus`, `LunchStatus`, `NapStatus`, `SnackStatus`, `HygieneStatus`, `TeacherNote`, `ActivityStatus`, `RecordedBy`, `UpdatedAt`) VALUES
(1, 19, '2026-07-09', 'Ăn hết', 'Ăn hết', 'Ngủ ngoan', NULL, 'Tốt', 'Bé hôm nay rất ngoan và tích cực tham gia hoạt động.', NULL, 5, 1783559299);

-- --------------------------------------------------------

--
-- Table structure for table `DailyAlbumPhotos`
--

CREATE TABLE `DailyAlbumPhotos` (
  `PhotoID` int NOT NULL,
  `AlbumID` int NOT NULL,
  `PhotoURL` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `DailyAlbumPhotos`
--

INSERT INTO `DailyAlbumPhotos` (`PhotoID`, `AlbumID`, `PhotoURL`, `Description`, `CreatedAt`) VALUES
(3001, 300, 'https://picsum.photos/id/1011/800/600', 'Bé Chánh tươi cười rạng rỡ chào cô giáo ở cổng trường đầu ngày', 1783274220),
(3002, 300, 'https://picsum.photos/id/1025/800/600', 'Các bạn nhỏ nghiêm túc xếp hàng đo thân nhiệt và sát khuẩn tay', 1783274220),
(3003, 300, 'https://picsum.photos/id/1043/800/600', 'Khởi động năng lượng ngày mới với bài dân vũ sôi động ngoài sân', 1783274220),
(3004, 300, 'https://picsum.photos/id/1062/800/600', 'Giờ ăn sáng: Bé Chánh tự xúc súp cua rất gọn gàng, không rơi vãi', 1783274220),
(3005, 300, 'https://picsum.photos/id/1074/800/600', 'Bé Chánh tập trung cao độ trong giờ học Montessori cá nhân', 1783274220),
(3006, 300, 'https://picsum.photos/id/1084/800/600', 'Thực hành giáo cụ chuyên sâu: Phân loại hình khối theo kích thước', 1783274220),
(3007, 300, 'https://picsum.photos/id/111/800/600', 'Hoạt động nhóm: Các con phối hợp lắp ráp mô hình thành phố lego', 1783274220),
(3008, 300, 'https://picsum.photos/id/133/800/600', 'Bé Chánh tương tác cực kỳ tự tin trong giờ Tiếng Anh bản ngữ', 1783274220),
(3009, 300, 'https://picsum.photos/id/146/800/600', 'Trò chơi phản xạ nhanh: Nhận diện từ vựng chủ đề Ocean qua flashcard', 1783274220),
(3010, 300, 'https://picsum.photos/id/152/800/600', 'Đến giờ vận động tự do: Các con ùa ra khu vui chơi nhà bóng liên hoàn', 1783274220),
(3011, 300, 'https://picsum.photos/id/159/800/600', 'Bé Chánh cùng các bạn trổ tài xây dựng lâu đài trên cát', 1783274220),
(3012, 300, 'https://picsum.photos/id/160/800/600', 'Khoảnh khắc bé Chánh dũng cảm chinh phục cầu trượt trên cao', 1783274220),
(3013, 300, 'https://picsum.photos/id/175/800/600', 'Các con tự giác xếp hàng rửa tay bằng xà phòng chuẩn 6 bước trước khi ăn trưa', 1783274220),
(3014, 300, 'https://picsum.photos/id/180/800/600', 'Bữa trưa hào hứng ngon miệng với cơm tẻ, cá hồi áp chảo và canh rau', 1783274220),
(3015, 300, 'https://picsum.photos/id/192/800/600', 'Giờ ngủ trưa yên tĩnh, không khí mát mẻ giúp các con ngủ rất sâu giấc', 1783274220),
(3016, 300, 'https://picsum.photos/id/200/800/600', 'Bữa xế chiều nhẹ nhàng: Thưởng thức món bánh flan sữa tươi béo ngậy', 1783274220),
(3017, 300, 'https://picsum.photos/id/204/800/600', 'Giờ học năng khiếu tạo hình: Bé Chánh say sưa vẽ tranh cá voi', 1783274220),
(3018, 300, 'https://picsum.photos/id/212/800/600', 'Bé Chánh tự hào giơ cao bức tranh phối màu đại dương cực khéo', 1783274220),
(3019, 300, 'https://picsum.photos/id/219/800/600', 'Rèn luyện thói quen tốt: Các bạn nhỏ tự thu dọn giáo cụ vào khay kệ', 1783274220),
(3020, 300, 'https://picsum.photos/id/237/800/600', 'Chuẩn bị quần áo vào balo chỉnh tề, ngồi ngoan đợi ba mẹ đến đón', 1783274220);

-- --------------------------------------------------------

--
-- Table structure for table `DailyAlbums`
--

CREATE TABLE `DailyAlbums` (
  `AlbumID` int NOT NULL,
  `ClassID` int NOT NULL,
  `TeacherID` int NOT NULL,
  `AlbumDate` bigint NOT NULL,
  `Caption` text,
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `DailyAlbums`
--

INSERT INTO `DailyAlbums` (`AlbumID`, `ClassID`, `TeacherID`, `AlbumDate`, `Caption`, `CreatedAt`, `UpdatedAt`) VALUES
(300, 1, 5, 1783296000, 'Album ảnh ngày 06/07/2026: Một ngày trải nghiệm phương pháp giáo dục hiện đại và chuỗi hoạt động thể chất liên hoàn của các con lớp Mầm 1. Chúc ba mẹ một tuần mới tràn đầy năng lượng!', 1783274220, 1783274220);

-- --------------------------------------------------------

--
-- Table structure for table `DailyLessons`
--

CREATE TABLE `DailyLessons` (
  `LessonLogID` int NOT NULL,
  `ClassID` int NOT NULL,
  `LessonDate` bigint NOT NULL,
  `SubjectName` varchar(50) NOT NULL,
  `LessonTitle` varchar(150) NOT NULL,
  `Details` text NOT NULL,
  `IconType` varchar(50) DEFAULT 'default',
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `DailyLessons`
--

INSERT INTO `DailyLessons` (`LessonLogID`, `ClassID`, `LessonDate`, `SubjectName`, `LessonTitle`, `Details`, `IconType`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, 1783296000, 'TẠO HÌNH', 'Vẽ và tô màu con cá', 'Cô hướng dẫn bé vẽ con cá bằng các nét cơ bản và tô màu bằng sáp màu.', 'draw', 1782866086, 1782866086),
(2, 1, 1783296000, 'TIẾNG ANH', 'Từ vựng chủ đề Màu sắc (Colors)', 'Bé làm quen với 3 màu cơ bản: Red, Blue, Yellow qua thẻ flashcard và trò chơi.', 'english', 1782866086, 1782866086);

-- --------------------------------------------------------

--
-- Table structure for table `DailySchedules`
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
-- Dumping data for table `DailySchedules`
--

INSERT INTO `DailySchedules` (`DailyScheduleID`, `ClassID`, `ScheduleDate`, `StartTime`, `EndTime`, `ActivityName`, `Details`, `Location`, `ActivityType`, `Status`, `CreatedAt`, `UpdatedAt`) VALUES
(46, 1, 1783296000, 1782630000, 1782631800, 'Đón bé & Chào hỏi', NULL, 'Cổng A', 'pickup', 'Xong', 1782581308, 1783429635),
(47, 1, 1783296000, 1782631800, 1782633600, 'Ăn sáng', 'Cháo yến mạch + sữa', NULL, 'meal', 'Xong', 1782581308, 1783429638),
(48, 1, 1783296000, 1782633600, 1782637200, 'Hoạt động sáng tạo', 'Vẽ tranh & tô màu', NULL, 'study', 'Xong', 1782581308, 1783429639),
(49, 1, 1783296000, 1782637200, 1782642600, 'Vận động ngoài trời', 'Sân vườn - Chơi tự do', 'Sân vườn', 'play', 'Xong', 1782581308, 1783434534),
(50, 1, 1783296000, 1782644400, 1782646200, 'Ăn trưa', 'Cơm + canh rau + thịt', NULL, 'meal', 'Chưa diễn ra', 1782581308, 1782617335),
(51, 1, 1783296000, 1782648000, 1782655200, 'Ngủ trưa', 'Ngủ tại phòng ngủ', 'Phòng ngủ', 'nap', 'Chưa diễn ra', 1782581308, 1782617335),
(52, 1, 1783296000, 1782657000, 1782658800, 'Ăn xế', 'Bánh + sữa', NULL, 'meal', 'Chưa diễn ra', 1782581308, 1782617335),
(53, 1, 1783296000, 1782658800, 1782662400, 'Hoạt động nhóm', 'Kể chuyện & hát', NULL, 'study', 'Chưa diễn ra', 1782581308, 1782617335),
(54, 1, 1783296000, 1782664200, 1782666000, 'Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ đón', NULL, 'dropoff', 'Chưa diễn ra', 1782581308, 1782617335),
(200, 1, 1783296000, 1782717300, 1782720000, 'Đón bé & Kiểm tra vệ sinh sáng', 'Đón tại cổng', 'Cổng A', 'pickup', 'Xong', 1782585292, 1782585292),
(201, 1, 1783296000, 1782720000, 1782721800, 'Thể dục buổi sáng ngoài sân', 'Tập bài dân vũ', 'Sân trường', 'study', 'Xong', 1782585292, 1782585292),
(202, 1, 1783296000, 1782721800, 1782723600, 'Ăn sáng & Vệ sinh cá nhân', 'Súp cua', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1782585292),
(203, 1, 1783296000, 1782723600, 1782728100, 'Học tập chuyên đề', 'Khám phá thiên nhiên', 'Lớp học', 'study', 'Xong', 1782585292, 1782585292),
(204, 1, 1783296000, 1782728100, 1782731700, 'Vui chơi tự do ở góc học tập', 'Xếp hình lego', 'Lớp học', 'play', 'Xong', 1782585292, 1782585292),
(205, 1, 1783296000, 1782731700, 1782734400, 'Ăn trưa & chuẩn bị giờ ngủ trưa', 'Cơm thịt xào', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1782585292),
(206, 1, 1783296000, 1782734400, 1782741600, 'Giấc ngủ trưa của trẻ', 'Ngủ sâu', 'Phòng ngủ', 'nap', 'Xong', 1782585292, 1782585292),
(207, 1, 1783296000, 1782741600, 1782743400, 'Ăn xế chiều', 'Bánh flan', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1782585292),
(208, 1, 1783296000, 1782743400, 1782748800, 'Hoạt động kể chuyện cổ tích', 'Cô kể bé nghe', 'Lớp học', 'study', 'Xong', 1782585292, 1782585292),
(209, 1, 1783296000, 1782748800, 1782752400, 'Vệ sinh & Trả trẻ cho phụ huynh', 'Vệ sinh sạch sẽ', 'Cổng A', 'dropoff', 'Xong', 1782585292, 1782585292),
(210, 1, 1783296000, 1782803700, 1782806400, 'Đón bé & Kiểm tra vệ sinh sáng', 'Đón tại cổng', 'Cổng A', 'pickup', 'Xong', 1782585292, 1782800791),
(211, 1, 1783296000, 1782806400, 1782808200, 'Thể dục buổi sáng ngoài sân', 'Tập bài dân vũ', 'Sân trường', 'study', 'Xong', 1782585292, 1782800792),
(212, 1, 1783296000, 1782808200, 1782810000, 'Ăn sáng & Vệ sinh cá nhân', 'Súp cua', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1782800792),
(213, 1, 1783296000, 1782810000, 1782814500, 'Học tập chuyên đề', 'Khám phá thiên nhiên', 'Lớp học', 'study', 'Xong', 1782585292, 1782800792),
(214, 1, 1783296000, 1782814500, 1782818100, 'Vui chơi tự do ở góc học tập', 'Xếp hình lego', 'Lớp học', 'play', 'Chưa diễn ra', 1782585292, 1782800791),
(215, 1, 1783296000, 1782818100, 1782820800, 'Ăn trưa & chuẩn bị giờ ngủ trưa', 'Cơm thịt xào', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1782800792),
(216, 1, 1783296000, 1782820800, 1782828000, 'Giấc ngủ trưa của trẻ', 'Ngủ sâu', 'Phòng ngủ', 'nap', 'Chưa diễn ra', 1782585292, 1782800792),
(217, 1, 1783296000, 1782828000, 1782829800, 'Ăn xế chiều', 'Bánh flan', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782800792),
(218, 1, 1783296000, 1782829800, 1782835200, 'Hoạt động kể chuyện cổ tích', 'Cô kể bé nghe', 'Lớp học', 'study', 'Chưa diễn ra', 1782585292, 1782800792),
(219, 1, 1783296000, 1782835200, 1782838800, 'Vệ sinh & Trả trẻ cho phụ huynh', 'Vệ sinh sạch sẽ', 'Cổng A', 'dropoff', 'Chưa diễn ra', 1782585292, 1782800792),
(220, 1, 1783296000, 1782890100, 1782892800, 'Đón bé & Kiểm tra vệ sinh sáng', 'Đón tại cổng', 'Cổng A', 'pickup', 'Chưa diễn ra', 1782585292, 1782585292),
(221, 1, 1783296000, 1782892800, 1782894600, 'Thể dục buổi sáng ngoài sân', 'Tập bài dân vũ', 'Sân trường', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(222, 1, 1783296000, 1782894600, 1782896400, 'Ăn sáng & Vệ sinh cá nhân', 'Súp cua', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(223, 1, 1783296000, 1782896400, 1782900900, 'Học tập chuyên đề', 'Khám phá thiên nhiên', 'Lớp học', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(224, 1, 1783296000, 1782900900, 1782904500, 'Vui chơi tự do ở góc học tập', 'Xếp hình lego', 'Lớp học', 'play', 'Chưa diễn ra', 1782585292, 1782585292),
(225, 1, 1783296000, 1782904500, 1782907200, 'Ăn trưa & chuẩn bị giờ ngủ trưa', 'Cơm thịt xào', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(226, 1, 1783296000, 1782907200, 1782914400, 'Giấc ngủ trưa của trẻ', 'Ngủ sâu', 'Phòng ngủ', 'nap', 'Chưa diễn ra', 1782585292, 1782585292),
(227, 1, 1783296000, 1782914400, 1782916200, 'Ăn xế chiều', 'Bánh flan', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(228, 1, 1783296000, 1782916200, 1782921600, 'Hoạt động kể chuyện cổ tích', 'Cô kể bé nghe', 'Lớp học', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(229, 1, 1783296000, 1782921600, 1782925200, 'Vệ sinh & Trả trẻ cho phụ huynh', 'Vệ sinh sạch sẽ', 'Cổng A', 'dropoff', 'Chưa diễn ra', 1782585292, 1782585292),
(230, 1, 1783296000, 1783322100, 1783324800, 'Đón bé & Kiểm tra vệ sinh sáng', 'Đón tại cổng', 'Cổng A', 'pickup', 'Chưa diễn ra', 1782585292, 1782585292),
(231, 1, 1783296000, 1783324800, 1783326600, 'Thể dục buổi sáng ngoài sân', 'Tập bài dân vũ', 'Sân trường', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(232, 1, 1783296000, 1783326600, 1783328400, 'Ăn sáng & Vệ sinh cá nhân', 'Súp cua', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(233, 1, 1783296000, 1783328400, 1783332900, 'Học tập chuyên đề', 'Khám phá thiên nhiên', 'Lớp học', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(234, 1, 1783296000, 1783332900, 1783336500, 'Vui chơi tự do ở góc học tập', 'Xếp hình lego', 'Lớp học', 'play', 'Chưa diễn ra', 1782585292, 1782585292),
(235, 1, 1783296000, 1783336500, 1783339200, 'Ăn trưa & chuẩn bị giờ ngủ trưa', 'Cơm thịt xào', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(236, 1, 1783296000, 1783339200, 1783346400, 'Giấc ngủ trưa của trẻ', 'Ngủ sâu', 'Phòng ngủ', 'nap', 'Chưa diễn ra', 1782585292, 1782585292),
(237, 1, 1783296000, 1783346400, 1783348200, 'Ăn xế chiều', 'Bánh flan', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1783435426),
(238, 1, 1783296000, 1783348200, 1783353600, 'Hoạt động kể chuyện cổ tích', 'Cô kể bé nghe', 'Lớp học', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(239, 1, 1783296000, 1783353600, 1783357200, 'Vệ sinh & Trả trẻ cho phụ huynh', 'Vệ sinh sạch sẽ', 'Cổng A', 'dropoff', 'Chưa diễn ra', 1782585292, 1782585292),
(300, 1, 1783296000, 1782630900, 1782633600, 'Đón bé & Kiểm tra vệ sinh sáng', 'Đón tại cổng', 'Cổng A', 'pickup', 'Xong', 1782585456, 1782617335),
(301, 1, 1783296000, 1782633600, 1782635400, 'Thể dục buổi sáng ngoài sân', 'Tập bài dân vũ', 'Sân trường', 'study', 'Xong', 1782585456, 1782617335),
(302, 1, 1783296000, 1782635400, 1782637200, 'Ăn sáng & Vệ sinh cá nhân', 'Súp cua', 'Phòng ăn', 'meal', 'Xong', 1782585456, 1782617335),
(303, 1, 1783296000, 1782637200, 1782641700, 'Học tập chuyên đề', 'Khám phá thiên nhiên', 'Lớp học', 'study', 'Xong', 1782585456, 1782617335),
(304, 1, 1783296000, 1782641700, 1782645300, 'Vui chơi tự do ở góc học tập', 'Xếp hình lego', 'Lớp học', 'play', 'Chưa diễn ra', 1782585456, 1782617335),
(305, 1, 1783296000, 1782645300, 1782648000, 'Ăn trưa & chuẩn bị giờ ngủ trưa', 'Cơm thịt xào', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585456, 1782617335),
(306, 1, 1783296000, 1782648000, 1782655200, 'Giấc ngủ trưa của trẻ', 'Ngủ sâu', 'Phòng ngủ', 'nap', 'Chưa diễn ra', 1782585456, 1782617335),
(307, 1, 1783296000, 1782655200, 1782657000, 'Ăn xế chiều', 'Bánh flan', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585456, 1782617335),
(308, 1, 1783296000, 1782657000, 1782662400, 'Hoạt động kể chuyện cổ tích', 'Cô kể bé nghe', 'Lớp học', 'study', 'Chưa diễn ra', 1782585456, 1782617335),
(309, 1, 1783296000, 1782662400, 1782666000, 'Vệ sinh & Trả trẻ cho phụ huynh', 'Vệ sinh sạch sẽ', 'Cổng A', 'dropoff', 'Chưa diễn ra', 1782585456, 1782617335),
(310, 1, 1783296000, 1782896400, 1782900900, 'Giờ học chuyên đề', 'Bé tập vẽ và tô màu con cá voi', 'Phòng nghệ thuật', 'study', 'Xong', 1782900449, 1782900449),
(311, 1, 1783296000, 1782904500, 1782907200, 'Giờ ăn trưa', 'Cơm, canh sườn bí đỏ, thịt viên sốt cà', 'Phòng ăn tập thể', 'meal', 'Xong', 1782900449, 1782900449),
(312, 1, 1783296000, 1782896400, 1782900000, 'Hoạt động Góc Nghệ Thuật', 'Bé sáng tạo xé dán tranh con cá voi bằng giấy màu', 'Lớp học Mầm 1', 'study', 'Xong', 1782905152, 1782905152),
(313, 1, 1783296000, 1782914400, 1782921600, 'Giờ vận động tự do', 'Vui chơi ở nhà phao và xích đu ngoài sân trường', 'Sân chơi tòa A', 'play', 'Chưa diễn ra', 1782905152, 1782905152),
(314, 1, 1783296000, 1783063800, 1783065600, 'Đón bé & Kiểm tra y tế sáng', 'Đón tại cổng, sát khuẩn và đo thân nhiệt', 'Cổng A', 'pickup', 'Xong', 1783051801, 1783158633),
(315, 1, 1783296000, 1783065600, 1783067400, 'Thể dục buổi sáng', 'Tập bài thể dục nhịp điệu', 'Sân trường', 'study', 'Xong', 1783051801, 1783051801),
(316, 1, 1783296000, 1783067400, 1783069200, 'Ăn sáng & Vệ sinh cá nhân', 'Phở bò + Sữa tươi', 'Phòng ăn', 'meal', 'Xong', 1783051801, 1783051801),
(317, 1, 1783296000, 1783069200, 1783072800, 'Học tập chuyên đề', 'Toán học: Làm quen và tập đếm các chữ số từ 1 đến 5', 'Lớp học Mầm 1', 'study', 'Xong', 1783051801, 1783051801),
(318, 1, 1783296000, 1783072800, 1783075500, 'Vui chơi tự do', 'Chơi nhà bóng và lắp ráp xếp hình gỗ', 'Khu vui chơi', 'play', 'Xong', 1783051801, 1783051801),
(319, 1, 1783296000, 1783075500, 1783078200, 'Ăn trưa', 'Cơm tẻ, Cá basa kho tộ, Canh chua thịt băm', 'Phòng ăn', 'meal', 'Xong', 1783051801, 1783161365),
(320, 1, 1783296000, 1783078200, 1783087200, 'Giấc ngủ trưa', 'Giờ ngủ trưa của bé', 'Phòng ngủ', 'nap', 'Xong', 1783051801, 1783161363),
(321, 1, 1783296000, 1783087200, 1783089000, 'Ăn xế chiều', 'Chè đậu xanh cốt dừa', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1783051801, 1783051801),
(322, 1, 1783296000, 1783089000, 1783092600, 'Hoạt động chiều', 'Ôn tập múa hát, nghe cô kể chuyện cổ tích', 'Lớp học Mầm 1', 'study', 'Chưa diễn ra', 1783051801, 1783051801),
(323, 1, 1783296000, 1783092600, 1783096200, 'Vệ sinh & Trả trẻ', 'Cô vệ sinh cho bé, xếp đồ vào balo đợi ba mẹ đón', 'Cổng A', 'dropoff', 'Chưa diễn ra', 1783051801, 1783051801);

-- --------------------------------------------------------

--
-- Table structure for table `DevelopmentAssessments`
--

CREATE TABLE `DevelopmentAssessments` (
  `AssessmentID` int NOT NULL,
  `StudentID` int NOT NULL,
  `TermPeriod` varchar(7) NOT NULL,
  `PhysicalScore` tinyint DEFAULT NULL,
  `EmotionalScore` tinyint DEFAULT NULL,
  `SocialScore` tinyint DEFAULT NULL,
  `LanguageScore` tinyint DEFAULT NULL,
  `CognitiveScore` tinyint DEFAULT NULL,
  `OverallNote` text,
  `AssessedBy` int DEFAULT NULL,
  `CreatedAt` bigint DEFAULT NULL,
  `UpdatedAt` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `DevelopmentAssessments`
--

INSERT INTO `DevelopmentAssessments` (`AssessmentID`, `StudentID`, `TermPeriod`, `PhysicalScore`, `EmotionalScore`, `SocialScore`, `LanguageScore`, `CognitiveScore`, `OverallNote`, `AssessedBy`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 117, '2026-07', 4, 5, 4, 5, 4, 'Bé phát triển tốt, tích cực tham gia hoạt động nhóm', 5, 1783560469, 1783560469),
(2, 109, '2026-07', 3, 4, 5, 4, 3, 'Bé hoà đồng, cần cải thiện vận động tinh', 5, 1783560469, 1783560469),
(3, 107, '2026-07', 5, 4, 4, 4, 5, 'Bé năng động, học hỏi nhanh', 5, 1783560469, 1783560469),
(4, 116, '2026-07', 4, 3, 4, 4, 4, 'Bé cần chú ý hơn về kiểm soát cảm xúc', 5, 1783560469, 1783560469);

-- --------------------------------------------------------

--
-- Table structure for table `EventClasses`
--

CREATE TABLE `EventClasses` (
  `EventID` int NOT NULL,
  `ClassID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Events`
--

CREATE TABLE `Events` (
  `EventID` int NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Description` text,
  `StartTime` bigint NOT NULL,
  `EndTime` bigint NOT NULL,
  `Location` varchar(255) DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'Upcoming',
  `EventType` enum('Class','School','Holiday','Student') NOT NULL DEFAULT 'Class',
  `CreatedBy` int DEFAULT NULL,
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Events`
--

INSERT INTO `Events` (`EventID`, `Title`, `Description`, `StartTime`, `EndTime`, `Location`, `Status`, `EventType`, `CreatedBy`, `CreatedAt`) VALUES
(1, 'Lễ hội Trung Thu', 'Vui hội trăng rằm cho bé', 1785552000, 1785566400, 'Sân trường', 'Upcoming', 'School', 1, 1783559266);

-- --------------------------------------------------------

--
-- Table structure for table `EventStudents`
--

CREATE TABLE `EventStudents` (
  `EventID` int NOT NULL,
  `StudentID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Extracurriculars`
--

CREATE TABLE `Extracurriculars` (
  `ActivityID` int NOT NULL,
  `ActivityName` varchar(100) NOT NULL,
  `MonthlyFee` decimal(15,2) NOT NULL,
  `Description` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Extracurriculars`
--

INSERT INTO `Extracurriculars` (`ActivityID`, `ActivityName`, `MonthlyFee`, `Description`) VALUES
(1, 'Tiếng Anh Tăng Cường', 500000.00, 'Học với giáo viên bản ngữ'),
(2, 'Vẽ Sáng Tạo', 300000.00, 'Khám phá hội họa');

-- --------------------------------------------------------

--
-- Table structure for table `fcm_tokens`
--

CREATE TABLE `fcm_tokens` (
  `TokenID` int NOT NULL,
  `UserID` int NOT NULL,
  `DeviceToken` varchar(255) NOT NULL,
  `DeviceType` varchar(50) DEFAULT NULL,
  `CreatedAt` bigint DEFAULT NULL,
  `UpdatedAt` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `fcm_tokens`
--

INSERT INTO `fcm_tokens` (`TokenID`, `UserID`, `DeviceToken`, `DeviceType`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 6, 'cc28eRpmqSXvexnAh_w8tr:APA91bGDp2k7M_uhPfptytaTjD5d6fctyyp23mjxJz9n_5xJ7pZYdOPExhwSYuJQwBLEMkVTNcKN92uc28ehICnK98s6eq6QVUCfTO0aZR7ofacJbSRH3oU', 'web', 1782661552, 1783219675),
(4, 6, 'fjfqe9lYvVEYK63i_q1T2h:APA91bEBiGzPZmOHvDzyqR5yfoRwmcuiJGvk-YkW5jDlB1MJfpOklV4V2eARND7q2qJAu_i06RBzoQC7cVeQdb-8cLkY64P1GgoFGoOCEaHoO2N9LfnMW3Y', 'web', 1782739894, 1783431182),
(8, 5, 'dNx6fnzETaW0fsvLqoKCaZ:APA91bFxqNsWygsfV-xM49tJURpwExl5ATx0ahRfg5sUHGUi9yMMJaiMy0g0aN1rZGP87nEVzClBN6ZY4QpPC4bXWwxxa0nFXm9lCNR5UdaV20-UmrJ4pOY', 'android', 1782796885, 1783564811),
(26, 17, 'dNx6fnzETaW0fsvLqoKCaZ:APA91bFxqNsWygsfV-xM49tJURpwExl5ATx0ahRfg5sUHGUi9yMMJaiMy0g0aN1rZGP87nEVzClBN6ZY4QpPC4bXWwxxa0nFXm9lCNR5UdaV20-UmrJ4pOY', 'android', 1782870465, 1783433783),
(247, 6, 'd32sIG1Vw97mALTebrTRkg:APA91bEnMwvcPtytV7tjEYRU1N_BE5bfijqd5nfTC3dG_6aM61x7xLLaj2lXdBJrk4PNZD96LttUWZuluadjocxSDdVsRs3GYlWhP0xlvkf_ARfmT8UKg5w', 'web', 1783260054, 1783260054),
(323, 6, 'dNx6fnzETaW0fsvLqoKCaZ:APA91bFxqNsWygsfV-xM49tJURpwExl5ATx0ahRfg5sUHGUi9yMMJaiMy0g0aN1rZGP87nEVzClBN6ZY4QpPC4bXWwxxa0nFXm9lCNR5UdaV20-UmrJ4pOY', 'android', 1783527833, 1783527833),
(325, 6, 'eH9SQcNvR8GVXqRBfFcBy_:APA91bFZcIac3h9GnXzcpDqYFHbYV6_Lzu-TO85Y3euhl5txDktkGZ9dcEGsQeW3Bi4Z7DwSK_qTtT_s_VzPFPeYTdsgzcwRTUmmvHVMr4rYdbAKS3Q39tE', 'android', 1783595223, 1783595398);

-- --------------------------------------------------------

--
-- Table structure for table `Feedbacks`
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

--
-- Dumping data for table `Feedbacks`
--

INSERT INTO `Feedbacks` (`FeedbackID`, `ParentID`, `Type`, `Content`, `Rating`, `Status`, `ResponseContent`, `RespondedByID`) VALUES
(1, 4, 'Suggestion', 'Nhà trường nên lắp thêm quạt ở sân chơi', 4, 'Resolved', 'Cảm ơn phụ huynh, chúng tôi đã ghi nhận.', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Grades`
--

CREATE TABLE `Grades` (
  `GradeID` int NOT NULL,
  `GradeName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Grades`
--

INSERT INTO `Grades` (`GradeID`, `GradeName`) VALUES
(1, 'Mầm'),
(2, 'Chồi'),
(3, 'Lá');

-- --------------------------------------------------------

--
-- Table structure for table `HealthRecords`
--

CREATE TABLE `HealthRecords` (
  `RecordID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `TermPeriod` varchar(50) NOT NULL,
  `Height` decimal(5,2) DEFAULT NULL,
  `Weight` decimal(5,2) DEFAULT NULL,
  `BMI` decimal(5,2) DEFAULT NULL,
  `Notes` text COMMENT 'Ghi chú của giáo viên'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `HealthRecords`
--

INSERT INTO `HealthRecords` (`RecordID`, `StudentID`, `TermPeriod`, `Height`, `Weight`, `BMI`, `Notes`) VALUES
(1, 19, '2026-04', 130.00, 28.00, 16.60, NULL),
(2, 19, '2026-05', 131.00, 29.00, 16.90, NULL),
(3, 19, '2026-06', 132.00, 30.00, 17.20, NULL),
(4, 19, '2026-01', 127.00, 26.00, 16.10, NULL),
(5, 19, '2026-02', 128.00, 27.00, 16.50, NULL),
(6, 19, '2026-03', 129.00, 28.00, 16.80, NULL),
(9, 1, '2026-06', 120.00, 22.00, 15.28, NULL),
(10, 1, '2026-07', 115.00, 21.50, 16.26, NULL),
(11, 1, '2026-07', 116.00, 22.00, 16.35, NULL),
(12, 19, '2026-07', 132.50, 30.50, 17.30, 'Sức khỏe tốt, phát triển bình thường.'),
(13, 117, '2026-07', NULL, NULL, NULL, 'Sáng: nhiệt độ 38.2°C, uống hạ sốt. Chiều: 37.5°C.');

-- --------------------------------------------------------

--
-- Table structure for table `Holidays`
--

CREATE TABLE `Holidays` (
  `HolidayID` int NOT NULL,
  `HolidayDate` bigint NOT NULL,
  `HolidayName` varchar(100) DEFAULT NULL,
  `YearID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Holidays`
--

INSERT INTO `Holidays` (`HolidayID`, `HolidayDate`, `HolidayName`, `YearID`) VALUES
(1, 1787884800, 'Quốc khánh 2/9', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Invoices`
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
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `InvoiceType` varchar(20) DEFAULT 'MONTHLY',
  `DueDate` bigint DEFAULT NULL,
  `ReminderSentAt` bigint DEFAULT NULL,
  `OverdueReminderSentAt` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Invoices`
--

INSERT INTO `Invoices` (`InvoiceID`, `StudentID`, `PackageID`, `PeriodRange`, `BillingMonth`, `TuitionFee`, `ExpectedMealFee`, `ExtracurricularFee`, `Surcharge`, `RefundAmount`, `DiscountAmount`, `PaymentStatus`, `CreatedAt`, `InvoiceType`, `DueDate`, `ReminderSentAt`, `OverdueReminderSentAt`) VALUES
(51, 19, NULL, NULL, '07-2026', 0.00, 0.00, 500000.00, 0.00, 0.00, 0.00, 'Unpaid', 1783564680, 'EXTRACURRICULAR', 1783616400, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `LeaveRequests`
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
  `IsMealFeeDeducted` tinyint(1) DEFAULT '0',
  `ParentNotes` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `CreatedAt` bigint DEFAULT NULL,
  `UpdatedTime` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Triggers `LeaveRequests`
--
DELIMITER $$
CREATE TRIGGER `LeaveRequests_before_insert` BEFORE INSERT ON `LeaveRequests` FOR EACH ROW BEGIN
  SET NEW.UpdatedTime = UNIX_TIMESTAMP();
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `LeaveRequests_before_update` BEFORE UPDATE ON `LeaveRequests` FOR EACH ROW BEGIN
  IF NEW.Status <> OLD.Status THEN
    SET NEW.UpdatedTime = UNIX_TIMESTAMP();
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `MedicationRequests`
--

CREATE TABLE `MedicationRequests` (
  `MedRequestID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `ParentID` int DEFAULT NULL,
  `RequestDate` bigint NOT NULL,
  `ScheduledDate` bigint DEFAULT NULL COMMENT 'Ngày dự kiến cho uống (Unix timestamp)',
  `MedicineDetails` text NOT NULL,
  `Dosage` text NOT NULL,
  `Frequency` varchar(100) DEFAULT NULL,
  `TimeToTake` varchar(100) DEFAULT NULL,
  `ParentNote` text,
  `MedicineImageURL` varchar(500) DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'Pending',
  `TeacherNote` text,
  `AdministeredAt` bigint DEFAULT NULL COMMENT 'Thời điểm giáo viên xác nhận cho uống',
  `AdministeredBy` int DEFAULT NULL COMMENT 'FK -> Teachers.TeacherID, người xác nhận cho uống',
  `UpdatedTime` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `MedicationRequests`
--

INSERT INTO `MedicationRequests` (`MedRequestID`, `StudentID`, `ParentID`, `RequestDate`, `ScheduledDate`, `MedicineDetails`, `Dosage`, `Frequency`, `TimeToTake`, `ParentNote`, `MedicineImageURL`, `Status`, `TeacherNote`, `AdministeredAt`, `AdministeredBy`, `UpdatedTime`) VALUES
(1, 1, 17, 1783403271, NULL, 'jdhd', 'bsns', 'bsbs', 'bsbs', 'bshsj', NULL, 'Pending', 'string', NULL, NULL, 1783403352),
(2, 109, 4, 1783568824, 1783568824, 'Amoxicillin 250mg', '5ml', '3 lần/ngày', 'Sáng, trưa, chiều', 'Uống sau ăn 30 phút', NULL, 'Pending', NULL, NULL, NULL, 1783568824),
(3, 107, 4, 1783568824, 1783568824, 'Vitamin C 100mg', '1 viên', '1 lần/ngày', 'Sáng', 'Bổ sung vitamin mùa đông', NULL, 'Done', 'Đã cho bé uống 9h sáng', 1783568824, 5, 1783568824),
(4, 116, 4, 1783568824, 1783568824, 'Siro ho Prospan', '5ml', '2 lần/ngày', 'Sáng, tối', 'Bé ho nhiều về đêm', NULL, 'Pending', NULL, NULL, NULL, 1783568824),
(5, 1, 4, 1783568824, 1783568824, 'Ibuprofen 100mg', '5ml', 'Khi sốt >38.5', 'Bất kỳ', 'Sốt về chiều', NULL, 'Skipped', 'Bé không sốt trong ngày', NULL, NULL, 1783568824),
(6, 119, 4, 1783565224, 1783565224, 'Cetirizine 5mg', '1 viên', '1 lần/ngày', 'Tối', 'Bé dị ứng thời tiết', NULL, 'Pending', NULL, NULL, NULL, 1783568824),
(7, 117, 4, 1783560469, 1783560469, 'Paracetamol 250mg', '1 gói', '2 lần/ngày', 'Sáng, chiều', 'Bé sốt 38.5 độ từ sáng nay', NULL, 'Pending', 'string', NULL, NULL, 1783560469),
(8, 109, 4, 1783560469, 1783560469, 'Amoxicillin 250mg', '5ml', '3 lần/ngày', 'Sáng, trưa, chiều', 'Uống sau ăn 30 phút', NULL, 'Pending', NULL, NULL, NULL, 1783560469),
(9, 107, 4, 1783560469, 1783560469, 'Vitamin C 100mg', '1 viên', '1 lần/ngày', 'Sáng', 'Bổ sung vitamin mùa đông', NULL, 'Done', 'Đã cho bé uống 9h sáng', 1783560469, 5, 1783560469),
(10, 116, 4, 1783560469, 1783560469, 'Siro ho Prospan', '5ml', '2 lần/ngày', 'Sáng, tối', 'Bé ho nhiều về đêm', NULL, 'Pending', NULL, NULL, NULL, 1783560469),
(11, 1, 4, 1783560469, 1783560469, 'Ibuprofen 100mg', '5ml', 'Khi sốt >38.5', 'Bất kỳ', 'Sốt về chiều', NULL, 'Skipped', 'Bé không sốt trong ngày', NULL, NULL, 1783560469),
(12, 119, 4, 1783556869, 1783556869, 'Cetirizine 5mg', '1 viên', '1 lần/ngày', 'Tối', 'Bé dị ứng thời tiết', NULL, 'Pending', NULL, NULL, NULL, 1783560469),
(13, 118, 4, 1783553269, 1783553269, 'Berberin', '2 viên', '2 lần/ngày', 'Sáng, tối', 'Bé bị tiêu chảy nhẹ', NULL, 'Pending', NULL, NULL, NULL, 1783560469),
(14, 19, 6, 1783560518, NULL, 'sg bac', '2', '2', 'Sau ăn trưa', NULL, NULL, 'Pending', NULL, NULL, NULL, 1783560567),
(15, 19, 6, 1783562386, NULL, 'gg', 'gg', 'gg', 'Sau ăn trưa', 'gg', NULL, 'Completed', NULL, NULL, NULL, 1783565667);

--
-- Triggers `MedicationRequests`
--
DELIMITER $$
CREATE TRIGGER `MedicationRequests_before_insert` BEFORE INSERT ON `MedicationRequests` FOR EACH ROW BEGIN
  SET NEW.UpdatedTime = UNIX_TIMESTAMP();
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `MedicationRequests_before_update` BEFORE UPDATE ON `MedicationRequests` FOR EACH ROW BEGIN
  IF NEW.Status <> OLD.Status THEN
    SET NEW.UpdatedTime = UNIX_TIMESTAMP();
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `MenuDetails`
--

CREATE TABLE `MenuDetails` (
  `MenuDetailID` int NOT NULL,
  `MenuID` int NOT NULL,
  `DayOfWeek` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `MealType` enum('Breakfast','Lunch','Snack') NOT NULL,
  `DishName` text NOT NULL,
  `Calories` int DEFAULT NULL,
  `NutritionalDetails` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `MenuDetails`
--

INSERT INTO `MenuDetails` (`MenuDetailID`, `MenuID`, `DayOfWeek`, `MealType`, `DishName`, `Calories`, `NutritionalDetails`) VALUES
(1, 1, 'Monday', 'Breakfast', 'Súp cua trứng cút', 250, 'Giàu canxi và protein. Đảm bảo không sử dụng dầu đậu phộng.'),
(2, 1, 'Monday', 'Lunch', 'Cơm tẻ, Cá hồi áp chảo sốt cam, Canh rau ngót nấu thịt băm', 450, 'Giàu Omega-3 và Vitamin C. Cá hồi áp chảo bằng dầu oliu (Không lạc).'),
(3, 1, 'Monday', 'Snack', 'Bánh flan sữa tươi', 150, 'Bổ sung canxi. Không dùng các loại hạt rắc kèm.'),
(4, 1, 'Tuesday', 'Breakfast', 'Phở bò bằm (nước dùng hầm xương)', 300, 'Nhiều sắt và kẽm. Ăn kèm hành ngò, không quẩy.'),
(5, 1, 'Tuesday', 'Lunch', 'Cơm tẻ, Thịt gà xíu mại, Canh bí đỏ sườn non', 480, 'Giàu Vitamin A giúp sáng mắt. Xíu mại hấp mềm.'),
(6, 1, 'Tuesday', 'Snack', 'Sữa chua trái cây trộn (Xoài, Dưa hấu)', 120, 'Bổ sung lợi khuẩn tiêu hóa và Vitamin tự nhiên.'),
(7, 1, 'Wednesday', 'Breakfast', 'Cháo yến mạch thịt thăn', 220, 'Giàu chất xơ tốt cho hệ tiêu hóa của bé.'),
(8, 1, 'Wednesday', 'Lunch', 'Cơm tẻ, Tôm thịt xào măng tây, Canh chua cá lăng', 460, 'Măng tây nhiều acid folic. Tuyệt đối không rắc đậu phộng rang lên món xào.'),
(9, 1, 'Wednesday', 'Snack', 'Chè đậu xanh hạt sen (nước cốt dừa)', 180, 'Thanh nhiệt, giúp bé ngủ ngon. Không rắc đậu phộng đâm nhuyễn.'),
(10, 1, 'Thursday', 'Breakfast', 'Bánh cuốn nhân thịt mộc nhĩ', 280, 'Cung cấp tinh bột năng lượng. Chỉ dùng hành phi tự làm bằng dầu thực vật an toàn (Không lạc).'),
(11, 1, 'Thursday', 'Lunch', 'Cơm tẻ, Bò lúc lắc khoai tây, Canh cải bẹ xanh cá thác lác', 490, 'Giàu sắt và đạm. Khoai tây chiên xốp mềm vừa ăn.'),
(12, 1, 'Thursday', 'Snack', 'Bánh bông lan trứng muối (ổ nhỏ)', 160, 'Cung cấp năng lượng nhẹ buổi xế.'),
(13, 1, 'Friday', 'Breakfast', 'Nui sườn heo rau củ', 270, 'Nước dùng thanh ngọt từ củ cải và cà rốt.'),
(14, 1, 'Friday', 'Lunch', 'Cơm tẻ, Trứng đúc thịt nấm hương, Canh mướp mồng tơi cua đồng', 440, 'Mát gan, nhiều canxi từ cua đồng. Trứng đúc mềm không bị khô.'),
(15, 1, 'Friday', 'Snack', 'Sữa hạt sen macca', 140, 'Sữa hạt dinh dưỡng (Đã kiểm tra an toàn, không chứa thành phần đậu phộng).'),
(16, 2, 'Monday', 'Breakfast', 'Phở gà ta', 300, 'Giàu đạm, thêm hành lá giúp bé giải cảm. Nước dùng hầm xương ngọt thanh.'),
(17, 2, 'Monday', 'Lunch', 'Cơm tẻ, Cá basa kho tộ, Canh chua tôm thịt', 450, 'Bổ sung vitamin C từ dứa và cà chua, tăng đề kháng tự nhiên.'),
(18, 2, 'Monday', 'Snack', 'Nước cam ép, Bánh su kem', 180, 'Tăng cường vitamin C tự nhiên giúp hấp thụ sắt tốt hơn.'),
(22, 2, 'Wednesday', 'Breakfast', 'Cháo chim bồ câu hạt sen', 250, 'Món ăn bồi bổ sức khỏe, hạt sen giúp bé ngủ sâu giấc buổi trưa.'),
(23, 2, 'Wednesday', 'Lunch', 'Cơm tẻ, Trứng đúc nấm hương, Canh bí đao sườn non', 460, 'Dễ tiêu hóa, thanh mát cơ thể trong ngày hè.'),
(24, 2, 'Wednesday', 'Snack', 'Chè đậu đỏ cốt dừa', 160, 'Thanh nhiệt, cung cấp năng lượng và chất chống oxy hóa (Không dùng đậu phộng).'),
(25, 2, 'Thursday', 'Breakfast', 'Nui xào bò băm rau củ', 320, 'Cung cấp tinh bột và protein, cà rốt chứa vitamin A giúp sáng mắt.'),
(26, 2, 'Thursday', 'Lunch', 'Cơm tẻ, Tôm rim thịt ba chỉ, Canh cua đồng mồng tơi', 470, 'Nguồn canxi tự nhiên dồi dào từ cua, rau mồng tơi nhuận tràng.'),
(27, 2, 'Thursday', 'Snack', 'Sữa hạt óc chó hạnh nhân', 140, 'Chứa nhiều Omega-3 rất tốt cho sự phát triển não bộ của trẻ.'),
(28, 2, 'Friday', 'Breakfast', 'Súp cua nấm tuyết', 240, 'Dễ tiêu hóa, thơm ngon, nấm tuyết hỗ trợ rất tốt cho hệ hô hấp.'),
(29, 2, 'Friday', 'Lunch', 'Cơm tẻ, Gà rim nước mắm tỏi, Canh chua cá hồi', 490, 'Bổ sung Omega-3 tăng cường miễn dịch. Tỏi có tính kháng sinh tự nhiên.'),
(30, 2, 'Friday', 'Snack', 'Trái cây theo mùa (Ổi, Dưa hấu, Xoài)', 120, 'Cung cấp lượng lớn Vitamin C và chất xơ tự nhiên, không chứa đường hóa học.'),
(31, 2, 'Tuesday', 'Breakfast', 'bánh mì pate', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Menus`
--

CREATE TABLE `Menus` (
  `MenuID` int NOT NULL,
  `ClassID` int NOT NULL,
  `WeekNumber` int NOT NULL,
  `Year` int NOT NULL,
  `MenuName` varchar(100) DEFAULT NULL,
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Menus`
--

INSERT INTO `Menus` (`MenuID`, `ClassID`, `WeekNumber`, `Year`, `MenuName`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, 27, 2026, 'Thực đơn tuần 27 - Năng lượng ngày hè', 1783296000, 1783050741),
(2, 1, 28, 2026, 'Thực đơn tuần 28 - Đề kháng khỏe mạnh', 1783296000, 1783050741),
(3, 1, 29, 2026, 'Thực đơn tuần 29 - Vitamin rực rỡ', 1783296000, 1783050741),
(4, 1, 30, 2026, 'Thực đơn tuần 30 - Sức sống xanh', 1783296000, 1783050741);

-- --------------------------------------------------------

--
-- Table structure for table `MonthlySchedules`
--

CREATE TABLE `MonthlySchedules` (
  `MonthlyScheduleID` int NOT NULL,
  `ClassID` int NOT NULL,
  `Month` int NOT NULL,
  `Year` int NOT NULL,
  `MonthTheme` varchar(255) NOT NULL,
  `ApprovedStatus` tinyint DEFAULT '0',
  `IsActive` tinyint(1) DEFAULT '0',
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `MonthlySchedules`
--

INSERT INTO `MonthlySchedules` (`MonthlyScheduleID`, `ClassID`, `Month`, `Year`, `MonthTheme`, `ApprovedStatus`, `IsActive`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, 7, 2026, 'Đà lạt mộng mơ', 1, 1, 1783012593, 1783565772);

-- --------------------------------------------------------

--
-- Table structure for table `Newsfeeds`
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
-- Table structure for table `NewsfeedTags`
--

CREATE TABLE `NewsfeedTags` (
  `PostID` int NOT NULL,
  `StudentID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Notifications`
--

CREATE TABLE `Notifications` (
  `NotifID` int NOT NULL,
  `UserID` int DEFAULT NULL,
  `Title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Message` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Type` varchar(50) DEFAULT 'GENERAL',
  `IsRead` tinyint(1) NOT NULL DEFAULT '0',
  `IsCritical` tinyint(1) NOT NULL DEFAULT '0',
  `DataPayload` json DEFAULT NULL,
  `CreatedAt` bigint DEFAULT NULL,
  `UpdatedAt` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Notifications`
--

INSERT INTO `Notifications` (`NotifID`, `UserID`, `Title`, `Message`, `Type`, `IsRead`, `IsCritical`, `DataPayload`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"103\", \"studentId\": \"19\"}', 1782667136, 1782824463),
(10, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"108\", \"studentId\": \"19\"}', 1782828777, 1782831318),
(11, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"109\", \"studentId\": \"19\"}', 1782831136, 1782831318),
(14, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 1, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"19\", \"medRequestId\": \"12\"}', 1782831312, 1782831318),
(15, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"110\", \"studentId\": \"19\"}', 1782831716, 1782831733),
(17, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 1, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"19\", \"medRequestId\": \"13\"}', 1782831830, 1782831851),
(18, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"111\", \"studentId\": \"19\"}', 1782831934, 1782832134),
(22, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"112\", \"studentId\": \"19\"}', 1782833131, 1782833138),
(23, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 1, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"19\", \"medRequestId\": \"14\"}', 1782833386, 1782833398),
(26, 4, 'Cập nhật Dặn dò y tế', 'Giáo viên đã cập nhật trạng thái dặn dò y tế của bé Vũ Trường Giang thành: Completed. Ghi chú: ', 'MEDICAL_REQUEST', 0, 0, '{\"type\": \"MEDICAL_REQUEST\", \"requestId\": \"1\"}', 1782833924, 1782833924),
(34, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"113\", \"studentId\": \"19\"}', 1782839718, 1782839718),
(36, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"3\"}', 1782840550, 1782840550),
(39, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"4\"}', 1782841220, 1782841220),
(42, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"5\"}', 1782841452, 1782841452),
(45, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"6\"}', 1782841817, 1782841817),
(48, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"114\", \"studentId\": \"1\"}', 1782871160, 1782871160),
(51, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"115\", \"studentId\": \"1\"}', 1782871209, 1782871209),
(52, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"116\", \"studentId\": \"1\"}', 1782871261, 1782871261),
(54, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"15\"}', 1782874398, 1782874398),
(56, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"16\"}', 1782875284, 1782875284),
(58, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"7\"}', 1782898300, 1782898300),
(62, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"8\"}', 1782898697, 1782898697),
(68, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"19\"}', 1782901725, 1782901725),
(69, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"118\", \"studentId\": \"1\"}', 1782901982, 1782916776),
(72, 4, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"118\"}', 1782906339, 1782906339),
(74, 4, 'Cập nhật Dặn dò y tế', 'Giáo viên đã cập nhật trạng thái dặn dò y tế của bé Nguyễn Minh Khang thành: Completed. Ghi chú: ', 'MEDICAL_REQUEST', 0, 0, '{\"type\": \"MEDICAL_REQUEST\", \"requestId\": \"18\"}', 1782916612, 1782916612),
(76, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"9\"}', 1782916698, 1782916698),
(80, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"119\", \"studentId\": \"19\"}', 1782916925, 1782916932),
(82, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"10\"}', 1782917544, 1782917544),
(88, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"120\", \"studentId\": \"19\"}', 1782923845, 1782923845),
(91, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"11\"}', 1782923949, 1782923949),
(96, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"121\", \"studentId\": \"1\"}', 1782984794, 1782984794),
(98, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"122\", \"studentId\": \"19\"}', 1782997975, 1782997975),
(101, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"123\", \"studentId\": \"19\"}', 1782998118, 1782998118),
(105, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"124\", \"studentId\": \"19\"}', 1782998152, 1782998250),
(107, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"125\", \"studentId\": \"19\"}', 1782998244, 1782998244),
(110, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"126\", \"studentId\": \"19\"}', 1782998973, 1783011906),
(113, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"127\", \"studentId\": \"19\"}', 1783000568, 1783011537),
(117, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"128\", \"studentId\": \"19\"}', 1783002330, 1783011532),
(121, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"129\", \"studentId\": \"19\"}', 1783011850, 1783014901),
(125, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"130\", \"studentId\": \"1\"}', 1783059927, 1783059927),
(126, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"131\", \"studentId\": \"19\"}', 1783073243, 1783089429),
(130, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"12\"}', 1783088034, 1783088034),
(131, 17, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 1, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"12\"}', 1783088034, 1783170893),
(134, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"13\"}', 1783088112, 1783088112),
(135, 17, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 1, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"13\"}', 1783088112, 1783170892),
(138, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"14\"}', 1783088173, 1783088173),
(139, 17, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 1, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"14\"}', 1783088173, 1783170890),
(142, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"15\"}', 1783109837, 1783109837),
(143, 17, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 1, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"15\"}', 1783109837, 1783217021),
(146, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"132\", \"studentId\": \"19\"}', 1783140463, 1783140463),
(148, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"133\", \"studentId\": \"19\"}', 1783140819, 1783140819),
(151, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"134\", \"studentId\": \"19\"}', 1783140860, 1783140860),
(152, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"135\", \"studentId\": \"19\"}', 1783141147, 1783141147),
(159, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"20\"}', 1783168193, 1783168193),
(161, 4, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"130\"}', 1783169135, 1783169135),
(163, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"21\"}', 1783184873, 1783184873),
(165, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"16\"}', 1783188750, 1783188750),
(166, 17, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 1, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"16\"}', 1783188750, 1783217409),
(169, 4, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"121\"}', 1783194913, 1783194913),
(171, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"17\"}', 1783218334, 1783218334),
(175, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"22\"}', 1783234129, 1783234129),
(177, 4, 'Thông báo Điểm danh', 'Bé Bùi Minh Quang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783123200\", \"type\": \"ATTENDANCE\"}', 1783245694, 1783245694),
(178, 4, 'Thông báo Điểm danh', 'Bé Bùi Minh Quang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783123200\", \"type\": \"ATTENDANCE\"}', 1783246172, 1783246172),
(180, 4, 'Thông báo Điểm danh', 'Bé Bùi Minh Quang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783123200\", \"type\": \"ATTENDANCE\"}', 1783246173, 1783246173),
(182, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"1\", \"studentId\": \"19\"}', 1783264282, 1783264282),
(185, 18, 'Bé đã đến trường', 'Bé Nguyễn Minh Chánh đã điểm danh vào lúc 00:19.', 'CHECKIN', 0, 0, '{\"type\": \"CHECKIN\", \"studentId\": \"19\"}', 1783271964, 1783271964),
(187, 18, 'Bé đã được đón về', 'Bé Nguyễn Minh Chánh đã được đón về lúc 20:25.', 'CHECKOUT', 0, 0, '{\"type\": \"CHECKOUT\", \"studentId\": \"19\"}', 1783344334, 1783344334),
(189, 18, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Chánh đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"1\"}', 1783344654, 1783344654),
(191, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"2\", \"studentId\": \"19\"}', 1783346264, 1783346264),
(193, 18, 'Sắp đến hạn đóng học phí', 'Hóa đơn tháng 07-2026 của học sinh ID 19 (400.000đ) sắp đến hạn đóng. Vui lòng thanh toán sớm.', 'INVOICE_REMINDER', 0, 0, '{\"kind\": \"upcoming\", \"type\": \"INVOICE_REMINDER\", \"invoiceId\": \"50\", \"studentId\": \"19\"}', 1783386000, 1783386000),
(194, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"1\"}', 1783403352, 1783403352),
(196, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"3\", \"studentId\": \"1\"}', 1783403399, 1783403399),
(199, 4, 'Thông báo Điểm danh', 'Bé Bùi Minh Quang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(200, 4, 'Thông báo Điểm danh', 'Bé Đặng Anh Khoa vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(201, 4, 'Thông báo Điểm danh', 'Bé Đặng Quang Minh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(202, 4, 'Thông báo Điểm danh', 'Bé Đỗ Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(205, 4, 'Thông báo Điểm danh', 'Bé Lê Hải Đăng vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(208, 4, 'Thông báo Điểm danh', 'Bé Bùi Minh Quang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(209, 4, 'Thông báo Điểm danh', 'Bé Đặng Anh Khoa vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(210, 4, 'Thông báo Điểm danh', 'Bé Đặng Quang Minh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(212, 4, 'Thông báo Điểm danh', 'Bé Đỗ Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(214, 4, 'Thông báo Điểm danh', 'Bé Lê Hải Đăng vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(218, 4, 'Thông báo Điểm danh', 'Bé Ngô Gia Khiêm vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(219, 4, 'Thông báo Điểm danh', 'Bé Nguyễn Gia Bảo vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(221, 4, 'Thông báo Điểm danh', 'Bé Ngô Gia Khiêm vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(222, 4, 'Thông báo Điểm danh', 'Bé Nguyễn Gia Bảo vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(223, 18, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Chánh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(225, 4, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(226, 17, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(228, 18, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Chánh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(229, 4, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(230, 17, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(233, 4, 'Thông báo Điểm danh', 'Bé Phan Anh Tuấn vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(236, 4, 'Thông báo Điểm danh', 'Bé Phan Anh Tuấn vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430447, 1783430447),
(240, 4, 'Thông báo Điểm danh', 'Bé Vũ Hoàng Long vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430448, 1783430448),
(241, 4, 'Thông báo Điểm danh', 'Bé Vũ Trường Giang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430448, 1783430448),
(242, 4, 'Thông báo Điểm danh', 'Bé Vũ Hoàng Long vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430453, 1783430453),
(243, 4, 'Thông báo Điểm danh', 'Bé Vũ Trường Giang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430453, 1783430453),
(244, 4, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"3\"}', 1783430495, 1783430495),
(245, 17, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"3\"}', 1783430495, 1783434126),
(247, 18, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Chánh đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"2\"}', 1783431122, 1783431122),
(248, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"4\", \"studentId\": \"1\"}', 1783433378, 1783433378),
(250, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"5\", \"studentId\": \"1\"}', 1783433667, 1783433667),
(252, 4, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"5\"}', 1783433764, 1783433764),
(253, 17, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"5\"}', 1783433764, 1783433922),
(254, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"19\", \"medRequestId\": \"14\"}', 1783560567, 1783560567),
(255, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"19\", \"medRequestId\": \"15\"}', 1783562435, 1783562435),
(256, 4, 'Cập nhật Dặn dò y tế', 'Giáo viên đã cập nhật trạng thái dặn dò y tế của bé Nguyễn Minh Khang thành: Pending. Ghi chú: string', 'MEDICAL_REQUEST', 0, 0, '{\"type\": \"MEDICAL_REQUEST\", \"requestId\": \"1\"}', 1783563150, 1783563150),
(257, 17, 'Cập nhật Dặn dò y tế', 'Giáo viên đã cập nhật trạng thái dặn dò y tế của bé Nguyễn Minh Khang thành: Pending. Ghi chú: string', 'MEDICAL_REQUEST', 0, 0, '{\"type\": \"MEDICAL_REQUEST\", \"requestId\": \"1\"}', 1783563150, 1783563150),
(258, 4, 'Cập nhật Dặn dò y tế', 'Giáo viên đã cập nhật trạng thái dặn dò y tế của bé Nguyễn Minh Khang thành: Pending. Ghi chú: string', 'MEDICAL_REQUEST', 0, 0, '{\"type\": \"MEDICAL_REQUEST\", \"requestId\": \"01\"}', 1783563170, 1783563170),
(259, 17, 'Cập nhật Dặn dò y tế', 'Giáo viên đã cập nhật trạng thái dặn dò y tế của bé Nguyễn Minh Khang thành: Pending. Ghi chú: string', 'MEDICAL_REQUEST', 0, 0, '{\"type\": \"MEDICAL_REQUEST\", \"requestId\": \"01\"}', 1783563170, 1783563170),
(262, 18, 'Cập nhật Dặn dò y tế', 'Giáo viên đã cập nhật trạng thái dặn dò y tế của bé Nguyễn Minh Chánh thành: Completed. Ghi chú: ', 'MEDICAL_REQUEST', 0, 0, '{\"type\": \"MEDICAL_REQUEST\", \"requestId\": \"15\"}', 1783565668, 1783565668);

-- --------------------------------------------------------

--
-- Table structure for table `NotificationSettings`
--

CREATE TABLE `NotificationSettings` (
  `UserID` int NOT NULL,
  `EmailEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `PushEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `WeeklyReportEnabled` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `NotificationSettings`
--

INSERT INTO `NotificationSettings` (`UserID`, `EmailEnabled`, `PushEnabled`, `WeeklyReportEnabled`) VALUES
(5, 1, 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `Parents`
--

CREATE TABLE `Parents` (
  `ParentID` int NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `DateOfBirth` bigint DEFAULT NULL,
  `PhoneNumber` varchar(20) NOT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `IDCard` varchar(20) DEFAULT NULL,
  `Job` varchar(100) DEFAULT NULL,
  `Address` text,
  `AvatarURL` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Parents`
--

INSERT INTO `Parents` (`ParentID`, `FullName`, `DateOfBirth`, `PhoneNumber`, `Email`, `IDCard`, `Job`, `Address`, `AvatarURL`) VALUES
(4, 'Nguyễn Anh Tuấn', NULL, '0911111111', 'tuan.nguyen@gmail.com', NULL, 'Kỹ sư', '65 Huỳnh Thúc Kháng, Q1', NULL),
(6, 'Cristiano Penaldo', 1118880000, '086655189', 'hocong.danh16@gmail.com', '07020002832', 'Vấp cỏ', 'Portugal', 'https://media.kindercare.app/parents/parents-profile-avatar/1783137802637-818712169.jpg'),
(17, 'Lê Minh Tuấn', NULL, '09887795', 'minhtuan.le@gmail.com', '079088001234', 'Kiến', '102 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'https://media.kindercare.app/parents/parents-profile-avatar/1783101456872-56629479.jpg'),
(18, 'Pessi', NULL, '012345678', 'pessi@gmail.com', '2131231', 'Đi bộ', 'Argentina', 'https://media.kindercare.app/parents/parents-profile-avatar/images.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `PaymentPackages`
--

CREATE TABLE `PaymentPackages` (
  `PackageID` int NOT NULL,
  `PackageName` varchar(50) NOT NULL,
  `DurationInMonths` int NOT NULL,
  `DiscountPercentage` decimal(5,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `PaymentPackages`
--

INSERT INTO `PaymentPackages` (`PackageID`, `PackageName`, `DurationInMonths`, `DiscountPercentage`) VALUES
(1, 'Gói Tháng', 1, 0.00),
(2, 'Gói Học Kỳ', 6, 5.00),
(3, 'Gói Cả Năm', 12, 10.00);

-- --------------------------------------------------------

--
-- Table structure for table `Principals`
--

CREATE TABLE `Principals` (
  `PrincipalID` int NOT NULL,
  `FullName` varchar(100) NOT NULL,
  `PhoneNumber` varchar(20) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Principals`
--

INSERT INTO `Principals` (`PrincipalID`, `FullName`, `PhoneNumber`, `Email`) VALUES
(16, 'Hồ Công Danh', '0866551849', 'hocong.danh16@gmail.com');

-- --------------------------------------------------------

--
-- Table structure for table `ProxyAuthorizations`
--

CREATE TABLE `ProxyAuthorizations` (
  `AuthorizationID` int NOT NULL,
  `StudentID` int NOT NULL,
  `ParentID` int NOT NULL,
  `AuthorizationDate` bigint NOT NULL,
  `Type` varchar(20) NOT NULL,
  `ProxyName` varchar(100) NOT NULL,
  `ProxyPhone` varchar(20) DEFAULT NULL,
  `ProxyIDCard` varchar(50) DEFAULT NULL,
  `ProxyPhotoURL` varchar(255) DEFAULT NULL,
  `Notes` text,
  `Status` varchar(20) DEFAULT 'Pending',
  `CreatedAt` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `RewardBadges`
--

CREATE TABLE `RewardBadges` (
  `BadgeID` int NOT NULL,
  `BadgeName` varchar(100) NOT NULL,
  `BadgeImageURL` varchar(255) DEFAULT NULL,
  `CriteriaType` enum('WEEKLY','MONTHLY','SPECIAL') NOT NULL DEFAULT 'WEEKLY'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `RewardBadges`
--

INSERT INTO `RewardBadges` (`BadgeID`, `BadgeName`, `BadgeImageURL`, `CriteriaType`) VALUES
(1, 'Bé Ngoan Cuối Tuần', 'https://cdn-icons-png.flaticon.com/512/3237/3237155.png', 'WEEKLY'),
(2, 'Bé Ăn Ngoan', 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', 'WEEKLY'),
(3, 'Bé Ngủ Ngoan', 'https://cdn-icons-png.flaticon.com/512/3094/3094836.png', 'WEEKLY');

-- --------------------------------------------------------

--
-- Table structure for table `Roles`
--

CREATE TABLE `Roles` (
  `RoleID` int NOT NULL,
  `RoleName` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Roles`
--

INSERT INTO `Roles` (`RoleID`, `RoleName`) VALUES
(1, 'IT Admin'),
(2, 'Principal'),
(3, 'Teacher'),
(4, 'Parent'),
(5, 'Guest');

-- --------------------------------------------------------

--
-- Table structure for table `StudentAssessments`
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

--
-- Dumping data for table `StudentAssessments`
--

INSERT INTO `StudentAssessments` (`AssessmentID`, `StudentID`, `AssessmentMonth`, `PhysicalScore`, `CognitiveScore`, `LanguageScore`, `SocioEmotionalScore`, `AestheticScore`, `TeacherComment`, `CreatedAt`) VALUES
(7, 19, '01-2025', 7, 7, 6, 7, 7, 'Bé bắt đầu quen nề nếp lớp, còn hơi nhút nhát khi giao tiếp.', 1738281600),
(8, 19, '02-2025', 7, 7, 7, 7, 8, 'Bé thích nghe cô kể chuyện, biết gọi tên các màu cơ bản.', 1740787200),
(9, 19, '03-2025', 8, 7, 7, 8, 7, 'Thể chất tiến bộ, bé chạy nhảy vững và ít bị ngã hơn.', 1743465600),
(10, 19, '04-2025', 8, 8, 7, 7, 8, 'Bé nhận biết được các hình khối đơn giản: tròn, vuông.', 1746057600),
(11, 19, '05-2025', 8, 8, 8, 8, 8, 'Ngoan ngoãn, biết chào hỏi lễ phép khi có phụ huynh đón.', 1748649600),
(12, 19, '06-2025', 8, 8, 8, 8, 9, 'Năng khiếu thẩm mỹ tốt, bé tô màu không bị lem ra ngoài.', 1751241600),
(13, 19, '09-2025', 8, 8, 8, 8, 8, 'Nghỉ hè xong vào lớp cởi mở, thích chơi xếp hình cùng bạn.', 1759190400),
(14, 19, '10-2025', 8, 9, 8, 8, 9, 'Tư duy logic tốt, hoàn thành nhanh bài tập phân loại tranh.', 1761868800),
(15, 19, '11-2025', 8, 8, 9, 9, 8, 'Khả năng ngôn ngữ phát triển rõ rệt, kể được câu chuyện ngắn.', 1764460800),
(16, 19, '12-2025', 9, 9, 9, 8, 9, 'Tổng kết cuối năm đạt danh hiệu bé ngoan xuất sắc của lớp.', 1767139200),
(17, 19, '01-2026', 8, 8, 8, 9, 9, 'Bé An (Chánh) hòa nhập nhanh với chủ đề học tập đầu năm.', 1769817600),
(18, 19, '02-2026', 8, 9, 8, 9, 9, 'Bé rất sáng tạo, thích đặt câu hỏi thảo luận với cô giáo.', 1772236800),
(19, 19, '03-2026', 9, 8, 9, 9, 9, 'Phát âm tiếng Anh trôi chảy các từ vựng động vật đơn giản.', 1774915200),
(20, 19, '04-2026', 8, 9, 8, 9, 10, 'Đặc biệt xuất sắc ở môn tạo hình vẽ và xé dán tranh.', 1777516800),
(21, 19, '05-2026', 8, 9, 9, 9, 9, 'Bé biết tự giác giúp cô chia đồ chơi và giáo cụ cho bạn.', 1780195200),
(22, 19, '06-2026', 8, 9, 8, 9, 10, 'Bé chăm chỉ, có khả năng ngôn ngữ tốt, hòa đồng với bạn bè.', 1783004269),
(23, 19, '07-2026', 9, 8, 9, 8, 9, 'Bé năng động, sáng tạo trong các hoạt động mỹ thuật ngày hè.', 1783004269),
(24, 19, '08-2026', 8, 8, 9, 9, 10, 'Bé tiến bộ rõ rệt về kỹ năng xã hội và thẩm mỹ cuối khóa.', 1783004269),
(25, 19, '09-2026', 9, 9, 9, 9, 9, 'Bước vào chủ đề mới rất tự tin, thể chất nhanh nhẹn.', 1788134400),
(26, 19, '10-2026', 9, 9, 9, 10, 10, 'Đạt điểm tối đa về tương tác xã hội, biết chia sẻ với bạn.', 1790726400);

-- --------------------------------------------------------

--
-- Table structure for table `StudentBadges`
--

CREATE TABLE `StudentBadges` (
  `StudentBadgeID` int NOT NULL,
  `StudentID` int NOT NULL,
  `BadgeID` int NOT NULL,
  `DateEarned` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `StudentBadges`
--

INSERT INTO `StudentBadges` (`StudentBadgeID`, `StudentID`, `BadgeID`, `DateEarned`) VALUES
(1, 19, 1, '2026-07-09 01:08:19'),
(2, 19, 2, '2026-07-09 01:08:19');

-- --------------------------------------------------------

--
-- Table structure for table `StudentExtracurriculars`
--

CREATE TABLE `StudentExtracurriculars` (
  `EnrollmentID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `ActivityID` int DEFAULT NULL,
  `RegisteredMonth` varchar(10) NOT NULL,
  `Status` varchar(20) DEFAULT 'Active',
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `InvoiceID` int DEFAULT NULL,
  `ActivatedAt` bigint DEFAULT NULL,
  `FeeRefunded` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `StudentExtracurriculars`
--

INSERT INTO `StudentExtracurriculars` (`EnrollmentID`, `StudentID`, `ActivityID`, `RegisteredMonth`, `Status`, `CreatedAt`, `InvoiceID`, `ActivatedAt`, `FeeRefunded`) VALUES
(11, 19, 1, '07-2026', 'Pending', 1783564680, 51, NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `StudentParents`
--

CREATE TABLE `StudentParents` (
  `StudentID` int NOT NULL,
  `ParentID` int NOT NULL,
  `Relationship` varchar(50) NOT NULL,
  `IsPrimary` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `StudentParents`
--

INSERT INTO `StudentParents` (`StudentID`, `ParentID`, `Relationship`, `IsPrimary`) VALUES
(1, 4, 'Ba', 1),
(1, 17, 'Ba', 0),
(19, 6, 'Ba', 1),
(19, 18, 'Mẹ', 0),
(105, 4, 'Ba', 1),
(106, 6, 'Ba', 1),
(107, 4, 'Ba', 1),
(108, 6, 'Ba', 1),
(109, 4, 'Ba', 1),
(110, 4, 'Ba', 1),
(111, 6, 'Mẹ', 1),
(112, 4, 'Ba', 1),
(113, 6, 'Mẹ', 1),
(114, 4, 'Ba', 1),
(115, 6, 'Mẹ', 1),
(116, 4, 'Ba', 1),
(117, 6, 'Mẹ', 1),
(118, 4, 'Ba', 1),
(119, 6, 'Mẹ', 1),
(120, 4, 'Ba', 1),
(121, 6, 'Mẹ', 1),
(122, 4, 'Ba', 1);

-- --------------------------------------------------------

--
-- Table structure for table `Students`
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
-- Dumping data for table `Students`
--

INSERT INTO `Students` (`StudentID`, `FullName`, `DateOfBirth`, `Gender`, `Allergies`, `AdmissionDate`, `EnrollmentStatus`, `AvatarURL`, `ClassID`) VALUES
(1, 'Nguyễn Minh Khang', 1684108800, 'Nam', 'Dị ứng lạc', NULL, 'Active', NULL, 1),
(19, 'Nguyễn Minh Chánh', 1464739200, 'Nam', 'Sài gòn bạc', 1781082000, 'Active', 'https://media.kindercare.app/parents/student-profile-avatar/Student_NMC.jpg', 1),
(105, 'Vũ Trường Giang', 1675987200, 'Nam', 'Không', NULL, 'Active', NULL, 1),
(106, 'Phạm Tường Vy', 1681516800, 'Nữ', 'Không', NULL, 'Active', NULL, 1),
(107, 'Đặng Anh Khoa', 1687219200, 'Nam', 'Không', NULL, 'Active', NULL, 1),
(108, 'Lý Nhã Phương', 1692921600, 'Nữ', 'Dị ứng hải sản', NULL, 'Active', NULL, 1),
(109, 'Bùi Minh Quang', 1698624000, 'Nam', 'Không', NULL, 'Active', NULL, 1),
(110, 'Nguyễn Gia Bảo', 1684108800, 'Nam', 'Không', 1781082000, 'Active', NULL, 1),
(111, 'Trần Minh Anh', 1684108800, 'Nữ', 'Không', 1781082000, 'Active', NULL, 1),
(112, 'Lê Hải Đăng', 1684108800, 'Nam', 'Không', 1781082000, 'Active', NULL, 1),
(113, 'Phạm Ngọc Diệp', 1684108800, 'Nữ', 'Không', 1781082000, 'Active', NULL, 1),
(114, 'Vũ Hoàng Long', 1684108800, 'Nam', 'Không', 1781082000, 'Active', NULL, 1),
(115, 'Hoàng Thu Thủy', 1684108800, 'Nữ', 'Không', 1781082000, 'Active', NULL, 1),
(116, 'Đặng Quang Minh', 1684108800, 'Nam', 'Không', 1781082000, 'Active', NULL, 1),
(117, 'Bùi Khánh Linh', 1684108800, 'Nữ', 'Không', 1781082000, 'Active', NULL, 1),
(118, 'Ngô Gia Khiêm', 1684108800, 'Nam', 'Không', 1781082000, 'Active', NULL, 1),
(119, 'Lý Thảo Nguyên', 1684108800, 'Nữ', 'Không', 1781082000, 'Active', NULL, 1),
(120, 'Đỗ Minh Khang', 1684108800, 'Nam', 'Không', 1781082000, 'Active', NULL, 1),
(121, 'Trương Mỹ Tâm', 1684108800, 'Nữ', 'Không', 1781082000, 'Active', NULL, 1),
(122, 'Phan Anh Tuấn', 1684108800, 'Nam', 'Không', 1781082000, 'Active', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `StudentTuitionPlans`
--

CREATE TABLE `StudentTuitionPlans` (
  `PlanID` int NOT NULL,
  `StudentID` int NOT NULL,
  `PackageID` int NOT NULL,
  `StartMonth` varchar(10) NOT NULL,
  `MonthlyTuitionSnapshot` decimal(15,2) NOT NULL,
  `Status` varchar(20) DEFAULT 'Active',
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Teachers`
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
-- Dumping data for table `Teachers`
--

INSERT INTO `Teachers` (`TeacherID`, `FullName`, `PhoneNumber`, `Email`, `DateOfBirth`, `Gender`, `IDCard`, `Address`, `ProfessionalRank`, `WorkStatus`) VALUES
(5, 'Lê Quang Huy', '12312412', 'ok', NULL, 'Nam', NULL, NULL, 'Hạng II', 'Active'),
(20, 'Nguyễn Minh Chánh', '0866551849', NULL, NULL, NULL, NULL, NULL, NULL, 'Active');

-- --------------------------------------------------------

--
-- Table structure for table `TeacherWorkHistories`
--

CREATE TABLE `TeacherWorkHistories` (
  `HistoryID` int NOT NULL,
  `TeacherID` int NOT NULL,
  `Title` varchar(255) NOT NULL,
  `Tag` varchar(50) NOT NULL,
  `Description` text,
  `Kind` varchar(50) NOT NULL,
  `EventDate` bigint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `TeacherWorkHistories`
--

INSERT INTO `TeacherWorkHistories` (`HistoryID`, `TeacherID`, `Title`, `Tag`, `Description`, `Kind`, `EventDate`) VALUES
(1, 5, 'Thăng hạng Giáo viên Hạng II', 'Thăng hạng', 'Được xét thăng từ Giáo viên Hạng III lên Hạng II sau kỳ đánh giá năng lực xuất sắc.', 'up', 1754006400),
(2, 5, 'Giáo viên chủ nhiệm Lớp Mầm 1', 'Bổ nhiệm', 'Được phân công làm giáo viên chính phụ trách lớp Mầm 1, cơ sở 1.', 'role', 1725148800),
(3, 5, 'Hoàn thành tập huấn Montessori', 'Chứng chỉ', 'Đạt chứng chỉ phương pháp giáo dục Montessori cấp độ cơ bản.', 'cert', 1677628800),
(4, 5, 'Gia nhập KinderCare', 'Bắt đầu', 'Bắt đầu công tác tại hệ thống mầm non KinderCare với vị trí Giáo viên Hạng III.', 'start', 1659312000);

-- --------------------------------------------------------

--
-- Table structure for table `Transactions`
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
-- Table structure for table `Users`
--

CREATE TABLE `Users` (
  `UserID` int NOT NULL,
  `Username` varchar(100) NOT NULL,
  `PasswordHash` varchar(255) NOT NULL,
  `RoleID` int DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'Active',
  `AvatarURL` text,
  `ResetPasswordToken` varchar(255) DEFAULT NULL,
  `TokenExpiry` bigint DEFAULT NULL,
  `ReceiveEmailNotif` tinyint(1) DEFAULT '1',
  `ReceivePushNotif` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`UserID`, `Username`, `PasswordHash`, `RoleID`, `Status`, `AvatarURL`, `ResetPasswordToken`, `TokenExpiry`, `ReceiveEmailNotif`, `ReceivePushNotif`) VALUES
(1, 'admin_it', 'hash_pass', 1, 'Active', NULL, NULL, NULL, 1, 1),
(2, 'hieutruong_mai', 'hash_pass', 2, 'Active', NULL, NULL, NULL, 1, 1),
(4, 'ph_tuan', '$2a$12$iWf2E00ASg54.I3mqkNCgOAGwuNK38VGkW3y.5wxCad2GopnYTjr6', 4, 'Active', NULL, NULL, NULL, 1, 1),
(5, 'gv_quanghuy', '$2a$12$5BtJO/BxEiWdpbaqpCzrUOlLqWbQUhQcrmkq.bjBSARw87d1LH5W.', 3, 'Active', 'https://media.kindercare.app/daily-albums/album-2026-07-05/1783272950703-559253111.png', NULL, NULL, 1, 1),
(6, 'hcngdanh', '$2b$10$LdywhgIa8k1eQ4E/hG/Pkugoryt.alpqaRngCmMNN.lw98UU0Mbba', 4, 'Active', NULL, NULL, NULL, 1, 1),
(16, 'hcdanh', '$2a$12$VRQAN4p.qiD1ug0vXHtgJuTTDGXsTbif5ToMRGTmoUknnMMGPCexu', 2, 'Active', NULL, NULL, NULL, 1, 1),
(17, 'ph_minhtuan', '$2b$12$ocdnHByhLtdQVbU/YeI7K.wvAR26SUPY5SM2Vv0ayPZDtoXtDKtrO', 4, 'Active', NULL, NULL, NULL, 1, 1),
(18, 'messi', '$2a$12$l53LrmB.CSzxq//px5RQGu3nmHGEXJfDFOSsj1Sn85JsEhLJ0zFIy', 4, 'Active', 'https://media.kindercare.app/parents/parents-profile-avatar/images.jpg', NULL, NULL, 1, 1),
(20, 'nmchanh', '$2b$10$m/3l9GNlj0Faxy8nocA/veJzpX5sqPvGqzunJ/btfpGsFyG0Uw9QC', 3, 'Inactive', NULL, NULL, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `WeeklyRewards`
--

CREATE TABLE `WeeklyRewards` (
  `RewardID` int NOT NULL,
  `StudentID` int NOT NULL,
  `WeekNumber` int NOT NULL,
  `Year` int NOT NULL,
  `TeacherNote` text,
  `DateAwarded` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `WeeklyScheduleDetails`
--

CREATE TABLE `WeeklyScheduleDetails` (
  `ScheduleDetailID` int NOT NULL,
  `WeeklyScheduleID` int NOT NULL,
  `DayOfWeek` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `StartTime` time NOT NULL,
  `EndTime` time NOT NULL,
  `ActivityName` varchar(150) NOT NULL,
  `Details` text,
  `Location` varchar(100) DEFAULT NULL,
  `ActivityType` enum('pickup','meal','study','nap','play','dropoff','other') DEFAULT 'study'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `WeeklyScheduleDetails`
--

INSERT INTO `WeeklyScheduleDetails` (`ScheduleDetailID`, `WeeklyScheduleID`, `DayOfWeek`, `StartTime`, `EndTime`, `ActivityName`, `Details`, `Location`, `ActivityType`) VALUES
(1, 1, 'Monday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài dân vũ Cá Vàng Bơi', 'Sân trường', 'pickup'),
(2, 1, 'Monday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(3, 1, 'Monday', '09:00:00', '10:15:00', 'Học tập tạo hình', 'Bé vẽ và tô màu chú cá voi xanh', 'Lớp học', 'study'),
(4, 1, 'Monday', '10:15:00', '11:15:00', 'Vui chơi tự do', 'Xem tranh ảnh về các loài cá dưới biển', 'Lớp học', 'play'),
(5, 1, 'Monday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(6, 1, 'Monday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(7, 1, 'Monday', '14:30:00', '16:00:00', 'Kể chuyện cổ tích', 'Cô kể chuyện Nàng Tiên Cá nhỏ', 'Lớp học', 'study'),
(8, 1, 'Monday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(9, 1, 'Tuesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài dân vũ Cá Vàng Bơi', 'Sân trường', 'pickup'),
(10, 1, 'Tuesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(11, 1, 'Tuesday', '09:00:00', '10:15:00', 'Tiếng Anh Phonics', 'Học từ vựng về biển: Fish, Shark, Ocean', 'Lớp học', 'study'),
(12, 1, 'Tuesday', '10:15:00', '11:15:00', 'Vận động ngoài trời', 'Trò chơi vận động: Cá mập bắt cá con', 'Sân vườn', 'play'),
(13, 1, 'Tuesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(14, 1, 'Tuesday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(15, 1, 'Tuesday', '14:30:00', '16:00:00', 'Trò chơi trong lớp', 'Tập làm lồng đèn hình con sứa biển', 'Lớp học', 'play'),
(16, 1, 'Tuesday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(17, 1, 'Wednesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài dân vũ Cá Vàng Bơi', 'Sân trường', 'pickup'),
(18, 1, 'Wednesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(19, 1, 'Wednesday', '09:00:00', '10:15:00', 'Khám phá khoa học', 'Tìm hiểu đời sống và sự sinh sản của Rùa biển', 'Lớp học', 'study'),
(20, 1, 'Wednesday', '10:15:00', '11:15:00', 'Trò chơi lắp ráp', 'Xếp hình các loài sinh vật đại dương bằng lego', 'Lớp học', 'play'),
(21, 1, 'Wednesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(22, 1, 'Wednesday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(23, 1, 'Wednesday', '14:30:00', '16:00:00', 'Xem phim tư liệu', 'Xem video ngắn về rặng san hô dưới đáy biển', 'Lớp học', 'study'),
(24, 1, 'Wednesday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(25, 1, 'Thursday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài dân vũ Cá Vàng Bơi', 'Sân trường', 'pickup'),
(26, 1, 'Thursday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(27, 1, 'Thursday', '09:00:00', '10:15:00', 'Làm quen Toán học', 'Tập đếm số lượng sao biển từ 1 đến 5', 'Lớp học', 'study'),
(28, 1, 'Thursday', '10:15:00', '11:15:00', 'Trải nghiệm thực tế', 'Hoạt động xúc cát và chơi với nước ngoài sân', 'Sân vườn', 'play'),
(29, 1, 'Thursday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(30, 1, 'Thursday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(31, 1, 'Thursday', '14:30:00', '16:00:00', 'Học hát tiếng Anh', 'Tập hát bài Baby Shark vui nhộn', 'Lớp học', 'study'),
(32, 1, 'Thursday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(33, 1, 'Friday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài dân vũ Cá Vàng Bơi', 'Sân trường', 'pickup'),
(34, 1, 'Friday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(35, 1, 'Friday', '09:00:00', '10:15:00', 'Âm nhạc tổng kết', 'Hát múa ôn tập chủ đề biển cả', 'Lớp học', 'study'),
(36, 1, 'Friday', '10:15:00', '11:15:00', 'Liên hoan cuối tuần', 'Vui chơi tự do và ăn bánh kẹo liên hoan nhẹ', 'Lớp học', 'play'),
(37, 1, 'Friday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(38, 1, 'Friday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(39, 1, 'Friday', '14:30:00', '16:00:00', 'Bé ngoan cuối tuần', 'Nhận xét ưu điểm trong tuần và phát cờ bé ngoan', 'Lớp học', 'other'),
(40, 1, 'Friday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Dọn dẹp balo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff'),
(41, 2, 'Monday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài dân vũ Kìa Con Bướm Vàng', 'Sân trường', 'pickup'),
(42, 2, 'Monday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(43, 2, 'Monday', '09:00:00', '10:15:00', 'Học tập tạo hình', 'Sáng tạo nặn đất sét hình chú kiến tinh nghịch', 'Lớp học', 'study'),
(44, 2, 'Monday', '10:15:00', '11:15:00', 'Vui chơi tự do', 'Chơi đồ chơi xếp hình gỗ ở góc học tập', 'Lớp học', 'play'),
(45, 2, 'Monday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(46, 2, 'Monday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(47, 2, 'Monday', '14:30:00', '16:00:00', 'Kể chuyện cổ tích', 'Cô kể chuyện ngụ ngôn Kiến và Châu Chấu', 'Lớp học', 'study'),
(48, 2, 'Monday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(49, 2, 'Tuesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài dân vũ Kìa Con Bướm Vàng', 'Sân trường', 'pickup'),
(50, 2, 'Tuesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(51, 2, 'Tuesday', '09:00:00', '10:15:00', 'Tiếng Anh Phonics', 'Học từ vựng côn trùng: Ant, Bee, Butterfly', 'Lớp học', 'study'),
(52, 2, 'Tuesday', '10:15:00', '11:15:00', 'Vận động ngoài trời', 'Trò chơi dân gian: Ong vàng tìm mật', 'Sân vườn', 'play'),
(53, 2, 'Tuesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(54, 2, 'Tuesday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(55, 2, 'Tuesday', '14:30:00', '16:00:00', 'Trò chơi dân gian', 'Trò chơi: Thả đỉa ba ba ngoài sân', 'Sân trường', 'play'),
(56, 2, 'Tuesday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(57, 2, 'Wednesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài dân vũ Kìa Con Bướm Vàng', 'Sân trường', 'pickup'),
(58, 2, 'Wednesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(59, 2, 'Wednesday', '09:00:00', '10:15:00', 'Khám phá khoa học', 'Xem phim tư liệu ngắn về vòng đời của loài Bướm', 'Lớp học', 'study'),
(60, 2, 'Wednesday', '10:15:00', '11:15:00', 'Hoạt động góc', 'Bé tập đóng vai làm bác sĩ, người bán hàng', 'Lớp học', 'play'),
(61, 2, 'Wednesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(62, 2, 'Wednesday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(63, 2, 'Wednesday', '14:30:00', '16:00:00', 'Học vẽ cơ bản', 'Hướng dẫn vẽ chú bọ rùa bằng các nét tròn', 'Lớp học', 'study'),
(64, 2, 'Wednesday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(65, 2, 'Thursday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài dân vũ Kìa Con Bướm Vàng', 'Sân trường', 'pickup'),
(66, 2, 'Thursday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(67, 2, 'Thursday', '09:00:00', '10:15:00', 'Làm quen Toán học', 'Phân biệt kích thước lớn - nhỏ của các loài bọ', 'Lớp học', 'study'),
(68, 2, 'Thursday', '10:15:00', '11:15:00', 'Kỹ năng sống', 'Hướng dẫn quy trình rửa tay bằng xà phòng chuẩn', 'Lớp học', 'study'),
(69, 2, 'Thursday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(70, 2, 'Thursday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(71, 2, 'Thursday', '14:30:00', '16:00:00', 'Trò chơi vận động', 'Trò chơi: Bay như chú bướm, bò như chú kiến', 'Lớp học', 'play'),
(72, 2, 'Thursday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(73, 2, 'Friday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài dân vũ Kìa Con Bướm Vàng', 'Sân trường', 'pickup'),
(74, 2, 'Friday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(75, 2, 'Friday', '09:00:00', '10:15:00', 'Âm nhạc tổng kết', 'Hát bài Chị Ong Nâu Và Em Bé kết hợp gõ đệm', 'Lớp học', 'study'),
(76, 2, 'Friday', '10:15:00', '11:15:00', 'Vui chơi sân trường', 'Dạo chơi nhặt lá cây, quan sát côn trùng vườn', 'Sân vườn', 'play'),
(77, 2, 'Friday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(78, 2, 'Friday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(79, 2, 'Friday', '14:30:00', '16:00:00', 'Bé ngoan cuối tuần', 'Đánh giá thi đua tuần, tuyên dương phát cờ', 'Lớp học', 'other'),
(80, 2, 'Friday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Dọn dẹp balo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff'),
(81, 3, 'Monday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài thể dục sáng: Đội kèn tí hon', 'Sân trường', 'pickup'),
(82, 3, 'Monday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(83, 3, 'Monday', '09:00:00', '10:15:00', 'Học tập chuyên đề', 'Bé làm quen và nhận biết nhạc cụ: Trống, Đàn', 'Lớp học', 'study'),
(84, 3, 'Monday', '10:15:00', '11:15:00', 'Vui chơi âm nhạc', 'Tự do gõ trống đồ chơi, lắc vòng theo nhịp điệu', 'Lớp học', 'play'),
(85, 3, 'Monday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(86, 3, 'Monday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(87, 3, 'Monday', '14:30:00', '16:00:00', 'Kể chuyện âm thanh', 'Nghe kể chuyện theo các hiệu ứng âm thanh nhạc cụ', 'Lớp học', 'study'),
(88, 3, 'Monday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(89, 3, 'Tuesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài thể dục sáng: Đội kèn tí hon', 'Sân trường', 'pickup'),
(90, 3, 'Tuesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(91, 3, 'Tuesday', '09:00:00', '10:15:00', 'Tiếng Anh Phonics', 'Học từ vựng âm nhạc: Song, Dance, Music', 'Lớp học', 'study'),
(92, 3, 'Tuesday', '10:15:00', '11:15:00', 'Vận động thể chất', 'Nhảy dân vũ tập thể theo nhạc thiếu nhi sôi động', 'Sân trường', 'study'),
(93, 3, 'Tuesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(94, 3, 'Tuesday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(95, 3, 'Tuesday', '14:30:00', '16:00:00', 'Hoạt động vũ đạo', 'Tập các động tác múa tay theo nhịp bài hát', 'Lớp học', 'play'),
(96, 3, 'Tuesday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(97, 3, 'Wednesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài thể dục sáng: Đội kèn tí hon', 'Sân trường', 'pickup'),
(98, 3, 'Wednesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(99, 3, 'Wednesday', '09:00:00', '10:15:00', 'Khám phá âm thanh', 'Trò chơi phân biệt âm thanh to - nhỏ, cao - trầm', 'Lớp học', 'study'),
(100, 3, 'Wednesday', '10:15:00', '11:15:00', 'Trò chơi dân gian', 'Trò chơi: Tập tầm vông kết hợp hát đồng dao', 'Lớp học', 'play'),
(101, 3, 'Wednesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(102, 3, 'Wednesday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(103, 3, 'Wednesday', '14:30:00', '16:00:00', 'Tự làm nhạc cụ', 'Hướng dẫn bỏ sỏi vào chai nhựa làm xúc xắc', 'Lớp học', 'study'),
(104, 3, 'Wednesday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(105, 3, 'Thursday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài thể dục sáng: Đội kèn tí hon', 'Sân trường', 'pickup'),
(106, 3, 'Thursday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(107, 3, 'Thursday', '09:00:00', '10:15:00', 'Làm quen Toán học', 'Tập đếm số lượng nốt nhạc trang trí trên bảng', 'Lớp học', 'study'),
(108, 3, 'Thursday', '10:15:00', '11:15:00', 'Vận động nhóm', 'Trò chơi dân gian liên hoàn: Nhảy bao bố nhỏ', 'Sân vườn', 'play'),
(109, 3, 'Thursday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(110, 3, 'Thursday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(111, 3, 'Thursday', '14:30:00', '16:00:00', 'Trò chơi âm nhạc', 'Trò chơi: Nhảy vào vòng tròn khi nhạc tắt', 'Lớp học', 'play'),
(112, 3, 'Thursday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(113, 3, 'Friday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài thể dục sáng: Đội kèn tí hon', 'Sân trường', 'pickup'),
(114, 3, 'Friday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(115, 3, 'Friday', '09:00:00', '10:15:00', 'Văn nghệ tổng kết', 'Hát múa biểu diễn bài hát Mùa Hè Đến trước lớp', 'Lớp học', 'study'),
(116, 3, 'Friday', '10:15:00', '11:15:00', 'Biểu diễn tự do', 'Các nhóm nhỏ tự tin lên sân khấu thể hiện', 'Lớp học', 'play'),
(117, 3, 'Friday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(118, 3, 'Friday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(119, 3, 'Friday', '14:30:00', '16:00:00', 'Bé ngoan cuối tuần', 'Bình xét thi đua, trao cờ bé ngoan cuối tuần', 'Lớp học', 'other'),
(120, 3, 'Friday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Dọn dẹp balo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff'),
(121, 4, 'Monday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài thể dục sáng: Lá cây xào xạc', 'Sân trường', 'pickup'),
(122, 4, 'Monday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(123, 4, 'Monday', '09:00:00', '10:15:00', 'Học tập tạo hình', 'Làm tranh sáng tạo xé dán từ các loại lá khô', 'Lớp học', 'study'),
(124, 4, 'Monday', '10:15:00', '11:15:00', 'Vui chơi thiên nhiên', 'Phân loại các nhóm sỏi đá theo màu sắc kích thước', 'Lớp học', 'play'),
(125, 4, 'Monday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(126, 4, 'Monday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(127, 4, 'Monday', '14:30:00', '16:00:00', 'Kể chuyện môi trường', 'Nghe kể chuyện về bảo vệ rừng xanh và động vật', 'Lớp học', 'study'),
(128, 4, 'Monday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(129, 4, 'Tuesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài thể dục sáng: Lá cây xào xạc', 'Sân trường', 'pickup'),
(130, 4, 'Tuesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(131, 4, 'Tuesday', '09:00:00', '10:15:00', 'Tiếng Anh Phonics', 'Học từ vựng môi trường: Tree, Leaf, Flower, Earth', 'Lớp học', 'study'),
(132, 4, 'Tuesday', '10:15:00', '11:15:00', 'Vận động làm vườn', 'Ra sân tưới cây, bắt sâu cho chậu cây cảnh nhỏ', 'Sân vườn', 'play'),
(133, 4, 'Tuesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(134, 4, 'Tuesday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(135, 4, 'Tuesday', '14:30:00', '16:00:00', 'Trò chơi vận động', 'Trò chơi: Nhảy qua các chướng ngại vật sỏi đá', 'Sân trường', 'play'),
(136, 4, 'Tuesday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(137, 4, 'Wednesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài thể dục sáng: Lá cây xào xạc', 'Sân trường', 'pickup'),
(138, 4, 'Wednesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(139, 4, 'Wednesday', '09:00:00', '10:15:00', 'Khám phá khoa học', 'Học bài học bỏ rác đúng nơi quy định bảo vệ trường', 'Lớp học', 'study'),
(140, 4, 'Wednesday', '10:15:00', '11:15:00', 'Trò chơi tái chế', 'Cùng cô tập phân loại rác hữu cơ và vô cơ', 'Lớp học', 'play'),
(141, 4, 'Wednesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(142, 4, 'Wednesday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(143, 4, 'Wednesday', '14:30:00', '16:00:00', 'Làm đồ handmade', 'Tập cắt dán hoa giấy từ các mảnh giấy vụn thừa', 'Lớp học', 'study'),
(144, 4, 'Wednesday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(145, 4, 'Thursday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài thể dục sáng: Lá cây xào xạc', 'Sân trường', 'pickup'),
(146, 4, 'Thursday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(147, 4, 'Thursday', '09:00:00', '10:15:00', 'Làm quen Toán học', 'Tập đếm cánh hoa và học khái niệm nhiều - ít', 'Lớp học', 'study'),
(148, 4, 'Thursday', '10:15:00', '11:15:00', 'Trải nghiệm nông nghiệp', 'Thực hành gieo hạt mầm đậu xanh vào chậu đất nhỏ', 'Sân vườn', 'play'),
(149, 4, 'Thursday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(150, 4, 'Thursday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(151, 4, 'Thursday', '14:30:00', '16:00:00', 'Trò chơi tương tác', 'Trò chơi đóng vai: Em làm bác nông dân tưới rau', 'Lớp học', 'play'),
(152, 4, 'Thursday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ', 'Cổng A', 'dropoff'),
(153, 4, 'Friday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Tập bài thể dục sáng: Lá cây xào xạc', 'Sân trường', 'pickup'),
(154, 4, 'Friday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng theo thực đơn', 'Phòng ăn', 'meal'),
(155, 4, 'Friday', '09:00:00', '10:15:00', 'Âm nhạc ôn tập', 'Tập hát bài hát tập thể Em Yêu Cây Xanh rộn rã', 'Lớp học', 'study'),
(156, 4, 'Friday', '10:15:00', '11:15:00', 'Triển lãm mini', 'Trưng bày các chậu cây đậu xanh tự tay bé gieo', 'Lớp học', 'play'),
(157, 4, 'Friday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap'),
(158, 4, 'Friday', '14:00:00', '14:30:00', 'Ăn xế chiều', 'Suất nhẹ xế chiều', 'Phòng ăn', 'meal'),
(159, 4, 'Friday', '14:30:00', '16:00:00', 'Bé ngoan cuối tháng', 'Tổng kết thi đua tháng 7, phát quà và cờ bé ngoan', 'Lớp học', 'other'),
(160, 4, 'Friday', '16:00:00', '17:00:00', 'Vệ sinh & Trả trẻ', 'Dọn dẹp balo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff');

-- --------------------------------------------------------

--
-- Table structure for table `WeeklySchedules`
--

CREATE TABLE `WeeklySchedules` (
  `WeeklyScheduleID` int NOT NULL,
  `MonthlyScheduleID` int NOT NULL,
  `WeekOrder` int NOT NULL,
  `WeekTheme` varchar(255) NOT NULL,
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `WeeklySchedules`
--

INSERT INTO `WeeklySchedules` (`WeeklyScheduleID`, `MonthlyScheduleID`, `WeekOrder`, `WeekTheme`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, 1, 'Tuần 1: Làm quen với biển cả (Sinh vật đại dương)', 1783012594, 1783012594),
(2, 1, 2, 'Tuần 2: Những người bạn tí hon (Thế giới côn trùng)', 1783012594, 1783012594),
(3, 1, 3, 'Tuần 3: Giai điệu mùa hè (Âm nhạc và vận động)', 1783012594, 1783012594),
(4, 1, 4, 'Tuần 4: Sáng tạo cùng thiên nhiên (Bảo vệ môi trường)', 1783012594, 1783012594);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AcademicYears`
--
ALTER TABLE `AcademicYears`
  ADD PRIMARY KEY (`YearID`);

--
-- Indexes for table `Admins`
--
ALTER TABLE `Admins`
  ADD PRIMARY KEY (`AdminID`);

--
-- Indexes for table `Allergies`
--
ALTER TABLE `Allergies`
  ADD PRIMARY KEY (`AllergyID`),
  ADD KEY `idx_allergies_student` (`StudentID`),
  ADD KEY `idx_allergies_active` (`IsActive`);

--
-- Indexes for table `Attendances`
--
ALTER TABLE `Attendances`
  ADD PRIMARY KEY (`AttendanceID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `FK_Attendances_CheckedInTeacher` (`CheckedInByTeacherID`),
  ADD KEY `FK_Attendances_CheckedOutTeacher` (`CheckedOutByTeacherID`),
  ADD KEY `FK_Attendances_Proxy` (`ProxyAuthorizationID`),
  ADD KEY `fk_dropped_off_parent` (`DroppedOffByParentID`),
  ADD KEY `fk_picked_up_parent` (`PickedUpByParentID`);

--
-- Indexes for table `BaseFees`
--
ALTER TABLE `BaseFees`
  ADD PRIMARY KEY (`FeeID`),
  ADD KEY `YearID` (`YearID`);

--
-- Indexes for table `Buildings`
--
ALTER TABLE `Buildings`
  ADD PRIMARY KEY (`BuildingID`),
  ADD KEY `CampusID` (`CampusID`);

--
-- Indexes for table `Campuses`
--
ALTER TABLE `Campuses`
  ADD PRIMARY KEY (`CampusID`);

--
-- Indexes for table `Classes`
--
ALTER TABLE `Classes`
  ADD PRIMARY KEY (`ClassID`),
  ADD KEY `GradeID` (`GradeID`),
  ADD KEY `BuildingID` (`BuildingID`),
  ADD KEY `YearID` (`YearID`);

--
-- Indexes for table `ClassTeachers`
--
ALTER TABLE `ClassTeachers`
  ADD PRIMARY KEY (`ClassID`,`TeacherID`),
  ADD KEY `TeacherID` (`TeacherID`);

--
-- Indexes for table `DailyActivities`
--
ALTER TABLE `DailyActivities`
  ADD PRIMARY KEY (`ActivityID`),
  ADD UNIQUE KEY `Unique_Student_Date` (`StudentID`,`LogDate`);

--
-- Indexes for table `DailyAlbumPhotos`
--
ALTER TABLE `DailyAlbumPhotos`
  ADD PRIMARY KEY (`PhotoID`),
  ADD KEY `AlbumID` (`AlbumID`);

--
-- Indexes for table `DailyAlbums`
--
ALTER TABLE `DailyAlbums`
  ADD PRIMARY KEY (`AlbumID`),
  ADD KEY `ClassID` (`ClassID`),
  ADD KEY `TeacherID` (`TeacherID`),
  ADD KEY `idx_album_date` (`ClassID`,`AlbumDate`) COMMENT 'Tối ưu tốc độ tìm kiếm album theo lớp và ngày';

--
-- Indexes for table `DailyLessons`
--
ALTER TABLE `DailyLessons`
  ADD PRIMARY KEY (`LessonLogID`),
  ADD KEY `ClassID` (`ClassID`),
  ADD KEY `idx_class_lesson_date` (`ClassID`,`LessonDate`);

--
-- Indexes for table `DailySchedules`
--
ALTER TABLE `DailySchedules`
  ADD PRIMARY KEY (`DailyScheduleID`),
  ADD KEY `idx_class_date` (`ClassID`,`ScheduleDate`);

--
-- Indexes for table `DevelopmentAssessments`
--
ALTER TABLE `DevelopmentAssessments`
  ADD PRIMARY KEY (`AssessmentID`),
  ADD UNIQUE KEY `uq_dev_assessments_student_term` (`StudentID`,`TermPeriod`),
  ADD KEY `idx_dev_assessments_term` (`TermPeriod`);

--
-- Indexes for table `EventClasses`
--
ALTER TABLE `EventClasses`
  ADD PRIMARY KEY (`EventID`,`ClassID`),
  ADD KEY `ClassID` (`ClassID`);

--
-- Indexes for table `Events`
--
ALTER TABLE `Events`
  ADD PRIMARY KEY (`EventID`),
  ADD KEY `CreatedBy` (`CreatedBy`),
  ADD KEY `idx_events_time` (`StartTime`,`EndTime`);

--
-- Indexes for table `EventStudents`
--
ALTER TABLE `EventStudents`
  ADD PRIMARY KEY (`EventID`,`StudentID`),
  ADD KEY `FK_EventStudents_Students` (`StudentID`);

--
-- Indexes for table `Extracurriculars`
--
ALTER TABLE `Extracurriculars`
  ADD PRIMARY KEY (`ActivityID`);

--
-- Indexes for table `fcm_tokens`
--
ALTER TABLE `fcm_tokens`
  ADD PRIMARY KEY (`TokenID`),
  ADD UNIQUE KEY `idx_unique_user_token` (`UserID`,`DeviceToken`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `Feedbacks`
--
ALTER TABLE `Feedbacks`
  ADD PRIMARY KEY (`FeedbackID`),
  ADD KEY `ParentID` (`ParentID`),
  ADD KEY `RespondedByID` (`RespondedByID`);

--
-- Indexes for table `Grades`
--
ALTER TABLE `Grades`
  ADD PRIMARY KEY (`GradeID`);

--
-- Indexes for table `HealthRecords`
--
ALTER TABLE `HealthRecords`
  ADD PRIMARY KEY (`RecordID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `Holidays`
--
ALTER TABLE `Holidays`
  ADD PRIMARY KEY (`HolidayID`),
  ADD KEY `idx_date` (`HolidayDate`);

--
-- Indexes for table `Invoices`
--
ALTER TABLE `Invoices`
  ADD PRIMARY KEY (`InvoiceID`),
  ADD UNIQUE KEY `uq_invoice` (`StudentID`,`BillingMonth`,`InvoiceType`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `PackageID` (`PackageID`);

--
-- Indexes for table `LeaveRequests`
--
ALTER TABLE `LeaveRequests`
  ADD PRIMARY KEY (`RequestID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ParentID` (`ParentID`),
  ADD KEY `ApproverID` (`ApproverID`);

--
-- Indexes for table `MedicationRequests`
--
ALTER TABLE `MedicationRequests`
  ADD PRIMARY KEY (`MedRequestID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ParentID` (`ParentID`);

--
-- Indexes for table `MenuDetails`
--
ALTER TABLE `MenuDetails`
  ADD PRIMARY KEY (`MenuDetailID`),
  ADD UNIQUE KEY `Unique_Menu_Day_Meal` (`MenuID`,`DayOfWeek`,`MealType`);

--
-- Indexes for table `Menus`
--
ALTER TABLE `Menus`
  ADD PRIMARY KEY (`MenuID`),
  ADD UNIQUE KEY `Unique_Class_Week_Year` (`ClassID`,`WeekNumber`,`Year`);

--
-- Indexes for table `MonthlySchedules`
--
ALTER TABLE `MonthlySchedules`
  ADD PRIMARY KEY (`MonthlyScheduleID`),
  ADD UNIQUE KEY `Unique_Class_Month_Year` (`ClassID`,`Month`,`Year`);

--
-- Indexes for table `Newsfeeds`
--
ALTER TABLE `Newsfeeds`
  ADD PRIMARY KEY (`PostID`),
  ADD KEY `ClassID` (`ClassID`),
  ADD KEY `TeacherID` (`TeacherID`);

--
-- Indexes for table `NewsfeedTags`
--
ALTER TABLE `NewsfeedTags`
  ADD PRIMARY KEY (`PostID`,`StudentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD PRIMARY KEY (`NotifID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `NotificationSettings`
--
ALTER TABLE `NotificationSettings`
  ADD PRIMARY KEY (`UserID`);

--
-- Indexes for table `Parents`
--
ALTER TABLE `Parents`
  ADD PRIMARY KEY (`ParentID`);

--
-- Indexes for table `PaymentPackages`
--
ALTER TABLE `PaymentPackages`
  ADD PRIMARY KEY (`PackageID`);

--
-- Indexes for table `Principals`
--
ALTER TABLE `Principals`
  ADD PRIMARY KEY (`PrincipalID`);

--
-- Indexes for table `ProxyAuthorizations`
--
ALTER TABLE `ProxyAuthorizations`
  ADD PRIMARY KEY (`AuthorizationID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ParentID` (`ParentID`);

--
-- Indexes for table `RewardBadges`
--
ALTER TABLE `RewardBadges`
  ADD PRIMARY KEY (`BadgeID`);

--
-- Indexes for table `Roles`
--
ALTER TABLE `Roles`
  ADD PRIMARY KEY (`RoleID`);

--
-- Indexes for table `StudentAssessments`
--
ALTER TABLE `StudentAssessments`
  ADD PRIMARY KEY (`AssessmentID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `StudentBadges`
--
ALTER TABLE `StudentBadges`
  ADD PRIMARY KEY (`StudentBadgeID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `BadgeID` (`BadgeID`);

--
-- Indexes for table `StudentExtracurriculars`
--
ALTER TABLE `StudentExtracurriculars`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD UNIQUE KEY `uq_student_activity_month` (`StudentID`,`ActivityID`,`RegisteredMonth`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ActivityID` (`ActivityID`),
  ADD KEY `SE_ibfk_invoice` (`InvoiceID`);

--
-- Indexes for table `StudentParents`
--
ALTER TABLE `StudentParents`
  ADD PRIMARY KEY (`StudentID`,`ParentID`),
  ADD KEY `ParentID` (`ParentID`);

--
-- Indexes for table `Students`
--
ALTER TABLE `Students`
  ADD PRIMARY KEY (`StudentID`),
  ADD KEY `ClassID` (`ClassID`);

--
-- Indexes for table `StudentTuitionPlans`
--
ALTER TABLE `StudentTuitionPlans`
  ADD PRIMARY KEY (`PlanID`),
  ADD KEY `idx_student` (`StudentID`),
  ADD KEY `idx_package` (`PackageID`);

--
-- Indexes for table `Teachers`
--
ALTER TABLE `Teachers`
  ADD PRIMARY KEY (`TeacherID`);

--
-- Indexes for table `TeacherWorkHistories`
--
ALTER TABLE `TeacherWorkHistories`
  ADD PRIMARY KEY (`HistoryID`),
  ADD KEY `TeacherID` (`TeacherID`);

--
-- Indexes for table `Transactions`
--
ALTER TABLE `Transactions`
  ADD PRIMARY KEY (`TransactionID`),
  ADD KEY `InvoiceID` (`InvoiceID`);

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`),
  ADD KEY `RoleID` (`RoleID`);

--
-- Indexes for table `WeeklyRewards`
--
ALTER TABLE `WeeklyRewards`
  ADD PRIMARY KEY (`RewardID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Indexes for table `WeeklyScheduleDetails`
--
ALTER TABLE `WeeklyScheduleDetails`
  ADD PRIMARY KEY (`ScheduleDetailID`),
  ADD KEY `idx_weekly_schedule_day` (`WeeklyScheduleID`,`DayOfWeek`);

--
-- Indexes for table `WeeklySchedules`
--
ALTER TABLE `WeeklySchedules`
  ADD PRIMARY KEY (`WeeklyScheduleID`),
  ADD UNIQUE KEY `Unique_Month_WeekOrder` (`MonthlyScheduleID`,`WeekOrder`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `AcademicYears`
--
ALTER TABLE `AcademicYears`
  MODIFY `YearID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Allergies`
--
ALTER TABLE `Allergies`
  MODIFY `AllergyID` int NOT NULL AUTO_INCREMENT COMMENT 'PK', AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `Attendances`
--
ALTER TABLE `Attendances`
  MODIFY `AttendanceID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=328;

--
-- AUTO_INCREMENT for table `BaseFees`
--
ALTER TABLE `BaseFees`
  MODIFY `FeeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Buildings`
--
ALTER TABLE `Buildings`
  MODIFY `BuildingID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Campuses`
--
ALTER TABLE `Campuses`
  MODIFY `CampusID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Classes`
--
ALTER TABLE `Classes`
  MODIFY `ClassID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `DailyActivities`
--
ALTER TABLE `DailyActivities`
  MODIFY `ActivityID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `DailyAlbumPhotos`
--
ALTER TABLE `DailyAlbumPhotos`
  MODIFY `PhotoID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3021;

--
-- AUTO_INCREMENT for table `DailyAlbums`
--
ALTER TABLE `DailyAlbums`
  MODIFY `AlbumID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=301;

--
-- AUTO_INCREMENT for table `DailyLessons`
--
ALTER TABLE `DailyLessons`
  MODIFY `LessonLogID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `DailySchedules`
--
ALTER TABLE `DailySchedules`
  MODIFY `DailyScheduleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=324;

--
-- AUTO_INCREMENT for table `DevelopmentAssessments`
--
ALTER TABLE `DevelopmentAssessments`
  MODIFY `AssessmentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Events`
--
ALTER TABLE `Events`
  MODIFY `EventID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `Extracurriculars`
--
ALTER TABLE `Extracurriculars`
  MODIFY `ActivityID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `fcm_tokens`
--
ALTER TABLE `fcm_tokens`
  MODIFY `TokenID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=327;

--
-- AUTO_INCREMENT for table `Feedbacks`
--
ALTER TABLE `Feedbacks`
  MODIFY `FeedbackID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Grades`
--
ALTER TABLE `Grades`
  MODIFY `GradeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `HealthRecords`
--
ALTER TABLE `HealthRecords`
  MODIFY `RecordID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `Holidays`
--
ALTER TABLE `Holidays`
  MODIFY `HolidayID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Invoices`
--
ALTER TABLE `Invoices`
  MODIFY `InvoiceID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `LeaveRequests`
--
ALTER TABLE `LeaveRequests`
  MODIFY `RequestID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `MedicationRequests`
--
ALTER TABLE `MedicationRequests`
  MODIFY `MedRequestID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `MenuDetails`
--
ALTER TABLE `MenuDetails`
  MODIFY `MenuDetailID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `Menus`
--
ALTER TABLE `Menus`
  MODIFY `MenuID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `MonthlySchedules`
--
ALTER TABLE `MonthlySchedules`
  MODIFY `MonthlyScheduleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Newsfeeds`
--
ALTER TABLE `Newsfeeds`
  MODIFY `PostID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `NotifID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=263;

--
-- AUTO_INCREMENT for table `PaymentPackages`
--
ALTER TABLE `PaymentPackages`
  MODIFY `PackageID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ProxyAuthorizations`
--
ALTER TABLE `ProxyAuthorizations`
  MODIFY `AuthorizationID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `RewardBadges`
--
ALTER TABLE `RewardBadges`
  MODIFY `BadgeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Roles`
--
ALTER TABLE `Roles`
  MODIFY `RoleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `StudentAssessments`
--
ALTER TABLE `StudentAssessments`
  MODIFY `AssessmentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `StudentBadges`
--
ALTER TABLE `StudentBadges`
  MODIFY `StudentBadgeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `StudentExtracurriculars`
--
ALTER TABLE `StudentExtracurriculars`
  MODIFY `EnrollmentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Students`
--
ALTER TABLE `Students`
  MODIFY `StudentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `StudentTuitionPlans`
--
ALTER TABLE `StudentTuitionPlans`
  MODIFY `PlanID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `TeacherWorkHistories`
--
ALTER TABLE `TeacherWorkHistories`
  MODIFY `HistoryID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Transactions`
--
ALTER TABLE `Transactions`
  MODIFY `TransactionID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `WeeklyRewards`
--
ALTER TABLE `WeeklyRewards`
  MODIFY `RewardID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `WeeklyScheduleDetails`
--
ALTER TABLE `WeeklyScheduleDetails`
  MODIFY `ScheduleDetailID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=161;

--
-- AUTO_INCREMENT for table `WeeklySchedules`
--
ALTER TABLE `WeeklySchedules`
  MODIFY `WeeklyScheduleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Allergies`
--
ALTER TABLE `Allergies`
  ADD CONSTRAINT `fk_allergies_student` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Constraints for table `Attendances`
--
ALTER TABLE `Attendances`
  ADD CONSTRAINT `Attendances_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `FK_Attendances_CheckedInTeacher` FOREIGN KEY (`CheckedInByTeacherID`) REFERENCES `Teachers` (`TeacherID`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Attendances_CheckedOutTeacher` FOREIGN KEY (`CheckedOutByTeacherID`) REFERENCES `Teachers` (`TeacherID`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Attendances_Proxy` FOREIGN KEY (`ProxyAuthorizationID`) REFERENCES `ProxyAuthorizations` (`AuthorizationID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_dropped_off_parent` FOREIGN KEY (`DroppedOffByParentID`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_picked_up_parent` FOREIGN KEY (`PickedUpByParentID`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL;

--
-- Constraints for table `BaseFees`
--
ALTER TABLE `BaseFees`
  ADD CONSTRAINT `BaseFees_ibfk_1` FOREIGN KEY (`YearID`) REFERENCES `AcademicYears` (`YearID`);

--
-- Constraints for table `Buildings`
--
ALTER TABLE `Buildings`
  ADD CONSTRAINT `Buildings_ibfk_1` FOREIGN KEY (`CampusID`) REFERENCES `Campuses` (`CampusID`);

--
-- Constraints for table `Classes`
--
ALTER TABLE `Classes`
  ADD CONSTRAINT `Classes_ibfk_1` FOREIGN KEY (`GradeID`) REFERENCES `Grades` (`GradeID`),
  ADD CONSTRAINT `Classes_ibfk_2` FOREIGN KEY (`BuildingID`) REFERENCES `Buildings` (`BuildingID`),
  ADD CONSTRAINT `Classes_ibfk_3` FOREIGN KEY (`YearID`) REFERENCES `AcademicYears` (`YearID`);

--
-- Constraints for table `ClassTeachers`
--
ALTER TABLE `ClassTeachers`
  ADD CONSTRAINT `ClassTeachers_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`),
  ADD CONSTRAINT `ClassTeachers_ibfk_2` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`);

--
-- Constraints for table `DailyActivities`
--
ALTER TABLE `DailyActivities`
  ADD CONSTRAINT `FK_DailyAct_Student` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Constraints for table `DailyAlbumPhotos`
--
ALTER TABLE `DailyAlbumPhotos`
  ADD CONSTRAINT `fk_daily_album_photos_parent` FOREIGN KEY (`AlbumID`) REFERENCES `DailyAlbums` (`AlbumID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `DailyAlbums`
--
ALTER TABLE `DailyAlbums`
  ADD CONSTRAINT `fk_daily_albums_classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_daily_albums_teachers` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `DailyLessons`
--
ALTER TABLE `DailyLessons`
  ADD CONSTRAINT `fk_dailylessons_classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `DailySchedules`
--
ALTER TABLE `DailySchedules`
  ADD CONSTRAINT `FK_DailySchedules_Classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE;

--
-- Constraints for table `DevelopmentAssessments`
--
ALTER TABLE `DevelopmentAssessments`
  ADD CONSTRAINT `fk_dev_assessments_student` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Constraints for table `EventClasses`
--
ALTER TABLE `EventClasses`
  ADD CONSTRAINT `EventClasses_ibfk_1` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`) ON DELETE CASCADE,
  ADD CONSTRAINT `EventClasses_ibfk_2` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE;

--
-- Constraints for table `Events`
--
ALTER TABLE `Events`
  ADD CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`CreatedBy`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `EventStudents`
--
ALTER TABLE `EventStudents`
  ADD CONSTRAINT `FK_EventStudents_Events` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_EventStudents_Students` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Constraints for table `fcm_tokens`
--
ALTER TABLE `fcm_tokens`
  ADD CONSTRAINT `fcm_tokens_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Feedbacks`
--
ALTER TABLE `Feedbacks`
  ADD CONSTRAINT `Feedbacks_ibfk_1` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`),
  ADD CONSTRAINT `Feedbacks_ibfk_2` FOREIGN KEY (`RespondedByID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `HealthRecords`
--
ALTER TABLE `HealthRecords`
  ADD CONSTRAINT `HealthRecords_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`);

--
-- Constraints for table `Invoices`
--
ALTER TABLE `Invoices`
  ADD CONSTRAINT `Invoices_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `Invoices_ibfk_2` FOREIGN KEY (`PackageID`) REFERENCES `PaymentPackages` (`PackageID`);

--
-- Constraints for table `LeaveRequests`
--
ALTER TABLE `LeaveRequests`
  ADD CONSTRAINT `LeaveRequests_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `LeaveRequests_ibfk_2` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`),
  ADD CONSTRAINT `LeaveRequests_ibfk_3` FOREIGN KEY (`ApproverID`) REFERENCES `Teachers` (`TeacherID`);

--
-- Constraints for table `MedicationRequests`
--
ALTER TABLE `MedicationRequests`
  ADD CONSTRAINT `MedicationRequests_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `MedicationRequests_ibfk_2` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`);

--
-- Constraints for table `MenuDetails`
--
ALTER TABLE `MenuDetails`
  ADD CONSTRAINT `FK_MenuDetails_Menus` FOREIGN KEY (`MenuID`) REFERENCES `Menus` (`MenuID`) ON DELETE CASCADE;

--
-- Constraints for table `Menus`
--
ALTER TABLE `Menus`
  ADD CONSTRAINT `FK_Menus_Classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE;

--
-- Constraints for table `MonthlySchedules`
--
ALTER TABLE `MonthlySchedules`
  ADD CONSTRAINT `FK_MonthlySchedules_Classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE;

--
-- Constraints for table `Newsfeeds`
--
ALTER TABLE `Newsfeeds`
  ADD CONSTRAINT `Newsfeeds_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`),
  ADD CONSTRAINT `Newsfeeds_ibfk_2` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`);

--
-- Constraints for table `NewsfeedTags`
--
ALTER TABLE `NewsfeedTags`
  ADD CONSTRAINT `NewsfeedTags_ibfk_1` FOREIGN KEY (`PostID`) REFERENCES `Newsfeeds` (`PostID`) ON DELETE CASCADE,
  ADD CONSTRAINT `NewsfeedTags_ibfk_2` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Constraints for table `Notifications`
--
ALTER TABLE `Notifications`
  ADD CONSTRAINT `Notifications_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `NotificationSettings`
--
ALTER TABLE `NotificationSettings`
  ADD CONSTRAINT `k_notifset_user` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE;

--
-- Constraints for table `Parents`
--
ALTER TABLE `Parents`
  ADD CONSTRAINT `Parents_ibfk_1` FOREIGN KEY (`ParentID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `Principals`
--
ALTER TABLE `Principals`
  ADD CONSTRAINT `Principals_ibfk_1` FOREIGN KEY (`PrincipalID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `ProxyAuthorizations`
--
ALTER TABLE `ProxyAuthorizations`
  ADD CONSTRAINT `ProxyAuthorizations_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `ProxyAuthorizations_ibfk_2` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`);

--
-- Constraints for table `StudentAssessments`
--
ALTER TABLE `StudentAssessments`
  ADD CONSTRAINT `StudentAssessments_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`);

--
-- Constraints for table `StudentBadges`
--
ALTER TABLE `StudentBadges`
  ADD CONSTRAINT `StudentBadges_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `StudentBadges_ibfk_2` FOREIGN KEY (`BadgeID`) REFERENCES `RewardBadges` (`BadgeID`) ON DELETE CASCADE;

--
-- Constraints for table `StudentExtracurriculars`
--
ALTER TABLE `StudentExtracurriculars`
  ADD CONSTRAINT `SE_ibfk_invoice` FOREIGN KEY (`InvoiceID`) REFERENCES `Invoices` (`InvoiceID`),
  ADD CONSTRAINT `StudentExtracurriculars_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `StudentExtracurriculars_ibfk_2` FOREIGN KEY (`ActivityID`) REFERENCES `Extracurriculars` (`ActivityID`);

--
-- Constraints for table `StudentParents`
--
ALTER TABLE `StudentParents`
  ADD CONSTRAINT `StudentParents_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `StudentParents_ibfk_2` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`);

--
-- Constraints for table `Students`
--
ALTER TABLE `Students`
  ADD CONSTRAINT `Students_ibfk_1` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`);

--
-- Constraints for table `StudentTuitionPlans`
--
ALTER TABLE `StudentTuitionPlans`
  ADD CONSTRAINT `STP_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `STP_ibfk_2` FOREIGN KEY (`PackageID`) REFERENCES `PaymentPackages` (`PackageID`);

--
-- Constraints for table `Teachers`
--
ALTER TABLE `Teachers`
  ADD CONSTRAINT `Teachers_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `Users` (`UserID`);

--
-- Constraints for table `TeacherWorkHistories`
--
ALTER TABLE `TeacherWorkHistories`
  ADD CONSTRAINT `k_workhist_teacher` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`) ON DELETE CASCADE;

--
-- Constraints for table `Transactions`
--
ALTER TABLE `Transactions`
  ADD CONSTRAINT `Transactions_ibfk_1` FOREIGN KEY (`InvoiceID`) REFERENCES `Invoices` (`InvoiceID`);

--
-- Constraints for table `Users`
--
ALTER TABLE `Users`
  ADD CONSTRAINT `Users_ibfk_1` FOREIGN KEY (`RoleID`) REFERENCES `Roles` (`RoleID`);

--
-- Constraints for table `WeeklyRewards`
--
ALTER TABLE `WeeklyRewards`
  ADD CONSTRAINT `WeeklyRewards_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Constraints for table `WeeklyScheduleDetails`
--
ALTER TABLE `WeeklyScheduleDetails`
  ADD CONSTRAINT `FK_Details_WeeklySchedules` FOREIGN KEY (`WeeklyScheduleID`) REFERENCES `WeeklySchedules` (`WeeklyScheduleID`) ON DELETE CASCADE;

--
-- Constraints for table `WeeklySchedules`
--
ALTER TABLE `WeeklySchedules`
  ADD CONSTRAINT `FK_WeeklySchedules_Monthly` FOREIGN KEY (`MonthlyScheduleID`) REFERENCES `MonthlySchedules` (`MonthlyScheduleID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
