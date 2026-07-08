-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: kindercare-mysql:3306
-- Thời gian đã tạo: Th7 08, 2026 lúc 12:55 PM
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
  `CheckedInByTeacherID` int DEFAULT NULL,
  `CheckedOutByTeacherID` int DEFAULT NULL,
  `ProxyAuthorizationID` int DEFAULT NULL,
  `DroppedOffByParentID` int DEFAULT NULL,
  `PickedUpByParentID` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `Attendances`
--

INSERT INTO `Attendances` (`AttendanceID`, `StudentID`, `AttendanceDate`, `Status`, `CheckInTime`, `CheckOutTime`, `CheckedInByTeacherID`, `CheckedOutByTeacherID`, `ProxyAuthorizationID`, `DroppedOffByParentID`, `PickedUpByParentID`) VALUES
(1, 19, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(2, 1, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(68, 105, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(69, 106, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(70, 107, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(71, 108, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(72, 109, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(73, 110, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(74, 111, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(75, 112, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(76, 113, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(77, 114, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(78, 115, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(79, 116, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(80, 117, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(81, 118, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(82, 119, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(83, 120, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(84, 121, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(85, 122, 1783296000, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(129, 1, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(130, 19, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(196, 105, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(197, 106, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(198, 107, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(199, 108, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(200, 109, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(201, 110, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(202, 111, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(203, 112, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(204, 113, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(205, 114, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(206, 115, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(207, 116, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(208, 117, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(209, 118, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(210, 119, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(211, 120, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(212, 121, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(213, 122, 1783382400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(256, 1, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(257, 19, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(258, 105, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(259, 106, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(260, 107, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(261, 108, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(262, 109, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(263, 110, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(264, 111, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(265, 112, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(266, 113, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(267, 114, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(268, 115, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(269, 116, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(270, 117, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(271, 118, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(272, 119, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(273, 120, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(274, 121, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(275, 122, 1783468800, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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

--
-- Đang đổ dữ liệu cho bảng `ClassTeachers`
--

INSERT INTO `ClassTeachers` (`ClassID`, `TeacherID`, `RoleInClass`, `AssignedDate`) VALUES
(1, 5, 'Giáo viên trưởng', 1781082000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `DailyActivities`
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

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `DailyAlbumPhotos`
--

CREATE TABLE `DailyAlbumPhotos` (
  `PhotoID` int NOT NULL,
  `AlbumID` int NOT NULL,
  `PhotoURL` varchar(255) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `DailyAlbumPhotos`
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
-- Cấu trúc bảng cho bảng `DailyAlbums`
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
-- Đang đổ dữ liệu cho bảng `DailyAlbums`
--

INSERT INTO `DailyAlbums` (`AlbumID`, `ClassID`, `TeacherID`, `AlbumDate`, `Caption`, `CreatedAt`, `UpdatedAt`) VALUES
(300, 1, 5, 1783296000, 'Album ảnh ngày 06/07/2026: Một ngày trải nghiệm phương pháp giáo dục hiện đại và chuỗi hoạt động thể chất liên hoàn của các con lớp Mầm 1. Chúc ba mẹ một tuần mới tràn đầy năng lượng!', 1783274220, 1783274220);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `DailyLessons`
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
-- Đang đổ dữ liệu cho bảng `DailyLessons`
--

INSERT INTO `DailyLessons` (`LessonLogID`, `ClassID`, `LessonDate`, `SubjectName`, `LessonTitle`, `Details`, `IconType`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, 1783296000, 'TẠO HÌNH', 'Vẽ và tô màu con cá', 'Cô hướng dẫn bé vẽ con cá bằng các nét cơ bản và tô màu bằng sáp màu.', 'draw', 1782866086, 1782866086),
(2, 1, 1783296000, 'TIẾNG ANH', 'Từ vựng chủ đề Màu sắc (Colors)', 'Bé làm quen với 3 màu cơ bản: Red, Blue, Yellow qua thẻ flashcard và trò chơi.', 'english', 1782866086, 1782866086);

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
  `EventType` enum('Class','School','Holiday','Student') NOT NULL DEFAULT 'Class',
  `CreatedBy` int DEFAULT NULL,
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `EventStudents`
--

CREATE TABLE `EventStudents` (
  `EventID` int NOT NULL,
  `StudentID` int NOT NULL
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
-- Cấu trúc bảng cho bảng `fcm_tokens`
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
-- Đang đổ dữ liệu cho bảng `fcm_tokens`
--

INSERT INTO `fcm_tokens` (`TokenID`, `UserID`, `DeviceToken`, `DeviceType`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 6, 'cc28eRpmqSXvexnAh_w8tr:APA91bGDp2k7M_uhPfptytaTjD5d6fctyyp23mjxJz9n_5xJ7pZYdOPExhwSYuJQwBLEMkVTNcKN92uc28ehICnK98s6eq6QVUCfTO0aZR7ofacJbSRH3oU', 'web', 1782661552, 1783219675),
(4, 6, 'fjfqe9lYvVEYK63i_q1T2h:APA91bEBiGzPZmOHvDzyqR5yfoRwmcuiJGvk-YkW5jDlB1MJfpOklV4V2eARND7q2qJAu_i06RBzoQC7cVeQdb-8cLkY64P1GgoFGoOCEaHoO2N9LfnMW3Y', 'web', 1782739894, 1783431182),
(8, 5, 'dNx6fnzETaW0fsvLqoKCaZ:APA91bFxqNsWygsfV-xM49tJURpwExl5ATx0ahRfg5sUHGUi9yMMJaiMy0g0aN1rZGP87nEVzClBN6ZY4QpPC4bXWwxxa0nFXm9lCNR5UdaV20-UmrJ4pOY', 'android', 1782796885, 1783511644),
(26, 17, 'dNx6fnzETaW0fsvLqoKCaZ:APA91bFxqNsWygsfV-xM49tJURpwExl5ATx0ahRfg5sUHGUi9yMMJaiMy0g0aN1rZGP87nEVzClBN6ZY4QpPC4bXWwxxa0nFXm9lCNR5UdaV20-UmrJ4pOY', 'android', 1782870465, 1783484280),
(247, 6, 'd32sIG1Vw97mALTebrTRkg:APA91bEnMwvcPtytV7tjEYRU1N_BE5bfijqd5nfTC3dG_6aM61x7xLLaj2lXdBJrk4PNZD96LttUWZuluadjocxSDdVsRs3GYlWhP0xlvkf_ARfmT8UKg5w', 'web', 1783260054, 1783260054),
(327, 6, 'dNx6fnzETaW0fsvLqoKCaZ:APA91bFxqNsWygsfV-xM49tJURpwExl5ATx0ahRfg5sUHGUi9yMMJaiMy0g0aN1rZGP87nEVzClBN6ZY4QpPC4bXWwxxa0nFXm9lCNR5UdaV20-UmrJ4pOY', 'android', 1783484789, 1783484789);

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

--
-- Đang đổ dữ liệu cho bảng `HealthRecords`
--

INSERT INTO `HealthRecords` (`RecordID`, `StudentID`, `TermPeriod`, `Height`, `Weight`, `BMI`) VALUES
(1, 19, '2026-04', 130.00, 28.00, 16.60),
(2, 19, '2026-05', 131.00, 29.00, 16.90),
(3, 19, '2026-06', 132.00, 30.00, 17.20),
(4, 19, '2026-01', 127.00, 26.00, 16.10),
(5, 19, '2026-02', 128.00, 27.00, 16.50),
(6, 19, '2026-03', 129.00, 28.00, 16.80),
(9, 1, '2026-06', 120.00, 22.00, 15.28),
(10, 1, '2026-07', 115.00, 21.50, 16.26),
(11, 1, '2026-07', 116.00, 22.00, 16.35);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Holidays`
--

CREATE TABLE `Holidays` (
  `HolidayID` int NOT NULL,
  `HolidayDate` bigint NOT NULL,
  `HolidayName` varchar(100) DEFAULT NULL,
  `YearID` int DEFAULT NULL
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
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `InvoiceType` varchar(20) DEFAULT 'MONTHLY',
  `DueDate` bigint DEFAULT NULL,
  `ReminderSentAt` bigint DEFAULT NULL,
  `OverdueReminderSentAt` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

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
  `IsMealFeeDeducted` tinyint(1) DEFAULT '0',
  `ParentNotes` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `CreatedAt` bigint DEFAULT NULL,
  `UpdatedTime` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Bẫy `LeaveRequests`
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
-- Cấu trúc bảng cho bảng `MedicationRequests`
--

CREATE TABLE `MedicationRequests` (
  `MedRequestID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `ParentID` int DEFAULT NULL,
  `RequestDate` bigint NOT NULL,
  `MedicineDetails` text NOT NULL,
  `Dosage` text NOT NULL,
  `Frequency` varchar(100) DEFAULT NULL,
  `TimeToTake` varchar(100) DEFAULT NULL,
  `ParentNote` text,
  `MedicineImageURL` varchar(500) DEFAULT NULL,
  `Status` varchar(50) DEFAULT 'Pending',
  `TeacherNote` text,
  `UpdatedTime` bigint DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `MedicationRequests`
--

INSERT INTO `MedicationRequests` (`MedRequestID`, `StudentID`, `ParentID`, `RequestDate`, `MedicineDetails`, `Dosage`, `Frequency`, `TimeToTake`, `ParentNote`, `MedicineImageURL`, `Status`, `TeacherNote`, `UpdatedTime`) VALUES
(1, 1, 17, 1783403271, 'jdhd', 'bsns', 'bsbs', 'bsbs', 'bshsj', NULL, 'Pending', NULL, 1783403352),
(2, 1, 17, 1783477162, 'siroho', '4ml', '2 lần', 'sau ăn trưa 11:30', NULL, 'https://media.kindercare.app/parents/student-medication-requests/1783477216340-860289272.jpg', 'Pending', NULL, 1783477216),
(3, 1, 17, 1783477162, 'xin', 'hdhd', 'jshs', 'bsbs', NULL, 'https://media.kindercare.app/parents/student-medication-requests/1783477283033-443014311.jpg', 'Pending', NULL, 1783477283),
(4, 1, 17, 1783484300, 'siro', '5ml', '3', 'ndn', NULL, 'https://media.kindercare.app/parents/student-medication-requests/1783484327229-346666864.jpg', 'Pending', NULL, 1783484327),
(5, 121, 6, 1783484815, 'siro', '4 ml', '2 lần', 'trưa', NULL, 'https://media.kindercare.app/parents/student-medication-requests/1783484852269-511512512.jpg', 'Pending', NULL, 1783484852);

--
-- Bẫy `MedicationRequests`
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
-- Cấu trúc bảng cho bảng `MenuDetails`
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
-- Đang đổ dữ liệu cho bảng `MenuDetails`
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
-- Cấu trúc bảng cho bảng `Menus`
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
-- Đang đổ dữ liệu cho bảng `Menus`
--

INSERT INTO `Menus` (`MenuID`, `ClassID`, `WeekNumber`, `Year`, `MenuName`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, 27, 2026, 'Thực đơn tuần 27 - Năng lượng ngày hè', 1783296000, 1783050741),
(2, 1, 28, 2026, 'Thực đơn tuần 28 - Đề kháng khỏe mạnh', 1783296000, 1783050741),
(3, 1, 29, 2026, 'Thực đơn tuần 29 - Vitamin rực rỡ', 1783296000, 1783050741),
(4, 1, 30, 2026, 'Thực đơn tuần 30 - Sức sống xanh', 1783296000, 1783050741);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `MonthlySchedules`
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
-- Đang đổ dữ liệu cho bảng `MonthlySchedules`
--

INSERT INTO `MonthlySchedules` (`MonthlyScheduleID`, `ClassID`, `Month`, `Year`, `MonthTheme`, `ApprovedStatus`, `IsActive`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, 7, 2026, 'MHX', 1, 1, 1783012593, 1783500460),
(2, 1, 8, 2026, 'Thu về', 0, 0, 1783471600, 1783471600);

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
-- Đang đổ dữ liệu cho bảng `Notifications`
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
(192, 6, 'Sắp đến hạn đóng học phí', 'Hóa đơn tháng 07-2026 của học sinh ID 19 (400.000đ) sắp đến hạn đóng. Vui lòng thanh toán sớm.', 'INVOICE_REMINDER', 1, 0, '{\"kind\": \"upcoming\", \"type\": \"INVOICE_REMINDER\", \"invoiceId\": \"50\", \"studentId\": \"19\"}', 1783386000, 1783431869),
(193, 18, 'Sắp đến hạn đóng học phí', 'Hóa đơn tháng 07-2026 của học sinh ID 19 (400.000đ) sắp đến hạn đóng. Vui lòng thanh toán sớm.', 'INVOICE_REMINDER', 0, 0, '{\"kind\": \"upcoming\", \"type\": \"INVOICE_REMINDER\", \"invoiceId\": \"50\", \"studentId\": \"19\"}', 1783386000, 1783386000),
(194, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"1\"}', 1783403352, 1783403352),
(196, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"3\", \"studentId\": \"1\"}', 1783403399, 1783403399),
(198, 6, 'Thông báo Điểm danh', 'Bé Bùi Khánh Linh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430442, 1783430442),
(199, 4, 'Thông báo Điểm danh', 'Bé Bùi Minh Quang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(200, 4, 'Thông báo Điểm danh', 'Bé Đặng Anh Khoa vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(201, 4, 'Thông báo Điểm danh', 'Bé Đặng Quang Minh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(202, 4, 'Thông báo Điểm danh', 'Bé Đỗ Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(203, 6, 'Thông báo Điểm danh', 'Bé Hoàng Thu Thủy vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(204, 6, 'Thông báo Điểm danh', 'Bé Bùi Khánh Linh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(205, 4, 'Thông báo Điểm danh', 'Bé Lê Hải Đăng vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(207, 6, 'Thông báo Điểm danh', 'Bé Lý Nhã Phương vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430443, 1783430443),
(208, 4, 'Thông báo Điểm danh', 'Bé Bùi Minh Quang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(209, 4, 'Thông báo Điểm danh', 'Bé Đặng Anh Khoa vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(210, 4, 'Thông báo Điểm danh', 'Bé Đặng Quang Minh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(211, 6, 'Thông báo Điểm danh', 'Bé Lý Thảo Nguyên vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(212, 4, 'Thông báo Điểm danh', 'Bé Đỗ Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(213, 6, 'Thông báo Điểm danh', 'Bé Hoàng Thu Thủy vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(214, 4, 'Thông báo Điểm danh', 'Bé Lê Hải Đăng vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(216, 6, 'Thông báo Điểm danh', 'Bé Lý Nhã Phương vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430444, 1783430444),
(217, 6, 'Thông báo Điểm danh', 'Bé Lý Thảo Nguyên vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(218, 4, 'Thông báo Điểm danh', 'Bé Ngô Gia Khiêm vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(219, 4, 'Thông báo Điểm danh', 'Bé Nguyễn Gia Bảo vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(220, 6, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Chánh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(221, 4, 'Thông báo Điểm danh', 'Bé Ngô Gia Khiêm vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(222, 4, 'Thông báo Điểm danh', 'Bé Nguyễn Gia Bảo vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(223, 18, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Chánh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(224, 6, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Chánh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(225, 4, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(226, 17, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430445, 1783430445),
(227, 6, 'Thông báo Điểm danh', 'Bé Phạm Ngọc Diệp vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(228, 18, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Chánh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(229, 4, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(230, 17, 'Thông báo Điểm danh', 'Bé Nguyễn Minh Khang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(231, 6, 'Thông báo Điểm danh', 'Bé Phạm Ngọc Diệp vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(232, 6, 'Thông báo Điểm danh', 'Bé Phạm Tường Vy vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(233, 4, 'Thông báo Điểm danh', 'Bé Phan Anh Tuấn vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(234, 6, 'Thông báo Điểm danh', 'Bé Phạm Tường Vy vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430446, 1783430446),
(235, 6, 'Thông báo Điểm danh', 'Bé Trần Minh Anh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430447, 1783430447),
(236, 4, 'Thông báo Điểm danh', 'Bé Phan Anh Tuấn vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430447, 1783430447),
(237, 6, 'Thông báo Điểm danh', 'Bé Trần Minh Anh vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430447, 1783430447),
(238, 6, 'Thông báo Điểm danh', 'Bé Trương Mỹ Tâm vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430447, 1783430447),
(239, 6, 'Thông báo Điểm danh', 'Bé Trương Mỹ Tâm vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430448, 1783430448),
(240, 4, 'Thông báo Điểm danh', 'Bé Vũ Hoàng Long vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430448, 1783430448),
(241, 4, 'Thông báo Điểm danh', 'Bé Vũ Trường Giang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430448, 1783430448),
(242, 4, 'Thông báo Điểm danh', 'Bé Vũ Hoàng Long vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430453, 1783430453),
(243, 4, 'Thông báo Điểm danh', 'Bé Vũ Trường Giang vắng mặt ngày hôm nay (Vắng mặt không phép). Vui lòng kiểm tra và liên hệ giáo viên nếu cần thiết.', 'ATTENDANCE', 0, 0, '{\"date\": \"1783296000\", \"type\": \"ATTENDANCE\"}', 1783430453, 1783430453),
(244, 4, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"3\"}', 1783430495, 1783430495),
(245, 17, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"3\"}', 1783430495, 1783434126),
(246, 6, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Chánh đã được duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"2\"}', 1783431121, 1783431843),
(247, 18, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Chánh đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"2\"}', 1783431122, 1783431122),
(248, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"4\", \"studentId\": \"1\"}', 1783433378, 1783433378),
(250, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"5\", \"studentId\": \"1\"}', 1783433667, 1783433667),
(252, 4, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"5\"}', 1783433764, 1783433764),
(253, 17, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"5\"}', 1783433764, 1783433922),
(254, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"2\"}', 1783477216, 1783477216),
(255, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"3\"}', 1783477283, 1783477283),
(256, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"4\"}', 1783484327, 1783484327),
(257, 5, 'Dặn dò thuốc mới', 'Bé Trương Mỹ Tâm (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"121\", \"medRequestId\": \"5\"}', 1783484852, 1783484852);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `NotificationSettings`
--

CREATE TABLE `NotificationSettings` (
  `UserID` int NOT NULL,
  `EmailEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `PushEnabled` tinyint(1) NOT NULL DEFAULT '1',
  `WeeklyReportEnabled` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `NotificationSettings`
--

INSERT INTO `NotificationSettings` (`UserID`, `EmailEnabled`, `PushEnabled`, `WeeklyReportEnabled`) VALUES
(5, 1, 1, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `Parents`
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
-- Đang đổ dữ liệu cho bảng `Parents`
--

INSERT INTO `Parents` (`ParentID`, `FullName`, `DateOfBirth`, `PhoneNumber`, `Email`, `IDCard`, `Job`, `Address`, `AvatarURL`) VALUES
(4, 'Nguyễn Anh Tuấn', NULL, '0911111111', 'tuan.nguyen@gmail.com', NULL, 'Kỹ sư', '65 Huỳnh Thúc Kháng, Q1', NULL),
(6, 'Cristiano Penaldo', 1118880000, '086655189', 'hocong.danh16@gmail.com', '07020002832', 'Vấp cỏ', 'Portugal', 'https://media.kindercare.app/parents/parents-profile-avatar/1783137802637-818712169.jpg'),
(17, 'Lê Minh Tuấn', NULL, '09887795', 'minhtuan.le@gmail.com', '079088001234', 'Kiến', '102 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'https://media.kindercare.app/parents/parents-profile-avatar/1783101456872-56629479.jpg'),
(18, 'Pessi', NULL, '012345678', 'pessi@gmail.com', '2131231', 'Đi bộ', 'Argentina', 'https://media.kindercare.app/parents/parents-profile-avatar/images.jpg');

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
(16, 'Hồ Công Danh', '0866551849', 'hocong.danh16@gmail.com');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `ProxyAuthorizations`
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
-- Cấu trúc bảng cho bảng `RewardBadges`
--

CREATE TABLE `RewardBadges` (
  `BadgeID` int NOT NULL,
  `BadgeName` varchar(100) NOT NULL,
  `BadgeImageURL` varchar(255) DEFAULT NULL,
  `CriteriaType` enum('WEEKLY','MONTHLY','SPECIAL') NOT NULL DEFAULT 'WEEKLY'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `RewardBadges`
--

INSERT INTO `RewardBadges` (`BadgeID`, `BadgeName`, `BadgeImageURL`, `CriteriaType`) VALUES
(1, 'Bé Ngoan Cuối Tuần', 'https://cdn-icons-png.flaticon.com/512/3237/3237155.png', 'WEEKLY'),
(2, 'Bé Ăn Ngoan', 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', 'WEEKLY'),
(3, 'Bé Ngủ Ngoan', 'https://cdn-icons-png.flaticon.com/512/3094/3094836.png', 'WEEKLY');

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

--
-- Đang đổ dữ liệu cho bảng `StudentAssessments`
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
-- Cấu trúc bảng cho bảng `StudentBadges`
--

CREATE TABLE `StudentBadges` (
  `StudentBadgeID` int NOT NULL,
  `StudentID` int NOT NULL,
  `BadgeID` int NOT NULL,
  `DateEarned` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
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
  `Status` varchar(20) DEFAULT 'Active',
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `InvoiceID` int DEFAULT NULL,
  `ActivatedAt` bigint DEFAULT NULL,
  `FeeRefunded` tinyint(1) NOT NULL DEFAULT '0'
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
-- Cấu trúc bảng cho bảng `StudentTuitionPlans`
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
(5, 'Lê Quang Huy', NULL, NULL, NULL, NULL, NULL, NULL, 'Hạng II', 'Active');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `TeacherWorkHistories`
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
-- Đang đổ dữ liệu cho bảng `TeacherWorkHistories`
--

INSERT INTO `TeacherWorkHistories` (`HistoryID`, `TeacherID`, `Title`, `Tag`, `Description`, `Kind`, `EventDate`) VALUES
(1, 5, 'Thăng hạng Giáo viên Hạng II', 'Thăng hạng', 'Được xét thăng từ Giáo viên Hạng III lên Hạng II sau kỳ đánh giá năng lực xuất sắc.', 'up', 1754006400),
(2, 5, 'Giáo viên chủ nhiệm Lớp Mầm 1', 'Bổ nhiệm', 'Được phân công làm giáo viên chính phụ trách lớp Mầm 1, cơ sở 1.', 'role', 1725148800),
(3, 5, 'Hoàn thành tập huấn Montessori', 'Chứng chỉ', 'Đạt chứng chỉ phương pháp giáo dục Montessori cấp độ cơ bản.', 'cert', 1677628800),
(4, 5, 'Gia nhập KinderCare', 'Bắt đầu', 'Bắt đầu công tác tại hệ thống mầm non KinderCare với vị trí Giáo viên Hạng III.', 'start', 1659312000);

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

INSERT INTO `Users` (`UserID`, `Username`, `PasswordHash`, `RoleID`, `Status`, `AvatarURL`, `ResetPasswordToken`, `TokenExpiry`, `ReceiveEmailNotif`, `ReceivePushNotif`) VALUES
(1, 'admin_it', 'hash_pass', 1, 'Active', NULL, NULL, NULL, 1, 1),
(2, 'hieutruong_mai', 'hash_pass', 2, 'Active', NULL, NULL, NULL, 1, 1),
(4, 'ph_tuan', '$2a$12$iWf2E00ASg54.I3mqkNCgOAGwuNK38VGkW3y.5wxCad2GopnYTjr6', 4, 'Active', NULL, NULL, NULL, 1, 1),
(5, 'gv_quanghuy', '$2a$12$5BtJO/BxEiWdpbaqpCzrUOlLqWbQUhQcrmkq.bjBSARw87d1LH5W.', 3, 'Active', 'https://media.kindercare.app/daily-albums/album-2026-07-08/1783470006392-96394052.jpg', NULL, NULL, 1, 1),
(6, 'hcngdanh', '$2a$12$epWjmzy4HcLKv/Nx51.d4egjrBbKKg6ArRh36fJrgzNz5FkQrsajG', 4, 'Active', NULL, NULL, NULL, 1, 1),
(16, 'hcdanh', '$2a$12$hdu8JdRaTJnMqNH9ZMqWh.YoEZu4LvYVtaO3Mgm/CFyIOJcGZ8dfC', 2, 'Active', NULL, NULL, NULL, 1, 1),
(17, 'ph_minhtuan', '$2b$12$ocdnHByhLtdQVbU/YeI7K.wvAR26SUPY5SM2Vv0ayPZDtoXtDKtrO', 4, 'Active', NULL, NULL, NULL, 1, 1),
(18, 'messi', '$2a$12$l53LrmB.CSzxq//px5RQGu3nmHGEXJfDFOSsj1Sn85JsEhLJ0zFIy', 4, 'Active', 'https://media.kindercare.app/parents/parents-profile-avatar/images.jpg', NULL, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `WeeklyRewards`
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
-- Cấu trúc bảng cho bảng `WeeklyScheduleDetails`
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
  `ActivityType` enum('pickup','meal','study','nap','play','dropoff','other') DEFAULT 'study',
  `OrderIndex` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `WeeklyScheduleDetails`
--

INSERT INTO `WeeklyScheduleDetails` (`ScheduleDetailID`, `WeeklyScheduleID`, `DayOfWeek`, `StartTime`, `EndTime`, `ActivityName`, `Details`, `Location`, `ActivityType`, `OrderIndex`) VALUES
(161, 5, 'Monday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 0),
(162, 5, 'Monday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 1),
(163, 5, 'Monday', '09:00:00', '10:15:00', 'Học tập tạo hình', 'Vẽ tranh chân dung tự họa của bé', 'Lớp học', 'study', 2),
(164, 5, 'Monday', '10:15:00', '11:15:00', 'Vui chơi tự do', 'Vui chơi vận động ngoài trời với bóng', 'Sân trường', 'play', 3),
(165, 5, 'Monday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 4),
(166, 5, 'Monday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 5),
(167, 5, 'Monday', '14:30:00', '16:00:00', 'Hoạt động chiều', 'Đọc truyện tranh và học các bài thơ thiếu nhi', 'Lớp học', 'study', 6),
(168, 5, 'Monday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 7),
(169, 5, 'Tuesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 8),
(170, 5, 'Tuesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 9),
(171, 5, 'Tuesday', '09:00:00', '10:15:00', 'Học nhận biết chữ cái', 'Bé làm quen và tô màu chữ cái A - B - C', 'Lớp học', 'study', 10),
(172, 5, 'Tuesday', '10:15:00', '11:15:00', 'Chơi trò chơi dân gian', 'Chơi trò chơi kéo co và bịt mắt bắt dê', 'Sân trường', 'play', 11),
(173, 5, 'Tuesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 12),
(174, 5, 'Tuesday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 13),
(175, 5, 'Tuesday', '14:30:00', '16:00:00', 'Kỹ năng sống', 'Cô hướng dẫn bé cách tự sắp xếp balo và xếp quần áo', 'Lớp học', 'study', 14),
(176, 5, 'Tuesday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 15),
(177, 5, 'Wednesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 16),
(178, 5, 'Wednesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 17),
(179, 5, 'Wednesday', '09:00:00', '10:15:00', 'Tiếng Anh vui vẻ', 'Làm quen từ vựng chủ đề các bộ phận cơ thể bằng Tiếng Anh', 'Lớp học', 'study', 18),
(180, 5, 'Wednesday', '10:15:00', '11:15:00', 'Trải nghiệm khoa học', 'Quan sát thí nghiệm sự chìm nổi của vật thể', 'Sân trường', 'play', 19),
(181, 5, 'Wednesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 20),
(182, 5, 'Wednesday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 21),
(183, 5, 'Wednesday', '14:30:00', '16:00:00', 'Kể chuyện bé nghe', 'Cô kể chuyện ngụ ngôn Rùa và Thỏ rút ra bài học', 'Lớp học', 'study', 22),
(184, 5, 'Wednesday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 23),
(185, 5, 'Thursday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 24),
(186, 5, 'Thursday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 25),
(187, 5, 'Thursday', '09:00:00', '10:15:00', 'Làm quen toán học', 'Nhận biết hình dáng và tập đếm số từ 1 đến 10', 'Lớp học', 'study', 26),
(188, 5, 'Thursday', '10:15:00', '11:15:00', 'Vẽ tranh tự do', 'Bé tô màu tranh vẽ phong cảnh thiên nhiên mùa hè', 'Sân trường', 'play', 27),
(189, 5, 'Thursday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 28),
(190, 5, 'Thursday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 29),
(191, 5, 'Thursday', '14:30:00', '16:00:00', 'Âm nhạc rộn ràng', 'Tập múa hát bài Cháu yêu bà đầy vui nhộn', 'Lớp học', 'study', 30),
(192, 5, 'Thursday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 31),
(193, 5, 'Friday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 32),
(194, 5, 'Friday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 33),
(195, 5, 'Friday', '09:00:00', '10:15:00', 'Khám phá thiên nhiên', 'Đi dạo sân trường nhặt và nhận biết các loại lá cây', 'Sân trường', 'study', 34),
(196, 5, 'Friday', '10:15:00', '11:15:00', 'Hoạt động góc', 'Tự do chơi lắp ghép và đóng vai bác sĩ đầu bếp', 'Lớp học', 'play', 35),
(197, 5, 'Friday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 36),
(198, 5, 'Friday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 37),
(199, 5, 'Friday', '14:30:00', '16:00:00', 'Bé ngoan cuối tuần', 'Tổng kết tuần trao cờ bé ngoan và phát quà bánh', 'Lớp học', 'other', 38),
(200, 5, 'Friday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 39),
(201, 6, 'Monday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 0),
(202, 6, 'Monday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 1),
(203, 6, 'Monday', '09:00:00', '10:15:00', 'Học tập tạo hình', 'Vẽ tranh chân dung gia đình em', 'Lớp học', 'study', 2),
(204, 6, 'Monday', '10:15:00', '11:15:00', 'Vui chơi tự do', 'Vui chơi vận động ngoài trời với bóng', 'Sân trường', 'play', 3),
(205, 6, 'Monday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 4),
(206, 6, 'Monday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 5),
(207, 6, 'Monday', '14:30:00', '16:00:00', 'Hoạt động chiều', 'Đọc truyện tranh và học các bài thơ thiếu nhi', 'Lớp học', 'study', 6),
(208, 6, 'Monday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 7),
(209, 6, 'Tuesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 8),
(210, 6, 'Tuesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 9),
(211, 6, 'Tuesday', '09:00:00', '10:15:00', 'Học nhận biết chữ cái', 'Bé làm quen và tô màu chữ cái D - Đ - E', 'Lớp học', 'study', 10),
(212, 6, 'Tuesday', '10:15:00', '11:15:00', 'Chơi trò chơi dân gian', 'Chơi trò chơi nhảy bao bố và rồng rắn lên mây', 'Sân trường', 'play', 11),
(213, 6, 'Tuesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 12),
(214, 6, 'Tuesday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 13),
(215, 6, 'Tuesday', '14:30:00', '16:00:00', 'Kỹ năng sống', 'Cô hướng dẫn bé cách thu dọn đồ chơi sau khi chơi xong', 'Lớp học', 'study', 14),
(216, 6, 'Tuesday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 15),
(217, 6, 'Wednesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 16),
(218, 6, 'Wednesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 17),
(219, 6, 'Wednesday', '09:00:00', '10:15:00', 'Tiếng Anh vui vẻ', 'Làm quen từ vựng chủ đề các thành viên trong gia đình bằng Tiếng Anh', 'Lớp học', 'study', 18),
(220, 6, 'Wednesday', '10:15:00', '11:15:00', 'Trải nghiệm khoa học', 'Quan sát thí nghiệm sự đổi màu của nước cải tím', 'Sân trường', 'play', 19),
(221, 6, 'Wednesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 20),
(222, 6, 'Wednesday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 21),
(223, 6, 'Wednesday', '14:30:00', '16:00:00', 'Kể chuyện bé nghe', 'Cô kể chuyện Ba chú heo con rút ra bài học', 'Lớp học', 'study', 22),
(224, 6, 'Wednesday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 23),
(225, 6, 'Thursday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 24),
(226, 6, 'Thursday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 25),
(227, 6, 'Thursday', '09:00:00', '10:15:00', 'Làm quen toán học', 'Nhận biết to nhỏ cao thấp và tập đếm số từ 11 đến 20', 'Lớp học', 'study', 26),
(228, 6, 'Thursday', '10:15:00', '11:15:00', 'Vẽ tranh tự do', 'Bé vẽ tranh tặng mẹ nhân ngày kỷ niệm', 'Sân trường', 'play', 27),
(229, 6, 'Thursday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 28),
(230, 6, 'Thursday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 29),
(231, 6, 'Thursday', '14:30:00', '16:00:00', 'Âm nhạc rộn ràng', 'Tập múa hát bài Cả nhà thương nhau đầy vui nhộn', 'Lớp học', 'study', 30),
(232, 6, 'Thursday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 31),
(233, 6, 'Friday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 32),
(234, 6, 'Friday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 33),
(235, 6, 'Friday', '09:00:00', '10:15:00', 'Khám phá thiên nhiên', 'Khám phá khu vườn trường và tưới cây xanh', 'Sân trường', 'study', 34),
(236, 6, 'Friday', '10:15:00', '11:15:00', 'Hoạt động góc', 'Tự do chơi lắp ghép và đóng vai bác sĩ đầu bếp', 'Lớp học', 'play', 35),
(237, 6, 'Friday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 36),
(238, 6, 'Friday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 37),
(239, 6, 'Friday', '14:30:00', '16:00:00', 'Bé ngoan cuối tuần', 'Tổng kết tuần trao cờ bé ngoan và phát quà bánh', 'Lớp học', 'other', 38),
(240, 6, 'Friday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 39),
(241, 7, 'Monday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 0),
(242, 7, 'Monday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 1),
(243, 7, 'Monday', '09:00:00', '10:15:00', 'Học tập tạo hình', 'Cắt dán và xếp hình ngôi nhà mơ ước', 'Lớp học', 'study', 2),
(244, 7, 'Monday', '10:15:00', '11:15:00', 'Vui chơi tự do', 'Vui chơi vận động ngoài trời với bóng', 'Sân trường', 'play', 3),
(245, 7, 'Monday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 4),
(246, 7, 'Monday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 5),
(247, 7, 'Monday', '14:30:00', '16:00:00', 'Hoạt động chiều', 'Đọc truyện tranh và học các bài thơ thiếu nhi', 'Lớp học', 'study', 6),
(248, 7, 'Monday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 7),
(249, 7, 'Tuesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 9),
(250, 7, 'Tuesday', '09:00:00', '10:15:00', 'Học nhận biết chữ cái', 'Bé làm quen và tô màu chữ cái G - H - I', 'Lớp học', 'study', 10),
(251, 7, 'Tuesday', '10:15:00', '11:15:00', 'Chơi trò chơi dân gian', 'Chơi trò chơi nhảy lò cò và chi chi chành chành', 'Sân trường', 'play', 11),
(252, 7, 'Tuesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 12),
(253, 7, 'Tuesday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 13),
(254, 7, 'Tuesday', '14:30:00', '16:00:00', 'Kỹ năng sống', 'Cô hướng dẫn bé cách tự mang giày và dép quai hậu', 'Lớp học', 'study', 14),
(255, 7, 'Tuesday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 15),
(256, 7, 'Wednesday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 16),
(257, 7, 'Wednesday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 17),
(258, 7, 'Wednesday', '09:00:00', '10:15:00', 'Tiếng Anh vui vẻ', 'Làm quen từ vựng chủ đề các vật dụng trong nhà bằng Tiếng Anh', 'Lớp học', 'study', 18),
(259, 7, 'Wednesday', '10:15:00', '11:15:00', 'Trải nghiệm khoa học', 'Quan sát thí nghiệm sự hòa tan của đường muối trong nước', 'Sân trường', 'play', 19),
(260, 7, 'Wednesday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 20),
(261, 7, 'Wednesday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 21),
(262, 7, 'Wednesday', '14:30:00', '16:00:00', 'Kể chuyện bé nghe', 'Cô kể chuyện Cô bé bán diêm rút ra bài học nhân văn', 'Lớp học', 'study', 22),
(263, 7, 'Wednesday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 23),
(264, 7, 'Thursday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 24),
(265, 7, 'Thursday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 25),
(266, 7, 'Thursday', '09:00:00', '10:15:00', 'Làm quen toán học', 'Nhận biết các hình khối cơ bản: tròn', 'vuông', 'study', 26),
(267, 7, 'Thursday', '10:15:00', '11:15:00', 'Vẽ tranh tự do', 'Bé tô màu tranh vẽ ngôi nhà ấm áp của bé', 'Sân trường', 'play', 27),
(268, 7, 'Thursday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 28),
(269, 7, 'Thursday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 29),
(270, 7, 'Thursday', '14:30:00', '16:00:00', 'Âm nhạc rộn ràng', 'Tập múa hát bài Tổ ấm gia đình đầy vui nhộn', 'Lớp học', 'study', 30),
(271, 7, 'Thursday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 31),
(272, 7, 'Friday', '07:30:00', '08:30:00', 'Đón bé & Thể dục sáng', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 32),
(273, 7, 'Friday', '08:30:00', '09:00:00', 'Ăn sáng dinh dưỡng', 'Suất ăn sáng bổ dưỡng theo thực đơn', 'Phòng ăn', 'meal', 33),
(274, 7, 'Friday', '09:00:00', '10:15:00', 'Khám phá thiên nhiên', 'Đi dạo tìm hiểu các loài hoa trong khuôn viên trường', 'Sân trường', 'study', 34),
(275, 7, 'Friday', '10:15:00', '11:15:00', 'Hoạt động góc', 'Tự do chơi lắp ghép và đóng vai bác sĩ đầu bếp', 'Lớp học', 'play', 35),
(276, 7, 'Friday', '11:15:00', '14:00:00', 'Ăn trưa & Ngủ trưa', 'Cơm trưa bổ dưỡng và giấc ngủ trưa yên tĩnh', 'Phòng ngủ', 'nap', 36),
(277, 7, 'Friday', '14:00:00', '14:30:00', 'Ăn xế', 'Bánh ngọt sữa tươi hoặc trái cây theo ngày', 'Phòng ăn', 'meal', 37),
(278, 7, 'Friday', '14:30:00', '16:00:00', 'Bé ngoan cuối tuần', 'Tổng kết tuần trao cờ bé ngoan và phát quà bánh', 'Lớp học', 'other', 38),
(279, 7, 'Friday', '16:00:00', '17:00:00', 'Trả trẻ', 'Chuẩn bị quần áo và trả trẻ cho phụ huynh', 'Cổng A', 'dropoff', 39),
(280, 7, 'Tuesday', '07:30:00', '08:20:00', 'Đón bé & Thể dục sáng sớm', 'Cô đón bé tại cổng trường và tập thể dục sáng khởi động ngày mới', 'Sân trường', 'pickup', 8),
(321, 1, 'Monday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(322, 1, 'Monday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(323, 1, 'Monday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(324, 1, 'Monday', '09:00:00', '10:00:00', 'Học chữ', 'Bé học nhận biết chữ cái A', 'BPhòng học A', 'study', 0),
(325, 1, 'Monday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(326, 1, 'Monday', '10:30:00', '11:30:00', 'Vẽ tranh', 'Bé tô màu theo chủ đề', 'BPhòng học A', 'study', 0),
(327, 1, 'Monday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(328, 1, 'Monday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(329, 1, 'Monday', '13:30:00', '14:30:00', 'Hoạt động ngoài trời', 'Chơi ngoài sân vườn', 'Sân trường', 'play', 0),
(330, 1, 'Monday', '14:30:00', '15:00:00', 'Học nhảy', 'Nhảy theo nhạc', 'BPhòng học A', 'study', 0),
(331, 1, 'Monday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(332, 1, 'Tuesday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(333, 1, 'Tuesday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(334, 1, 'Tuesday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(335, 1, 'Tuesday', '09:00:00', '10:00:00', 'Học số', 'Bé học đếm số từ 1-10', 'BPhòng học A', 'study', 0),
(336, 1, 'Tuesday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(337, 1, 'Tuesday', '10:30:00', '11:30:00', 'Âm nhạc', 'Nghe nhạc và hát theo', 'BPhòng học A', 'study', 0),
(338, 1, 'Tuesday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(339, 1, 'Tuesday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(340, 1, 'Tuesday', '13:30:00', '14:30:00', 'Xếp hình', 'Luyện tập xếp hình Block', 'BPhòng học A', 'study', 0),
(341, 1, 'Tuesday', '14:30:00', '15:00:00', 'Kể chuyện', 'Giáo viên kể truyện', 'BPhòng học A', 'study', 0),
(342, 1, 'Tuesday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(343, 1, 'Wednesday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(344, 1, 'Wednesday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(345, 1, 'Wednesday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(346, 1, 'Wednesday', '09:00:00', '10:00:00', 'Thể dục', 'Bài tập thể dục buổi sáng', 'Sân trường', 'study', 0),
(347, 1, 'Wednesday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(348, 1, 'Wednesday', '10:30:00', '11:30:00', 'Tạo hình', 'Nặn đất sét theo ý thích', 'BPhòng học A', 'study', 0),
(349, 1, 'Wednesday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(350, 1, 'Wednesday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(351, 1, 'Wednesday', '13:30:00', '14:30:00', 'Sinh hoạt cùng cô', 'Thảo luận chủ đề tuần', 'BPhòng học A', 'study', 0),
(352, 1, 'Wednesday', '14:30:00', '15:00:00', 'Hoạt động ngoài trời', 'Chơi ngoài sân vườn', 'Sân trường', 'play', 0),
(353, 1, 'Wednesday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(354, 1, 'Thursday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(355, 1, 'Thursday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(356, 1, 'Thursday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(357, 1, 'Thursday', '09:00:00', '10:00:00', 'Học tiếng Anh', 'Từ vựng cơ bản cho bé', 'BPhòng học A', 'study', 0),
(358, 1, 'Thursday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(359, 1, 'Thursday', '10:30:00', '11:30:00', 'Trò chơi vận động', 'Chạy nhảy theo nhạc', 'Sân trường', 'play', 0),
(360, 1, 'Thursday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(361, 1, 'Thursday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(362, 1, 'Thursday', '13:30:00', '14:30:00', 'Vẽ tranh', 'Tô màu theo chủ đề mùa hè', 'BPhòng học A', 'study', 0),
(363, 1, 'Thursday', '14:30:00', '15:00:00', 'Xếp hình', 'Luyện tập xếp hình Block', 'BPhòng học A', 'study', 0),
(364, 1, 'Thursday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(365, 1, 'Friday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(366, 1, 'Friday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(367, 1, 'Friday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(368, 1, 'Friday', '09:00:00', '10:00:00', 'Sinh hoạt tập thể', 'Thảo luận và chia sẻ cùng nhau', 'BPhòng học A', 'study', 0),
(369, 1, 'Friday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(370, 1, 'Friday', '10:30:00', '11:30:00', 'Kiểm tra cuối tuần', 'Ôn tập và trò chơi tổng kết', 'BPhòng học A', 'study', 0),
(371, 1, 'Friday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(372, 1, 'Friday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(373, 1, 'Friday', '13:30:00', '14:30:00', 'Biểu diễn văn nghệ', 'Trình diễn bài hát múa', 'Sân trường', 'play', 0),
(374, 1, 'Friday', '14:30:00', '15:00:00', 'Trao đổi với phụ huynh', 'Gửi nhận trẻ và trao đổi tình hình', 'Cổng trường', 'other', 0),
(375, 1, 'Friday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(376, 2, 'Monday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(377, 2, 'Monday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(378, 2, 'Monday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(379, 2, 'Monday', '09:00:00', '10:00:00', 'Học chữ', 'Bé học nhận biết chữ cái B', 'BPhòng học A', 'study', 0),
(380, 2, 'Monday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(381, 2, 'Monday', '10:30:00', '11:30:00', 'Vẽ tranh', 'Bé tô màu theo chủ đề', 'BPhòng học A', 'study', 0),
(382, 2, 'Monday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(383, 2, 'Monday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(384, 2, 'Monday', '13:30:00', '14:30:00', 'Hoạt động ngoài trời', 'Chơi ngoài sân vườn', 'Sân trường', 'play', 0),
(385, 2, 'Monday', '14:30:00', '15:00:00', 'Học nhảy', 'Nhảy theo nhạc', 'BPhòng học A', 'study', 0),
(386, 2, 'Monday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(387, 2, 'Tuesday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(388, 2, 'Tuesday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(389, 2, 'Tuesday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(390, 2, 'Tuesday', '09:00:00', '10:00:00', 'Học số', 'Bé học đếm số từ 11-20', 'BPhòng học A', 'study', 0),
(391, 2, 'Tuesday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(392, 2, 'Tuesday', '10:30:00', '11:30:00', 'Âm nhạc', 'Nghe nhạc và hát theo', 'BPhòng học A', 'study', 0),
(393, 2, 'Tuesday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(394, 2, 'Tuesday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(395, 2, 'Tuesday', '13:30:00', '14:30:00', 'Xếp hình', 'Luyện tập xếp hình Block', 'BPhòng học A', 'study', 0),
(396, 2, 'Tuesday', '14:30:00', '15:00:00', 'Kể chuyện', 'Giáo viên kể truyện', 'BPhòng học A', 'study', 0),
(397, 2, 'Tuesday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(398, 2, 'Wednesday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(399, 2, 'Wednesday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(400, 2, 'Wednesday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(401, 2, 'Wednesday', '09:00:00', '10:00:00', 'Thể dục', 'Bài tập thể dục buổi sáng', 'Sân trường', 'study', 0),
(402, 2, 'Wednesday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(403, 2, 'Wednesday', '10:30:00', '11:30:00', 'Tạo hình', 'Nặn đất sét theo ý thích', 'BPhòng học A', 'study', 0),
(404, 2, 'Wednesday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(405, 2, 'Wednesday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(406, 2, 'Wednesday', '13:30:00', '14:30:00', 'Sinh hoạt cùng cô', 'Thảo luận chủ đề tuần', 'BPhòng học A', 'study', 0),
(407, 2, 'Wednesday', '14:30:00', '15:00:00', 'Hoạt động ngoài trời', 'Chơi ngoài sân vườn', 'Sân trường', 'play', 0),
(408, 2, 'Wednesday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(409, 2, 'Thursday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(410, 2, 'Thursday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(411, 2, 'Thursday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(412, 2, 'Thursday', '09:00:00', '10:00:00', 'Học tiếng Anh', 'Từ vựng cơ bản cho bé', 'BPhòng học A', 'study', 0),
(413, 2, 'Thursday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(414, 2, 'Thursday', '10:30:00', '11:30:00', 'Trò chơi vận động', 'Chạy nhảy theo nhạc', 'Sân trường', 'play', 0),
(415, 2, 'Thursday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(416, 2, 'Thursday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(417, 2, 'Thursday', '13:30:00', '14:30:00', 'Vẽ tranh', 'Tô màu theo chủ đề mùa hè', 'BPhòng học A', 'study', 0),
(418, 2, 'Thursday', '14:30:00', '15:00:00', 'Xếp hình', 'Luyện tập xếp hình Block', 'BPhòng học A', 'study', 0),
(419, 2, 'Thursday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(420, 2, 'Friday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(421, 2, 'Friday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(422, 2, 'Friday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(423, 2, 'Friday', '09:00:00', '10:00:00', 'Sinh hoạt tập thể', 'Thảo luận và chia sẻ cùng nhau', 'BPhòng học A', 'study', 0),
(424, 2, 'Friday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(425, 2, 'Friday', '10:30:00', '11:30:00', 'Kiểm tra cuối tuần', 'Ôn tập và trò chơi tổng kết', 'BPhòng học A', 'study', 0),
(426, 2, 'Friday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(427, 2, 'Friday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(428, 2, 'Friday', '13:30:00', '14:30:00', 'Biểu diễn văn nghệ', 'Trình diễn bài hát múa', 'Sân trường', 'play', 0),
(429, 2, 'Friday', '14:30:00', '15:00:00', 'Trao đổi với phụ huynh', 'Gửi nhận trẻ và trao đổi tình hình', 'Cổng trường', 'other', 0),
(430, 2, 'Friday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(431, 3, 'Monday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(432, 3, 'Monday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(433, 3, 'Monday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(434, 3, 'Monday', '09:00:00', '10:00:00', 'Học chữ', 'Bé học nhận biết chữ cái C', 'BPhòng học A', 'study', 0),
(435, 3, 'Monday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(436, 3, 'Monday', '10:30:00', '11:30:00', 'Vẽ tranh', 'Bé tô màu theo chủ đề', 'BPhòng học A', 'study', 0),
(437, 3, 'Monday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(438, 3, 'Monday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(439, 3, 'Monday', '13:30:00', '14:30:00', 'Hoạt động ngoài trời', 'Chơi ngoài sân vườn', 'Sân trường', 'play', 0),
(440, 3, 'Monday', '14:30:00', '15:00:00', 'Học nhảy', 'Nhảy theo nhạc', 'BPhòng học A', 'study', 0),
(441, 3, 'Monday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(442, 3, 'Tuesday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(443, 3, 'Tuesday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(444, 3, 'Tuesday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(445, 3, 'Tuesday', '09:00:00', '10:00:00', 'Học số', 'Bé học đếm số từ 21-30', 'BPhòng học A', 'study', 0),
(446, 3, 'Tuesday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(447, 3, 'Tuesday', '10:30:00', '11:30:00', 'Âm nhạc', 'Nghe nhạc và hát theo', 'BPhòng học A', 'study', 0),
(448, 3, 'Tuesday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(449, 3, 'Tuesday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(450, 3, 'Tuesday', '13:30:00', '14:30:00', 'Xếp hình', 'Luyện tập xếp hình Block', 'BPhòng học A', 'study', 0),
(451, 3, 'Tuesday', '14:30:00', '15:00:00', 'Kể chuyện', 'Giáo viên kể truyện', 'BPhòng học A', 'study', 0),
(452, 3, 'Tuesday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(453, 3, 'Wednesday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(454, 3, 'Wednesday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(455, 3, 'Wednesday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(456, 3, 'Wednesday', '09:00:00', '10:00:00', 'Thể dục', 'Bài tập thể dục buổi sáng', 'Sân trường', 'study', 0),
(457, 3, 'Wednesday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(458, 3, 'Wednesday', '10:30:00', '11:30:00', 'Tạo hình', 'Nặn đất sét theo ý thích', 'BPhòng học A', 'study', 0),
(459, 3, 'Wednesday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(460, 3, 'Wednesday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(461, 3, 'Wednesday', '13:30:00', '14:30:00', 'Sinh hoạt cùng cô', 'Thảo luận chủ đề tuần', 'BPhòng học A', 'study', 0),
(462, 3, 'Wednesday', '14:30:00', '15:00:00', 'Hoạt động ngoài trời', 'Chơi ngoài sân vườn', 'Sân trường', 'play', 0),
(463, 3, 'Wednesday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(464, 3, 'Thursday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(465, 3, 'Thursday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(466, 3, 'Thursday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(467, 3, 'Thursday', '09:00:00', '10:00:00', 'Học tiếng Anh', 'Từ vựng cơ bản cho bé', 'BPhòng học A', 'study', 0),
(468, 3, 'Thursday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(469, 3, 'Thursday', '10:30:00', '11:30:00', 'Trò chơi vận động', 'Chạy nhảy theo nhạc', 'Sân trường', 'play', 0),
(470, 3, 'Thursday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(471, 3, 'Thursday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(472, 3, 'Thursday', '13:30:00', '14:30:00', 'Vẽ tranh', 'Tô màu theo chủ đề mùa hè', 'BPhòng học A', 'study', 0),
(473, 3, 'Thursday', '14:30:00', '15:00:00', 'Xếp hình', 'Luyện tập xếp hình Block', 'BPhòng học A', 'study', 0),
(474, 3, 'Thursday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(475, 3, 'Friday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(476, 3, 'Friday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(477, 3, 'Friday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(478, 3, 'Friday', '09:00:00', '10:00:00', 'Sinh hoạt tập thể', 'Thảo luận và chia sẻ cùng nhau', 'BPhòng học A', 'study', 0),
(479, 3, 'Friday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(480, 3, 'Friday', '10:30:00', '11:30:00', 'Kiểm tra cuối tuần', 'Ôn tập và trò chơi tổng kết', 'BPhòng học A', 'study', 0),
(481, 3, 'Friday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(482, 3, 'Friday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(483, 3, 'Friday', '13:30:00', '14:30:00', 'Biểu diễn văn nghệ', 'Trình diễn bài hát múa', 'Sân trường', 'play', 0),
(484, 3, 'Friday', '14:30:00', '15:00:00', 'Trao đổi với phụ huynh', 'Gửi nhận trẻ và trao đổi tình hình', 'Cổng trường', 'other', 0),
(485, 3, 'Friday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(486, 4, 'Monday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(487, 4, 'Monday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(488, 4, 'Monday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(489, 4, 'Monday', '09:00:00', '10:00:00', 'Học chữ', 'Bé học nhận biết chữ cái D', 'BPhòng học A', 'study', 0),
(490, 4, 'Monday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(491, 4, 'Monday', '10:30:00', '11:30:00', 'Vẽ tranh', 'Bé tô màu theo chủ đề', 'BPhòng học A', 'study', 0),
(492, 4, 'Monday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(493, 4, 'Monday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(494, 4, 'Monday', '13:30:00', '14:30:00', 'Hoạt động ngoài trời', 'Chơi ngoài sân vườn', 'Sân trường', 'play', 0),
(495, 4, 'Monday', '14:30:00', '15:00:00', 'Học nhảy', 'Nhảy theo nhạc', 'BPhòng học A', 'study', 0),
(496, 4, 'Monday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(497, 4, 'Tuesday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(498, 4, 'Tuesday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(499, 4, 'Tuesday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(500, 4, 'Tuesday', '09:00:00', '10:00:00', 'Học số', 'Bé học đếm số từ 31-40', 'BPhòng học A', 'study', 0),
(501, 4, 'Tuesday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(502, 4, 'Tuesday', '10:30:00', '11:30:00', 'Âm nhạc', 'Nghe nhạc và hát theo', 'BPhòng học A', 'study', 0),
(503, 4, 'Tuesday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(504, 4, 'Tuesday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(505, 4, 'Tuesday', '13:30:00', '14:30:00', 'Xếp hình', 'Luyện tập xếp hình Block', 'BPhòng học A', 'study', 0),
(506, 4, 'Tuesday', '14:30:00', '15:00:00', 'Kể chuyện', 'Giáo viên kể truyện', 'BPhòng học A', 'study', 0),
(507, 4, 'Tuesday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(508, 4, 'Wednesday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(509, 4, 'Wednesday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(510, 4, 'Wednesday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(511, 4, 'Wednesday', '09:00:00', '10:00:00', 'Thể dục', 'Bài tập thể dục buổi sáng', 'Sân trường', 'study', 0),
(512, 4, 'Wednesday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(513, 4, 'Wednesday', '10:30:00', '11:30:00', 'Tạo hình', 'Nặn đất sét theo ý thích', 'BPhòng học A', 'study', 0),
(514, 4, 'Wednesday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(515, 4, 'Wednesday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(516, 4, 'Wednesday', '13:30:00', '14:30:00', 'Sinh hoạt cùng cô', 'Thảo luận chủ đề tuần', 'BPhòng học A', 'study', 0),
(517, 4, 'Wednesday', '14:30:00', '15:00:00', 'Hoạt động ngoài trời', 'Chơi ngoài sân vườn', 'Sân trường', 'play', 0),
(518, 4, 'Wednesday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(519, 4, 'Thursday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(520, 4, 'Thursday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(521, 4, 'Thursday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(522, 4, 'Thursday', '09:00:00', '10:00:00', 'Học tiếng Anh', 'Từ vựng cơ bản cho bé', 'BPhòng học A', 'study', 0),
(523, 4, 'Thursday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(524, 4, 'Thursday', '10:30:00', '11:30:00', 'Trò chơi vận động', 'Chạy nhảy theo nhạc', 'Sân trường', 'play', 0),
(525, 4, 'Thursday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(526, 4, 'Thursday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(527, 4, 'Thursday', '13:30:00', '14:30:00', 'Vẽ tranh', 'Tô màu theo chủ đề mùa hè', 'BPhòng học A', 'study', 0),
(528, 4, 'Thursday', '14:30:00', '15:00:00', 'Xếp hình', 'Luyện tập xếp hình Block', 'BPhòng học A', 'study', 0),
(529, 4, 'Thursday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0),
(530, 4, 'Friday', '07:30:00', '08:00:00', 'Đón trẻ', 'Đón trẻ tại cổng trường', 'Cổng trường', 'pickup', 0),
(531, 4, 'Friday', '08:00:00', '08:30:00', 'Ăn sáng', 'Bữa sáng nhẹ', 'Nhà ăn', 'meal', 0),
(532, 4, 'Friday', '08:30:00', '09:00:00', 'Chơi tự do', 'Hoạt động vui chơi tự do', 'Sân chơi', 'play', 0),
(533, 4, 'Friday', '09:00:00', '10:00:00', 'Sinh hoạt tập thể', 'Thảo luận và chia sẻ cùng nhau', 'BPhòng học A', 'study', 0),
(534, 4, 'Friday', '10:00:00', '10:30:00', 'Ăn trưa nhẹ', 'Bữa ăn phụ giữa buổi', 'Nhà ăn', 'meal', 0),
(535, 4, 'Friday', '10:30:00', '11:30:00', 'Kiểm tra cuối tuần', 'Ôn tập và trò chơi tổng kết', 'BPhòng học A', 'study', 0),
(536, 4, 'Friday', '11:30:00', '13:00:00', 'Ngủ trưa', 'Ngủ trưa tại lớp', 'Phòng ngủ', 'nap', 0),
(537, 4, 'Friday', '13:00:00', '13:30:00', 'Ăn chiều', 'Bữa ăn chiều', 'Nhà ăn', 'meal', 0),
(538, 4, 'Friday', '13:30:00', '14:30:00', 'Biểu diễn văn nghệ', 'Trình diễn bài hát múa', 'Sân trường', 'play', 0),
(539, 4, 'Friday', '14:30:00', '15:00:00', 'Trao đổi với phụ huynh', 'Gửi nhận trẻ và trao đổi tình hình', 'Cổng trường', 'other', 0),
(540, 4, 'Friday', '15:00:00', '16:00:00', 'Trả trẻ', 'Đưa trẻ ra cổng', 'Cổng trường', 'dropoff', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `WeeklySchedules`
--

CREATE TABLE `WeeklySchedules` (
  `WeeklyScheduleID` int NOT NULL,
  `MonthlyScheduleID` int NOT NULL,
  `WeekOrder` int NOT NULL,
  `WeekTheme` varchar(255) NOT NULL,
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp()),
  `ApprovedStatus` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Đang đổ dữ liệu cho bảng `WeeklySchedules`
--

INSERT INTO `WeeklySchedules` (`WeeklyScheduleID`, `MonthlyScheduleID`, `WeekOrder`, `WeekTheme`, `CreatedAt`, `UpdatedAt`, `ApprovedStatus`) VALUES
(1, 1, 1, 'Tuần 1: Làm quen với biển cả (Sinh vật đại dương)', 1783012594, 1783497482, 0),
(2, 1, 2, 'Tuần 2: Những người bạn tí hon (Thế giới côn trùng)', 1783012594, 1783470776, 0),
(3, 1, 3, 'Tuần 3: Giai điệu mùa hè (Âm nhạc và vận động)', 1783012594, 1783470788, 0),
(4, 1, 4, 'Tuần 4: Sáng tạo cùng thiên nhiên (Bảo vệ môi trường)', 1783012594, 1783012594, 0),
(5, 2, 1, 'Tuần 1: Làm quen với rừng xanh (Sinh vật trong rừng)', 1783471617, 1783472756, 1),
(6, 2, 2, '', 1783472851, 1783472862, 1),
(7, 2, 3, 'Đi Du Lịch', 1783473202, 1783473239, 1);

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
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `FK_Attendances_CheckedInTeacher` (`CheckedInByTeacherID`),
  ADD KEY `FK_Attendances_CheckedOutTeacher` (`CheckedOutByTeacherID`),
  ADD KEY `FK_Attendances_Proxy` (`ProxyAuthorizationID`),
  ADD KEY `fk_dropped_off_parent` (`DroppedOffByParentID`),
  ADD KEY `fk_picked_up_parent` (`PickedUpByParentID`);

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
-- Chỉ mục cho bảng `DailyActivities`
--
ALTER TABLE `DailyActivities`
  ADD PRIMARY KEY (`ActivityID`),
  ADD UNIQUE KEY `Unique_Student_Date` (`StudentID`,`LogDate`);

--
-- Chỉ mục cho bảng `DailyAlbumPhotos`
--
ALTER TABLE `DailyAlbumPhotos`
  ADD PRIMARY KEY (`PhotoID`),
  ADD KEY `AlbumID` (`AlbumID`);

--
-- Chỉ mục cho bảng `DailyAlbums`
--
ALTER TABLE `DailyAlbums`
  ADD PRIMARY KEY (`AlbumID`),
  ADD KEY `ClassID` (`ClassID`),
  ADD KEY `TeacherID` (`TeacherID`),
  ADD KEY `idx_album_date` (`ClassID`,`AlbumDate`) COMMENT 'Tối ưu tốc độ tìm kiếm album theo lớp và ngày';

--
-- Chỉ mục cho bảng `DailyLessons`
--
ALTER TABLE `DailyLessons`
  ADD PRIMARY KEY (`LessonLogID`),
  ADD KEY `ClassID` (`ClassID`),
  ADD KEY `idx_class_lesson_date` (`ClassID`,`LessonDate`);

--
-- Chỉ mục cho bảng `DailySchedules`
--
ALTER TABLE `DailySchedules`
  ADD PRIMARY KEY (`DailyScheduleID`),
  ADD KEY `idx_class_date` (`ClassID`,`ScheduleDate`);

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
  ADD KEY `CreatedBy` (`CreatedBy`),
  ADD KEY `idx_events_time` (`StartTime`,`EndTime`);

--
-- Chỉ mục cho bảng `EventStudents`
--
ALTER TABLE `EventStudents`
  ADD PRIMARY KEY (`EventID`,`StudentID`),
  ADD KEY `FK_EventStudents_Students` (`StudentID`);

--
-- Chỉ mục cho bảng `Extracurriculars`
--
ALTER TABLE `Extracurriculars`
  ADD PRIMARY KEY (`ActivityID`);

--
-- Chỉ mục cho bảng `fcm_tokens`
--
ALTER TABLE `fcm_tokens`
  ADD PRIMARY KEY (`TokenID`),
  ADD UNIQUE KEY `idx_unique_user_token` (`UserID`,`DeviceToken`),
  ADD KEY `UserID` (`UserID`);

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
-- Chỉ mục cho bảng `Holidays`
--
ALTER TABLE `Holidays`
  ADD PRIMARY KEY (`HolidayID`),
  ADD KEY `idx_date` (`HolidayDate`);

--
-- Chỉ mục cho bảng `Invoices`
--
ALTER TABLE `Invoices`
  ADD PRIMARY KEY (`InvoiceID`),
  ADD UNIQUE KEY `uq_invoice` (`StudentID`,`BillingMonth`,`InvoiceType`),
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
-- Chỉ mục cho bảng `MenuDetails`
--
ALTER TABLE `MenuDetails`
  ADD PRIMARY KEY (`MenuDetailID`),
  ADD UNIQUE KEY `Unique_Menu_Day_Meal` (`MenuID`,`DayOfWeek`,`MealType`);

--
-- Chỉ mục cho bảng `Menus`
--
ALTER TABLE `Menus`
  ADD PRIMARY KEY (`MenuID`),
  ADD UNIQUE KEY `Unique_Class_Week_Year` (`ClassID`,`WeekNumber`,`Year`);

--
-- Chỉ mục cho bảng `MonthlySchedules`
--
ALTER TABLE `MonthlySchedules`
  ADD PRIMARY KEY (`MonthlyScheduleID`),
  ADD UNIQUE KEY `Unique_Class_Month_Year` (`ClassID`,`Month`,`Year`);

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
-- Chỉ mục cho bảng `NotificationSettings`
--
ALTER TABLE `NotificationSettings`
  ADD PRIMARY KEY (`UserID`);

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
-- Chỉ mục cho bảng `ProxyAuthorizations`
--
ALTER TABLE `ProxyAuthorizations`
  ADD PRIMARY KEY (`AuthorizationID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ParentID` (`ParentID`);

--
-- Chỉ mục cho bảng `RewardBadges`
--
ALTER TABLE `RewardBadges`
  ADD PRIMARY KEY (`BadgeID`);

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
-- Chỉ mục cho bảng `StudentBadges`
--
ALTER TABLE `StudentBadges`
  ADD PRIMARY KEY (`StudentBadgeID`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `BadgeID` (`BadgeID`);

--
-- Chỉ mục cho bảng `StudentExtracurriculars`
--
ALTER TABLE `StudentExtracurriculars`
  ADD PRIMARY KEY (`EnrollmentID`),
  ADD UNIQUE KEY `uq_student_activity_month` (`StudentID`,`ActivityID`,`RegisteredMonth`),
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ActivityID` (`ActivityID`),
  ADD KEY `SE_ibfk_invoice` (`InvoiceID`);

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
-- Chỉ mục cho bảng `StudentTuitionPlans`
--
ALTER TABLE `StudentTuitionPlans`
  ADD PRIMARY KEY (`PlanID`),
  ADD KEY `idx_student` (`StudentID`),
  ADD KEY `idx_package` (`PackageID`);

--
-- Chỉ mục cho bảng `Teachers`
--
ALTER TABLE `Teachers`
  ADD PRIMARY KEY (`TeacherID`);

--
-- Chỉ mục cho bảng `TeacherWorkHistories`
--
ALTER TABLE `TeacherWorkHistories`
  ADD PRIMARY KEY (`HistoryID`),
  ADD KEY `TeacherID` (`TeacherID`);

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
-- Chỉ mục cho bảng `WeeklyRewards`
--
ALTER TABLE `WeeklyRewards`
  ADD PRIMARY KEY (`RewardID`),
  ADD KEY `StudentID` (`StudentID`);

--
-- Chỉ mục cho bảng `WeeklyScheduleDetails`
--
ALTER TABLE `WeeklyScheduleDetails`
  ADD PRIMARY KEY (`ScheduleDetailID`),
  ADD KEY `idx_weekly_schedule_day` (`WeeklyScheduleID`,`DayOfWeek`);

--
-- Chỉ mục cho bảng `WeeklySchedules`
--
ALTER TABLE `WeeklySchedules`
  ADD PRIMARY KEY (`WeeklyScheduleID`),
  ADD UNIQUE KEY `Unique_Month_WeekOrder` (`MonthlyScheduleID`,`WeekOrder`);

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
  MODIFY `AttendanceID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=287;

--
-- AUTO_INCREMENT cho bảng `BaseFees`
--
ALTER TABLE `BaseFees`
  MODIFY `FeeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
  MODIFY `ClassID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `DailyActivities`
--
ALTER TABLE `DailyActivities`
  MODIFY `ActivityID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `DailyAlbumPhotos`
--
ALTER TABLE `DailyAlbumPhotos`
  MODIFY `PhotoID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3021;

--
-- AUTO_INCREMENT cho bảng `DailyAlbums`
--
ALTER TABLE `DailyAlbums`
  MODIFY `AlbumID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=301;

--
-- AUTO_INCREMENT cho bảng `DailyLessons`
--
ALTER TABLE `DailyLessons`
  MODIFY `LessonLogID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `DailySchedules`
--
ALTER TABLE `DailySchedules`
  MODIFY `DailyScheduleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=324;

--
-- AUTO_INCREMENT cho bảng `Events`
--
ALTER TABLE `Events`
  MODIFY `EventID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `Extracurriculars`
--
ALTER TABLE `Extracurriculars`
  MODIFY `ActivityID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `fcm_tokens`
--
ALTER TABLE `fcm_tokens`
  MODIFY `TokenID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=331;

--
-- AUTO_INCREMENT cho bảng `Feedbacks`
--
ALTER TABLE `Feedbacks`
  MODIFY `FeedbackID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `Grades`
--
ALTER TABLE `Grades`
  MODIFY `GradeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `HealthRecords`
--
ALTER TABLE `HealthRecords`
  MODIFY `RecordID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `Holidays`
--
ALTER TABLE `Holidays`
  MODIFY `HolidayID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `Invoices`
--
ALTER TABLE `Invoices`
  MODIFY `InvoiceID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT cho bảng `LeaveRequests`
--
ALTER TABLE `LeaveRequests`
  MODIFY `RequestID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `MedicationRequests`
--
ALTER TABLE `MedicationRequests`
  MODIFY `MedRequestID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `MenuDetails`
--
ALTER TABLE `MenuDetails`
  MODIFY `MenuDetailID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT cho bảng `Menus`
--
ALTER TABLE `Menus`
  MODIFY `MenuID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `MonthlySchedules`
--
ALTER TABLE `MonthlySchedules`
  MODIFY `MonthlyScheduleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `Newsfeeds`
--
ALTER TABLE `Newsfeeds`
  MODIFY `PostID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT cho bảng `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `NotifID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=258;

--
-- AUTO_INCREMENT cho bảng `PaymentPackages`
--
ALTER TABLE `PaymentPackages`
  MODIFY `PackageID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `ProxyAuthorizations`
--
ALTER TABLE `ProxyAuthorizations`
  MODIFY `AuthorizationID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `RewardBadges`
--
ALTER TABLE `RewardBadges`
  MODIFY `BadgeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `Roles`
--
ALTER TABLE `Roles`
  MODIFY `RoleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT cho bảng `StudentAssessments`
--
ALTER TABLE `StudentAssessments`
  MODIFY `AssessmentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `StudentBadges`
--
ALTER TABLE `StudentBadges`
  MODIFY `StudentBadgeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `StudentExtracurriculars`
--
ALTER TABLE `StudentExtracurriculars`
  MODIFY `EnrollmentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `Students`
--
ALTER TABLE `Students`
  MODIFY `StudentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT cho bảng `StudentTuitionPlans`
--
ALTER TABLE `StudentTuitionPlans`
  MODIFY `PlanID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `TeacherWorkHistories`
--
ALTER TABLE `TeacherWorkHistories`
  MODIFY `HistoryID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `Transactions`
--
ALTER TABLE `Transactions`
  MODIFY `TransactionID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=85;

--
-- AUTO_INCREMENT cho bảng `Users`
--
ALTER TABLE `Users`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT cho bảng `WeeklyRewards`
--
ALTER TABLE `WeeklyRewards`
  MODIFY `RewardID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `WeeklyScheduleDetails`
--
ALTER TABLE `WeeklyScheduleDetails`
  MODIFY `ScheduleDetailID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=541;

--
-- AUTO_INCREMENT cho bảng `WeeklySchedules`
--
ALTER TABLE `WeeklySchedules`
  MODIFY `WeeklyScheduleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Ràng buộc đối với các bảng kết xuất
--

--
-- Ràng buộc cho bảng `Attendances`
--
ALTER TABLE `Attendances`
  ADD CONSTRAINT `Attendances_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `FK_Attendances_CheckedInTeacher` FOREIGN KEY (`CheckedInByTeacherID`) REFERENCES `Teachers` (`TeacherID`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Attendances_CheckedOutTeacher` FOREIGN KEY (`CheckedOutByTeacherID`) REFERENCES `Teachers` (`TeacherID`) ON DELETE SET NULL,
  ADD CONSTRAINT `FK_Attendances_Proxy` FOREIGN KEY (`ProxyAuthorizationID`) REFERENCES `ProxyAuthorizations` (`AuthorizationID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_dropped_off_parent` FOREIGN KEY (`DroppedOffByParentID`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_picked_up_parent` FOREIGN KEY (`PickedUpByParentID`) REFERENCES `Users` (`UserID`) ON DELETE SET NULL;

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
-- Ràng buộc cho bảng `DailyActivities`
--
ALTER TABLE `DailyActivities`
  ADD CONSTRAINT `FK_DailyAct_Student` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `DailyAlbumPhotos`
--
ALTER TABLE `DailyAlbumPhotos`
  ADD CONSTRAINT `fk_daily_album_photos_parent` FOREIGN KEY (`AlbumID`) REFERENCES `DailyAlbums` (`AlbumID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `DailyAlbums`
--
ALTER TABLE `DailyAlbums`
  ADD CONSTRAINT `fk_daily_albums_classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_daily_albums_teachers` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `DailyLessons`
--
ALTER TABLE `DailyLessons`
  ADD CONSTRAINT `fk_dailylessons_classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `DailySchedules`
--
ALTER TABLE `DailySchedules`
  ADD CONSTRAINT `FK_DailySchedules_Classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE;

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
-- Ràng buộc cho bảng `EventStudents`
--
ALTER TABLE `EventStudents`
  ADD CONSTRAINT `FK_EventStudents_Events` FOREIGN KEY (`EventID`) REFERENCES `Events` (`EventID`) ON DELETE CASCADE,
  ADD CONSTRAINT `FK_EventStudents_Students` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `fcm_tokens`
--
ALTER TABLE `fcm_tokens`
  ADD CONSTRAINT `fcm_tokens_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Ràng buộc cho bảng `MenuDetails`
--
ALTER TABLE `MenuDetails`
  ADD CONSTRAINT `FK_MenuDetails_Menus` FOREIGN KEY (`MenuID`) REFERENCES `Menus` (`MenuID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `Menus`
--
ALTER TABLE `Menus`
  ADD CONSTRAINT `FK_Menus_Classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `MonthlySchedules`
--
ALTER TABLE `MonthlySchedules`
  ADD CONSTRAINT `FK_MonthlySchedules_Classes` FOREIGN KEY (`ClassID`) REFERENCES `Classes` (`ClassID`) ON DELETE CASCADE;

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
  ADD CONSTRAINT `Notifications_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ràng buộc cho bảng `NotificationSettings`
--
ALTER TABLE `NotificationSettings`
  ADD CONSTRAINT `k_notifset_user` FOREIGN KEY (`UserID`) REFERENCES `Users` (`UserID`) ON DELETE CASCADE;

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
-- Ràng buộc cho bảng `ProxyAuthorizations`
--
ALTER TABLE `ProxyAuthorizations`
  ADD CONSTRAINT `ProxyAuthorizations_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `ProxyAuthorizations_ibfk_2` FOREIGN KEY (`ParentID`) REFERENCES `Parents` (`ParentID`);

--
-- Ràng buộc cho bảng `StudentAssessments`
--
ALTER TABLE `StudentAssessments`
  ADD CONSTRAINT `StudentAssessments_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`);

--
-- Ràng buộc cho bảng `StudentBadges`
--
ALTER TABLE `StudentBadges`
  ADD CONSTRAINT `StudentBadges_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE,
  ADD CONSTRAINT `StudentBadges_ibfk_2` FOREIGN KEY (`BadgeID`) REFERENCES `RewardBadges` (`BadgeID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `StudentExtracurriculars`
--
ALTER TABLE `StudentExtracurriculars`
  ADD CONSTRAINT `SE_ibfk_invoice` FOREIGN KEY (`InvoiceID`) REFERENCES `Invoices` (`InvoiceID`),
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
-- Ràng buộc cho bảng `StudentTuitionPlans`
--
ALTER TABLE `StudentTuitionPlans`
  ADD CONSTRAINT `STP_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`),
  ADD CONSTRAINT `STP_ibfk_2` FOREIGN KEY (`PackageID`) REFERENCES `PaymentPackages` (`PackageID`);

--
-- Ràng buộc cho bảng `Teachers`
--
ALTER TABLE `Teachers`
  ADD CONSTRAINT `Teachers_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `Users` (`UserID`);

--
-- Ràng buộc cho bảng `TeacherWorkHistories`
--
ALTER TABLE `TeacherWorkHistories`
  ADD CONSTRAINT `k_workhist_teacher` FOREIGN KEY (`TeacherID`) REFERENCES `Teachers` (`TeacherID`) ON DELETE CASCADE;

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

--
-- Ràng buộc cho bảng `WeeklyRewards`
--
ALTER TABLE `WeeklyRewards`
  ADD CONSTRAINT `WeeklyRewards_ibfk_1` FOREIGN KEY (`StudentID`) REFERENCES `Students` (`StudentID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `WeeklyScheduleDetails`
--
ALTER TABLE `WeeklyScheduleDetails`
  ADD CONSTRAINT `FK_Details_WeeklySchedules` FOREIGN KEY (`WeeklyScheduleID`) REFERENCES `WeeklySchedules` (`WeeklyScheduleID`) ON DELETE CASCADE;

--
-- Ràng buộc cho bảng `WeeklySchedules`
--
ALTER TABLE `WeeklySchedules`
  ADD CONSTRAINT `FK_WeeklySchedules_Monthly` FOREIGN KEY (`MonthlyScheduleID`) REFERENCES `MonthlySchedules` (`MonthlyScheduleID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
