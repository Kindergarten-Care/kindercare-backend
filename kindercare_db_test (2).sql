-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: kindercare-mysql:3306
-- Generation Time: Jul 03, 2026 at 03:34 AM
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
(552, 20, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(553, 21, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(554, 22, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(555, 23, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(556, 24, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(557, 25, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(558, 26, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(559, 27, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(560, 28, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(561, 29, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(562, 30, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(563, 31, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(564, 32, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(565, 33, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(566, 34, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(567, 35, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(568, 36, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(569, 37, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(570, 38, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(571, 39, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(572, 40, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(573, 41, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(574, 42, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(575, 43, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(576, 44, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(577, 45, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(578, 46, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(579, 47, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(580, 48, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(581, 49, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(582, 50, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(583, 51, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(584, 52, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(585, 53, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(586, 54, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(587, 55, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(588, 56, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(589, 57, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(590, 58, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(591, 59, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(592, 60, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(593, 61, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(594, 62, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(595, 63, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(596, 64, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(597, 85, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(598, 86, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(599, 87, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(600, 88, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(601, 89, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(602, 90, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(603, 91, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(604, 92, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(605, 93, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(606, 94, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(607, 95, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(608, 96, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(609, 97, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(610, 98, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(611, 99, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(612, 100, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(613, 101, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(614, 102, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(615, 103, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(616, 104, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(617, 106, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(618, 107, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(619, 108, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(620, 109, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(621, 110, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(622, 111, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(623, 112, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(624, 113, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(625, 114, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(626, 115, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(627, 116, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(628, 117, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(629, 118, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(630, 119, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(631, 120, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(632, 121, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(633, 122, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(634, 123, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(635, 124, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(636, 125, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(637, 126, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(638, 127, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(639, 128, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(640, 129, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(641, 130, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(642, 131, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(643, 132, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(644, 133, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(645, 134, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(646, 135, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(647, 136, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(648, 137, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(649, 138, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(650, 139, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(651, 140, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(652, 141, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(653, 142, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(654, 143, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(655, 144, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(656, 145, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(657, 146, 1782950400, 'Absent', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(679, 19, 1782950400, 'Present', 1783000745, 1783004743, 5, 5, NULL, 6, 6),
(680, 19, 1783036800, 'Excused', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

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
(1, 1, 4500000.00, 65000.00);

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
(1, 'Mầm 1', 1, 1, 1),
(2, 'Mầm 2', 1, 1, 1),
(3, 'Chồi 1', 2, 1, 1),
(4, 'Chồi 2', 2, 1, 1),
(5, 'Lá 1', 3, 1, 1),
(6, 'Lá 2', 3, 1, 1),
(7, 'Lá 3', 3, 1, 1),
(9, 'Chồi 4', 2, 1, 1);

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
(1, 5, 'Giáo viên trưởng', 1781082000),
(1, 16, 'Giáo viên trưởng', 1782870751),
(7, 7, 'Giáo viên chính', 1755216000),
(7, 8, 'Giáo viên phụ', 1755216000),
(9, 5, 'Giáo viên chính', 1755216000);

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
(1, 1, '2026-06-22', 'Ăn hết', 'Ăn hết', 'Ngủ ngoan', 'Ăn hết', 'Tốt', 'Hôm nay Khang rất ngoan, tự xúc cơm không cần cô đút.', NULL, 5, 1782669357),
(2, 19, '2026-06-22', 'Ăn hết', 'Ăn chậm', 'Ngủ ngoan', 'Ăn hết', 'Bình thường', 'Trưa nay Chánh hơi lười ăn rau, cô phải động viên bé mới ăn hết suất.', NULL, 5, 1782669357),
(3, 105, '2026-06-22', 'Ăn hết', 'Ăn hết', 'Khó ngủ', 'Ăn hết', 'Tốt', 'Trưa nay Giang trằn trọc mãi mới ngủ được, có vẻ bé bị nghẹt mũi nhẹ, ba mẹ theo dõi thêm nhé.', NULL, 5, 1782669357),
(4, 106, '2026-06-22', 'Bỏ bữa', 'Ăn hết', 'Ngủ ngoan', 'Ăn chậm', 'Bình thường', 'Sáng nay Vy đến trễ nên không ăn sáng tại trường, trưa bé ăn bù rất ngoan.', NULL, 5, 1782669357),
(5, 117, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(7, 109, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(8, 107, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(9, 116, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(10, 120, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(11, 115, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(12, 112, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(13, 145, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(14, 108, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(15, 119, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(16, 118, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(17, 110, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(18, 19, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(19, 1, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(20, 113, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(21, 106, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(22, 122, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(23, 111, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(24, 121, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(25, 114, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(26, 105, '2026-06-30', NULL, NULL, NULL, NULL, 'Bình thường', 'Vui chơi tích cực.', NULL, 5, 1782800791),
(27, 1, '2026-07-01', 'Ăn hết', 'Ăn chậm', 'Khó ngủ', 'Bỏ bữa', 'Tốt', 'Khang hôm nay rất hào hứng với bài học sáng tạo. Con xé dán hình cá voi rất nhanh, biết phối màu tinh tế và biết giúp cô dọn dẹp các mảnh giấy vụn sau giờ học.', NULL, 16, 1782905234);

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
(5, 1, 'https://media.kindercare.app/albums/mam1/draw_whale1.jpg', 'Bé Khang đang chăm chú phác thảo nét vẽ đầu tiên', 1782900922),
(6, 1, 'https://media.kindercare.app/albums/mam1/draw_whale2.jpg', 'Các bạn cùng nhau khoe thành tích vẽ tranh', 1782900922),
(7, 2, 'https://media.kindercare.app/moments/mam1/whale_art_1.jpg', 'Bé Khang đang chăm chú chọn giấy màu xanh', 1782905219),
(8, 2, 'https://media.kindercare.app/moments/mam1/whale_art_2.jpg', 'Tác phẩm chú cá voi ngộ nghĩnh của con hoàn thành', 1782905219);

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
(1, 1, 16, 1782864000, 'Hình ảnh các con say sưa tập vẽ con cá voi buổi sáng hôm nay', 1782900743, 1782900743),
(2, 1, 16, 1782864000, 'Hôm nay các con lớp Mầm 1 tham gia hoạt động xé dán tranh rất khéo tay, ba mẹ cùng xem nhé!', 1782905219, 1782905219);

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
(1, 1, 1782777600, 'TẠO HÌNH', 'Vẽ và tô màu con cá', 'Cô hướng dẫn bé vẽ con cá bằng các nét cơ bản và tô màu bằng sáp màu.', 'draw', 1782866086, 1782866086),
(2, 1, 1782777600, 'TIẾNG ANH', 'Từ vựng chủ đề Màu sắc (Colors)', 'Bé làm quen với 3 màu cơ bản: Red, Blue, Yellow qua thẻ flashcard và trò chơi.', 'english', 1782866086, 1782866086),
(3, 2, 1782777600, 'ÂM NHẠC', 'Hát múa: Cả nhà thương nhau', 'Bé học thuộc lời bài hát và tập các động tác múa phụ họa đơn giản cùng cô.', 'music', 1782866086, 1782866086),
(4, 2, 1782777600, 'TOÁN HỌC', 'Nhận biết To - Nhỏ', 'Phân biệt đồ vật to và nhỏ thông qua trò chơi phân loại quả bóng nhựa.', 'math', 1782866086, 1782866086),
(5, 3, 1782777600, 'THỂ CHẤT', 'Bò chui qua cổng', 'Rèn luyện sự khéo léo, phối hợp tay chân mắt để bò chui qua cổng mà không làm đổ.', 'sport', 1782866086, 1782866086),
(6, 3, 1782777600, 'KỸ NĂNG SỐNG', 'Gấp quần áo', 'Hướng dẫn bé tự gấp áo thun và quần đùi gọn gàng để cất vào balo.', 'default', 1782866086, 1782866086);

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
(46, 1, 1782604800, 1782630000, 1782631800, 'Đón bé & Chào hỏi', NULL, 'Cổng A', 'pickup', 'Chưa diễn ra', 1782581308, 1782617335),
(47, 1, 1782604800, 1782631800, 1782633600, 'Ăn sáng', 'Cháo yến mạch + sữa', NULL, 'meal', 'Chưa diễn ra', 1782581308, 1782617335),
(48, 1, 1782604800, 1782633600, 1782637200, 'Hoạt động sáng tạo', 'Vẽ tranh & tô màu', NULL, 'study', 'Chưa diễn ra', 1782581308, 1782617335),
(49, 1, 1782604800, 1782637200, 1782642600, 'Vận động ngoài trời', 'Sân vườn - Chơi tự do', 'Sân vườn', 'play', 'Chưa diễn ra', 1782581308, 1782617335),
(50, 1, 1782604800, 1782644400, 1782646200, 'Ăn trưa', 'Cơm + canh rau + thịt', NULL, 'meal', 'Chưa diễn ra', 1782581308, 1782617335),
(51, 1, 1782604800, 1782648000, 1782655200, 'Ngủ trưa', 'Ngủ tại phòng ngủ', 'Phòng ngủ', 'nap', 'Chưa diễn ra', 1782581308, 1782617335),
(52, 1, 1782604800, 1782657000, 1782658800, 'Ăn xế', 'Bánh + sữa', NULL, 'meal', 'Chưa diễn ra', 1782581308, 1782617335),
(53, 1, 1782604800, 1782658800, 1782662400, 'Hoạt động nhóm', 'Kể chuyện & hát', NULL, 'study', 'Chưa diễn ra', 1782581308, 1782617335),
(54, 1, 1782604800, 1782664200, 1782666000, 'Trả trẻ', 'Chuẩn bị đồ dùng và đợi ba mẹ đón', NULL, 'dropoff', 'Chưa diễn ra', 1782581308, 1782617335),
(200, 1, 1782691200, 1782717300, 1782720000, 'Đón bé & Kiểm tra vệ sinh sáng', 'Đón tại cổng', 'Cổng A', 'pickup', 'Xong', 1782585292, 1782585292),
(201, 1, 1782691200, 1782720000, 1782721800, 'Thể dục buổi sáng ngoài sân', 'Tập bài dân vũ', 'Sân trường', 'study', 'Xong', 1782585292, 1782585292),
(202, 1, 1782691200, 1782721800, 1782723600, 'Ăn sáng & Vệ sinh cá nhân', 'Súp cua', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1782585292),
(203, 1, 1782691200, 1782723600, 1782728100, 'Học tập chuyên đề', 'Khám phá thiên nhiên', 'Lớp học', 'study', 'Xong', 1782585292, 1782585292),
(204, 1, 1782691200, 1782728100, 1782731700, 'Vui chơi tự do ở góc học tập', 'Xếp hình lego', 'Lớp học', 'play', 'Xong', 1782585292, 1782585292),
(205, 1, 1782691200, 1782731700, 1782734400, 'Ăn trưa & chuẩn bị giờ ngủ trưa', 'Cơm thịt xào', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1782585292),
(206, 1, 1782691200, 1782734400, 1782741600, 'Giấc ngủ trưa của trẻ', 'Ngủ sâu', 'Phòng ngủ', 'nap', 'Xong', 1782585292, 1782585292),
(207, 1, 1782691200, 1782741600, 1782743400, 'Ăn xế chiều', 'Bánh flan', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1782585292),
(208, 1, 1782691200, 1782743400, 1782748800, 'Hoạt động kể chuyện cổ tích', 'Cô kể bé nghe', 'Lớp học', 'study', 'Xong', 1782585292, 1782585292),
(209, 1, 1782691200, 1782748800, 1782752400, 'Vệ sinh & Trả trẻ cho phụ huynh', 'Vệ sinh sạch sẽ', 'Cổng A', 'dropoff', 'Xong', 1782585292, 1782585292),
(210, 1, 1782777600, 1782803700, 1782806400, 'Đón bé & Kiểm tra vệ sinh sáng', 'Đón tại cổng', 'Cổng A', 'pickup', 'Xong', 1782585292, 1782800791),
(211, 1, 1782777600, 1782806400, 1782808200, 'Thể dục buổi sáng ngoài sân', 'Tập bài dân vũ', 'Sân trường', 'study', 'Xong', 1782585292, 1782800792),
(212, 1, 1782777600, 1782808200, 1782810000, 'Ăn sáng & Vệ sinh cá nhân', 'Súp cua', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1782800792),
(213, 1, 1782777600, 1782810000, 1782814500, 'Học tập chuyên đề', 'Khám phá thiên nhiên', 'Lớp học', 'study', 'Xong', 1782585292, 1782800792),
(214, 1, 1782777600, 1782814500, 1782818100, 'Vui chơi tự do ở góc học tập', 'Xếp hình lego', 'Lớp học', 'play', 'Chưa diễn ra', 1782585292, 1782800791),
(215, 1, 1782777600, 1782818100, 1782820800, 'Ăn trưa & chuẩn bị giờ ngủ trưa', 'Cơm thịt xào', 'Phòng ăn', 'meal', 'Xong', 1782585292, 1782800792),
(216, 1, 1782777600, 1782820800, 1782828000, 'Giấc ngủ trưa của trẻ', 'Ngủ sâu', 'Phòng ngủ', 'nap', 'Chưa diễn ra', 1782585292, 1782800792),
(217, 1, 1782777600, 1782828000, 1782829800, 'Ăn xế chiều', 'Bánh flan', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782800792),
(218, 1, 1782777600, 1782829800, 1782835200, 'Hoạt động kể chuyện cổ tích', 'Cô kể bé nghe', 'Lớp học', 'study', 'Chưa diễn ra', 1782585292, 1782800792),
(219, 1, 1782777600, 1782835200, 1782838800, 'Vệ sinh & Trả trẻ cho phụ huynh', 'Vệ sinh sạch sẽ', 'Cổng A', 'dropoff', 'Chưa diễn ra', 1782585292, 1782800792),
(220, 1, 1782864000, 1782890100, 1782892800, 'Đón bé & Kiểm tra vệ sinh sáng', 'Đón tại cổng', 'Cổng A', 'pickup', 'Chưa diễn ra', 1782585292, 1782585292),
(221, 1, 1782864000, 1782892800, 1782894600, 'Thể dục buổi sáng ngoài sân', 'Tập bài dân vũ', 'Sân trường', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(222, 1, 1782864000, 1782894600, 1782896400, 'Ăn sáng & Vệ sinh cá nhân', 'Súp cua', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(223, 1, 1782864000, 1782896400, 1782900900, 'Học tập chuyên đề', 'Khám phá thiên nhiên', 'Lớp học', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(224, 1, 1782864000, 1782900900, 1782904500, 'Vui chơi tự do ở góc học tập', 'Xếp hình lego', 'Lớp học', 'play', 'Chưa diễn ra', 1782585292, 1782585292),
(225, 1, 1782864000, 1782904500, 1782907200, 'Ăn trưa & chuẩn bị giờ ngủ trưa', 'Cơm thịt xào', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(226, 1, 1782864000, 1782907200, 1782914400, 'Giấc ngủ trưa của trẻ', 'Ngủ sâu', 'Phòng ngủ', 'nap', 'Chưa diễn ra', 1782585292, 1782585292),
(227, 1, 1782864000, 1782914400, 1782916200, 'Ăn xế chiều', 'Bánh flan', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(228, 1, 1782864000, 1782916200, 1782921600, 'Hoạt động kể chuyện cổ tích', 'Cô kể bé nghe', 'Lớp học', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(229, 1, 1782864000, 1782921600, 1782925200, 'Vệ sinh & Trả trẻ cho phụ huynh', 'Vệ sinh sạch sẽ', 'Cổng A', 'dropoff', 'Chưa diễn ra', 1782585292, 1782585292),
(230, 1, 1783296000, 1783322100, 1783324800, 'Đón bé & Kiểm tra vệ sinh sáng', 'Đón tại cổng', 'Cổng A', 'pickup', 'Chưa diễn ra', 1782585292, 1782585292),
(231, 1, 1783296000, 1783324800, 1783326600, 'Thể dục buổi sáng ngoài sân', 'Tập bài dân vũ', 'Sân trường', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(232, 1, 1783296000, 1783326600, 1783328400, 'Ăn sáng & Vệ sinh cá nhân', 'Súp cua', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(233, 1, 1783296000, 1783328400, 1783332900, 'Học tập chuyên đề', 'Khám phá thiên nhiên', 'Lớp học', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(234, 1, 1783296000, 1783332900, 1783336500, 'Vui chơi tự do ở góc học tập', 'Xếp hình lego', 'Lớp học', 'play', 'Chưa diễn ra', 1782585292, 1782585292),
(235, 1, 1783296000, 1783336500, 1783339200, 'Ăn trưa & chuẩn bị giờ ngủ trưa', 'Cơm thịt xào', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(236, 1, 1783296000, 1783339200, 1783346400, 'Giấc ngủ trưa của trẻ', 'Ngủ sâu', 'Phòng ngủ', 'nap', 'Chưa diễn ra', 1782585292, 1782585292),
(237, 1, 1783296000, 1783346400, 1783348200, 'Ăn xế chiều', 'Bánh flan', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585292, 1782585292),
(238, 1, 1783296000, 1783348200, 1783353600, 'Hoạt động kể chuyện cổ tích', 'Cô kể bé nghe', 'Lớp học', 'study', 'Chưa diễn ra', 1782585292, 1782585292),
(239, 1, 1783296000, 1783353600, 1783357200, 'Vệ sinh & Trả trẻ cho phụ huynh', 'Vệ sinh sạch sẽ', 'Cổng A', 'dropoff', 'Chưa diễn ra', 1782585292, 1782585292),
(300, 1, 1782604800, 1782630900, 1782633600, 'Đón bé & Kiểm tra vệ sinh sáng', 'Đón tại cổng', 'Cổng A', 'pickup', 'Xong', 1782585456, 1782617335),
(301, 1, 1782604800, 1782633600, 1782635400, 'Thể dục buổi sáng ngoài sân', 'Tập bài dân vũ', 'Sân trường', 'study', 'Xong', 1782585456, 1782617335),
(302, 1, 1782604800, 1782635400, 1782637200, 'Ăn sáng & Vệ sinh cá nhân', 'Súp cua', 'Phòng ăn', 'meal', 'Xong', 1782585456, 1782617335),
(303, 1, 1782604800, 1782637200, 1782641700, 'Học tập chuyên đề', 'Khám phá thiên nhiên', 'Lớp học', 'study', 'Xong', 1782585456, 1782617335),
(304, 1, 1782604800, 1782641700, 1782645300, 'Vui chơi tự do ở góc học tập', 'Xếp hình lego', 'Lớp học', 'play', 'Chưa diễn ra', 1782585456, 1782617335),
(305, 1, 1782604800, 1782645300, 1782648000, 'Ăn trưa & chuẩn bị giờ ngủ trưa', 'Cơm thịt xào', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585456, 1782617335),
(306, 1, 1782604800, 1782648000, 1782655200, 'Giấc ngủ trưa của trẻ', 'Ngủ sâu', 'Phòng ngủ', 'nap', 'Chưa diễn ra', 1782585456, 1782617335),
(307, 1, 1782604800, 1782655200, 1782657000, 'Ăn xế chiều', 'Bánh flan', 'Phòng ăn', 'meal', 'Chưa diễn ra', 1782585456, 1782617335),
(308, 1, 1782604800, 1782657000, 1782662400, 'Hoạt động kể chuyện cổ tích', 'Cô kể bé nghe', 'Lớp học', 'study', 'Chưa diễn ra', 1782585456, 1782617335),
(309, 1, 1782604800, 1782662400, 1782666000, 'Vệ sinh & Trả trẻ cho phụ huynh', 'Vệ sinh sạch sẽ', 'Cổng A', 'dropoff', 'Chưa diễn ra', 1782585456, 1782617335),
(310, 1, 1782864000, 1782896400, 1782900900, 'Giờ học chuyên đề', 'Bé tập vẽ và tô màu con cá voi', 'Phòng nghệ thuật', 'study', 'Xong', 1782900449, 1782900449),
(311, 1, 1782864000, 1782904500, 1782907200, 'Giờ ăn trưa', 'Cơm, canh sườn bí đỏ, thịt viên sốt cà', 'Phòng ăn tập thể', 'meal', 'Xong', 1782900449, 1782900449),
(312, 1, 1782864000, 1782896400, 1782900000, 'Hoạt động Góc Nghệ Thuật', 'Bé sáng tạo xé dán tranh con cá voi bằng giấy màu', 'Lớp học Mầm 1', 'study', 'Xong', 1782905152, 1782905152),
(313, 1, 1782864000, 1782914400, 1782921600, 'Giờ vận động tự do', 'Vui chơi ở nhà phao và xích đu ngoài sân trường', 'Sân chơi tòa A', 'play', 'Chưa diễn ra', 1782905152, 1782905152);

-- --------------------------------------------------------

--
-- Table structure for table `EventClasses`
--

CREATE TABLE `EventClasses` (
  `EventID` int NOT NULL,
  `ClassID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `EventClasses`
--

INSERT INTO `EventClasses` (`EventID`, `ClassID`) VALUES
(1, 1),
(2, 1);

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
  `CreatedBy` int DEFAULT NULL,
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Events`
--

INSERT INTO `Events` (`EventID`, `Title`, `Description`, `StartTime`, `EndTime`, `Location`, `Status`, `CreatedBy`, `CreatedAt`) VALUES
(1, 'Họp phụ huynh cuối kỳ', 'Tổng kết năm học 2026', 1782900000, 1782903600, 'Phòng đa năng', 'Upcoming', NULL, 1782988660),
(2, 'Gặp mặt giáo viên chủ nhiệm', 'Trao đổi trực tiếp về kế hoạch học tập và sinh hoạt của bé trong tháng tới.', 1782982800, 1782990000, 'Phòng Mầm 1 - Tòa A', 'Upcoming', NULL, 1782989221);

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
(1, 'Tiếng Anh Phonics', 500000.00, 'Lớp học phát âm với giáo viên bản ngữ'),
(2, 'Vẽ Sáng Tạo', 400000.00, 'Lớp học vẽ bằng màu nước và sáp nặn');

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
(1, 6, 'cc28eRpmqSXvexnAh_w8tr:APA91bGDp2k7M_uhPfptytaTjD5d6fctyyp23mjxJz9n_5xJ7pZYdOPExhwSYuJQwBLEMkVTNcKN92uc28ehICnK98s6eq6QVUCfTO0aZR7ofacJbSRH3oU', 'web', 1782661552, 1783048646),
(4, 6, 'fjfqe9lYvVEYK63i_q1T2h:APA91bEBiGzPZmOHvDzyqR5yfoRwmcuiJGvk-YkW5jDlB1MJfpOklV4V2eARND7q2qJAu_i06RBzoQC7cVeQdb-8cLkY64P1GgoFGoOCEaHoO2N9LfnMW3Y', 'web', 1782739894, 1782919680),
(6, 15, 'dNx6fnzETaW0fsvLqoKCaZ:APA91bFxqNsWygsfV-xM49tJURpwExl5ATx0ahRfg5sUHGUi9yMMJaiMy0g0aN1rZGP87nEVzClBN6ZY4QpPC4bXWwxxa0nFXm9lCNR5UdaV20-UmrJ4pOY', 'android', 1782795432, 1782892337),
(8, 5, 'dNx6fnzETaW0fsvLqoKCaZ:APA91bFxqNsWygsfV-xM49tJURpwExl5ATx0ahRfg5sUHGUi9yMMJaiMy0g0aN1rZGP87nEVzClBN6ZY4QpPC4bXWwxxa0nFXm9lCNR5UdaV20-UmrJ4pOY', 'android', 1782796885, 1782822026),
(15, 15, 'ff1fwo4IT7iqaxvoSQ6ODr:APA91bEgiBsBb_bxKeoWHA_7kOakTq0_1gfWmzzNrfy_UHZxZC7Q5TF-W_FtlELzHJZwgCddxrpehf6PX-X8WDynKDfiUR_KkUCUK6FaX5Mwg2B7MvIacOM', 'android', 1782820835, 1782824892),
(21, 5, 'ff1fwo4IT7iqaxvoSQ6ODr:APA91bEgiBsBb_bxKeoWHA_7kOakTq0_1gfWmzzNrfy_UHZxZC7Q5TF-W_FtlELzHJZwgCddxrpehf6PX-X8WDynKDfiUR_KkUCUK6FaX5Mwg2B7MvIacOM', 'android', 1782824176, 1782824857),
(26, 17, 'dNx6fnzETaW0fsvLqoKCaZ:APA91bFxqNsWygsfV-xM49tJURpwExl5ATx0ahRfg5sUHGUi9yMMJaiMy0g0aN1rZGP87nEVzClBN6ZY4QpPC4bXWwxxa0nFXm9lCNR5UdaV20-UmrJ4pOY', 'android', 1782870465, 1783049086),
(36, 16, 'dNx6fnzETaW0fsvLqoKCaZ:APA91bFxqNsWygsfV-xM49tJURpwExl5ATx0ahRfg5sUHGUi9yMMJaiMy0g0aN1rZGP87nEVzClBN6ZY4QpPC4bXWwxxa0nFXm9lCNR5UdaV20-UmrJ4pOY', 'android', 1782884040, 1782978601);

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
(1, 17, 'Giảng dạy', 'Gia đình rất hài lòng với các bài học trải nghiệm xé dán tranh của lớp, con về nhà rất hào hứng kể chuyện trường lớp.', 5, 'Resolved', 'Cảm ơn những lời động viên chân thành từ gia đình anh Tuấn ạ. Tập thể giáo viên lớp Mầm 1 sẽ tiếp tục đổi mới các hoạt động sáng tạo để các con mỗi ngày đến trường là một ngày vui.', 16);

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
  `BMI` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `HealthRecords`
--

INSERT INTO `HealthRecords` (`RecordID`, `StudentID`, `TermPeriod`, `Height`, `Weight`, `BMI`) VALUES
(1, 19, '2026-04', 130.00, 28.00, 16.60),
(2, 19, '2026-05', 131.00, 29.00, 16.90),
(3, 19, '2026-06', 132.00, 30.00, 17.20),
(4, 19, '2026-01', 127.00, 26.00, 16.10),
(5, 19, '2026-02', 128.00, 27.00, 16.50),
(6, 19, '2026-03', 129.00, 28.00, 16.80),
(7, 145, '2026-06', 95.50, 14.20, 15.57),
(8, 146, '2026-06', 92.00, 13.50, 15.95),
(9, 1, '2026-06', 120.00, 22.00, 15.28),
(10, 1, '2026-07', 115.00, 21.50, 16.26),
(11, 1, '2026-07', 116.00, 22.00, 16.35);

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
  `CreatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Invoices`
--

INSERT INTO `Invoices` (`InvoiceID`, `StudentID`, `PackageID`, `PeriodRange`, `BillingMonth`, `TuitionFee`, `ExpectedMealFee`, `ExtracurricularFee`, `Surcharge`, `RefundAmount`, `DiscountAmount`, `PaymentStatus`, `CreatedAt`) VALUES
(1, 1, 3, NULL, '05-2026', 4500000.00, 1430000.00, 0.00, 0.00, 0.00, 150000.00, 'Unpaid', 1781083042),
(2, 145, 1, NULL, '06-2026', 4500000.00, 1430000.00, 500000.00, 0.00, 0.00, 0.00, 'Paid', 1782172800),
(3, 146, 1, NULL, '06-2026', 4500000.00, 1430000.00, 400000.00, 0.00, 0.00, 0.00, 'Unpaid', 1782172800),
(4, 1, 1, '01/07/2026 - 31/07/2026', '07-2026', 4500000.00, 1430000.00, 500000.00, 0.00, 0.00, 150000.00, 'Unpaid', 1782901291),
(5, 1, 1, '01/07/2026 - 31/07/2026', '07-2026', 4500000.00, 1430000.00, 500000.00, 0.00, 0.00, 0.00, 'Unpaid', 1782905581),
(6, 105, 1, '01/07/2026 - 31/07/2026', '07-2026', 4500000.00, 1430000.00, 0.00, 0.00, 0.00, 150000.00, 'Paid', 1782905594);

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
-- Dumping data for table `LeaveRequests`
--

INSERT INTO `LeaveRequests` (`RequestID`, `StudentID`, `ParentID`, `FromDate`, `ToDate`, `Reason`, `EvidenceURL`, `Status`, `ApproverID`, `IsMealFeeDeducted`, `ParentNotes`, `CreatedAt`, `UpdatedTime`) VALUES
(22, 19, 6, 1782320400, 1782665999, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782400049, 1782401866),
(23, 145, 14, 1782518400, 1782518400, 'Việc gia đình', NULL, 'Approved', 5, 1, 'Gia đình có việc nội bộ ở quê, xin phép thầy cho bé nghỉ 1 ngày.', 1782400000, 1782569445),
(24, 19, 6, 1782579600, 1782838799, 'Bé bị ốm', NULL, 'Rejected', 5, 0, 'sg bac', 1782581457, 1782582004),
(25, 19, 6, 1782579600, 1782838799, 'Bé bị ốm', NULL, 'Rejected', 5, 0, 'sg bac', 1782581493, 1782582002),
(26, 19, 6, 1782579600, 1782838799, 'Bé bị ốm', NULL, 'Rejected', 5, 0, 'sg bac', 1782581505, 1782581986),
(100, 19, 6, 1782716400, 1782752400, 'Bé bị ốm sốt nhẹ', NULL, 'Approved', 5, 0, 'Gia đình xin phép cho bé nghỉ hôm nay để theo dõi sức khỏe.', 1782585292, 1782722053),
(101, 105, 4, 1782802800, 1783011600, 'Việc gia đình', NULL, 'Approved', 5, 0, 'Gia đình có chuyến đi xa nên xin phép cho bé nghỉ 3 ngày.', 1782585292, 1782585292),
(102, 108, 6, 1783321200, 1783357200, 'Khám bệnh định kỳ', NULL, 'Approved', 5, 0, 'Xin phép cô cho bé nghỉ thứ 2 tuần tới để đi khám răng.', 1782585292, 1782821268),
(103, 19, 6, 1782838800, 1785517199, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782667136, 1782821267),
(104, 146, 15, 1782752400, 1783166684, 'Đi du lịch cùng gia đình', NULL, 'Cancelled', NULL, 0, NULL, 1782821101, 1782821114),
(105, 146, 15, 1782752400, 1782909123, 'Bị ốm/Sốt', NULL, 'Cancelled', NULL, 0, NULL, 1782822754, 1782824821),
(106, 146, 15, 1782752400, 1782752400, 'Bị ốm/Sốt', NULL, 'Cancelled', NULL, 0, NULL, 1782824830, 1782824834),
(107, 146, 15, 1782752400, 1785503250, 'Đi du lịch cùng gia đình', NULL, 'Pending', NULL, 0, NULL, 1782824857, 1782824857),
(108, 19, 6, 1782752400, 1782838799, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782828777, 1782831267),
(109, 19, 6, 1782752400, 1782838799, 'Việc gia đình', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Việc gia đình', 1782831136, 1782831237),
(110, 19, 6, 1782752400, 1782838799, 'Bé bị ốm', NULL, 'Rejected', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782831716, 1782831739),
(111, 19, 6, 1782752400, 1782838799, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782831934, 1782832962),
(112, 19, 6, 1782752400, 1782838799, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782833131, 1782833649),
(113, 19, 6, 1782838800, 1782925199, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782839718, 1782839749),
(117, 1, 17, 1782864000, 1782950400, 'Bé đi khám răng định kỳ tại bệnh viện', 'https://media.kindercare.app/evidences/dental_clinic.jpg', 'Approved', 16, 1, 'Gia đình xin phép cho bé nghỉ 1 ngày', 1782900113, 1782904410),
(118, 1, 17, 1782838800, 1782988317, 'Đi du lịch cùng gia đình', NULL, 'Approved', 16, 0, NULL, 1782901982, 1782906339),
(119, 19, 6, 1782925200, 1783011599, 'Bé bị ốm', NULL, 'Rejected', 16, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782916925, 1782978350),
(120, 19, 6, 1782838800, 1783270799, 'Khám sức khỏe', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Khám sức khỏe', 1782923845, 1782923871),
(121, 1, 17, 1782925200, 1782925200, 'Đi du lịch cùng gia đình', 'https://media.kindercare.app/parents/student-leave-evidences/1782984794562-203298670.jpg', 'Pending', NULL, 0, NULL, 1782984794, 1782984794),
(122, 19, 6, 1785258000, 1785344399, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782997975, 1782997993),
(123, 19, 6, 1782925200, 1783011599, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782998117, 1782998129),
(124, 19, 6, 1785430800, 1785517199, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782998151, 1782998158),
(125, 19, 6, 1784998800, 1785085199, 'Việc gia đình', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Việc gia đình', 1782998244, 1782998258),
(126, 19, 6, 1785430800, 1785517199, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1782998973, 1782998983),
(127, 19, 6, 1785430800, 1785517199, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1783000568, 1783000583),
(128, 19, 6, 1784221200, 1784307599, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1783002330, 1783002369),
(129, 19, 6, 1783011600, 1783097999, 'Bé bị ốm', NULL, 'Approved', 5, 0, 'Phụ huynh báo nghỉ với lý do: Bé bị ốm', 1783011850, 1783011866);

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
-- Dumping data for table `MedicationRequests`
--

INSERT INTO `MedicationRequests` (`MedRequestID`, `StudentID`, `ParentID`, `RequestDate`, `MedicineDetails`, `Dosage`, `Frequency`, `TimeToTake`, `ParentNote`, `MedicineImageURL`, `Status`, `TeacherNote`, `UpdatedTime`) VALUES
(1, 105, 4, 1782172800, 'Bé bị dị ứng hải sản', 'Theo dõi', '1 lần/ngày', 'Cả ngày', 'Nhờ cô để ý bé không ăn tôm cua.', 'https://picsum.photos/400/600', 'Completed', NULL, 1782833924),
(2, 106, 6, 1782172800, 'Thuốc hạ sốt Hapacol', '1 gói', 'Khi sốt > 38.5', 'Bất kỳ', 'Cô pha với nước ấm cho bé uống.', NULL, 'Completed', NULL, 1782833930),
(3, 108, 6, 1782172800, 'Siro ho Prospan', '5ml', '2 lần/ngày', '11:00 và 15:00', 'Bé đang ho đờm.', NULL, 'Completed', 'Đã cho uống cữ sáng', 1782833926),
(9, 19, 6, 1782401850, 'sg bạc', 'Không ghi rõ', '2 điếu', 'Sau ăn trưa', NULL, NULL, 'Completed', NULL, 1782833930),
(10, 146, 15, 1782518400, 'Vitamin C', '1 viên', '1 lần/ngày', 'Sau ăn sáng', 'Cô cho bé ngậm sau khi ăn sáng xong nhé, bé hơi lười uống.', NULL, 'Cancelled', NULL, 1782805330),
(11, 146, 15, 1782908922, 'chuối', '2 quả', '1', 'trưa', 'hk cho ăn cx đc', NULL, 'Pending', NULL, 1782822562),
(12, 19, 6, 1782831280, 'sg bac', '2', '2', 'Sau ăn trưa, Sau ăn sáng, Trước khi ngủ, Khi cần', NULL, NULL, 'Completed', NULL, 1782833929),
(13, 19, 6, 1782831798, 'khjgbkjh', '1', '2', 'Sau ăn trưa', NULL, NULL, 'Completed', NULL, 1782833929),
(14, 19, 6, 1782833354, 'SG Bạc', '2 điếu', '5', 'Sau ăn trưa', NULL, NULL, 'Completed', NULL, 1782833923),
(17, 146, 15, 1782889539, 'siro ho', '2ml', '1', 'sáng', NULL, 'https://media.kindercare.app/parents/student-medication-requests/1782889564229-319794768.jpg', 'Completed', 'Đã cho bé uống thuốc ho đúng 5ml sau giờ ăn trưa, bé hợp tác ngoan.', 1782904421),
(18, 1, 17, 1782900049, 'Siro ho Prospan', '5ml', '1 lần/ngày', 'Sau ăn trưa', 'Nhờ cô Hoàng Anh cho bé uống thuốc đúng giờ giúp gia đình', 'https://media.kindercare.app/medicines/prospan.jpg', 'Completed', NULL, 1782916612),
(19, 1, 17, 1782901626, 'banana', '1', '2', 'sáng', 'ghi chú', 'https://media.kindercare.app/parents/student-medication-requests/1782901725329-816008711.jpg', 'Cancelled', NULL, 1782901785);

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
  `IsActive` tinyint(1) DEFAULT '0',
  `CreatedAt` bigint DEFAULT (unix_timestamp()),
  `UpdatedAt` bigint DEFAULT (unix_timestamp())
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `MonthlySchedules`
--

INSERT INTO `MonthlySchedules` (`MonthlyScheduleID`, `ClassID`, `Month`, `Year`, `MonthTheme`, `IsActive`, `CreatedAt`, `UpdatedAt`) VALUES
(1, 1, 7, 2026, 'Mùa Hè Rực Rỡ & Khám Phá Đại Dương', 1, 1783012593, 1783012593);

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

--
-- Dumping data for table `Newsfeeds`
--

INSERT INTO `Newsfeeds` (`PostID`, `ClassID`, `TeacherID`, `Content`, `MediaURL`, `PostedAt`) VALUES
(1, 1, 5, 'sfdgsdf', 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&auto=format&fit=crop&q=60&v=1782400579876', 1782400606),
(2, 1, 5, 'hgchgcfhgc', 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&auto=format&fit=crop&q=60&v=1782401948199', 1782401971),
(3, 1, 5, 'sdfsa', 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&auto=format&fit=crop&q=60&v=1782840516041', 1782840550),
(4, 1, 5, '1', NULL, 1782841220),
(5, 1, 5, 'fuf', NULL, 1782841452),
(6, 1, 5, 'hhohoih', NULL, 1782841817),
(7, 1, 5, ' uvewequeque uvewequeque bnikmoska', NULL, 1782898300),
(8, 1, 5, 'efgbgedfgewfdrg', 'https://media.kindercare.app/daily-albums/album-2026-07-01/1782898693315-311624064.jpg', 1782898697),
(10, 1, 5, 'asdsdf', 'https://media.kindercare.app/daily-albums/album-2026-07-01/1782917541944-111241272.jpg', 1782917544),
(11, 1, 5, 'hôm nay bé bao duôt slawms ', 'https://images.unsplash.com/photo-1540479859555-17af45c78602?w=600&auto=format&fit=crop&q=60&v=1782923817373', 1782923949);

-- --------------------------------------------------------

--
-- Table structure for table `NewsfeedTags`
--

CREATE TABLE `NewsfeedTags` (
  `PostID` int NOT NULL,
  `StudentID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `NewsfeedTags`
--

INSERT INTO `NewsfeedTags` (`PostID`, `StudentID`) VALUES
(1, 145),
(2, 146);

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
(6, 15, 'Bé đã đến trường', 'Bé Trần Ngọc Linh đã điểm danh vào lúc 19:01.', 'CHECKIN', 1, 0, '{\"type\": \"CHECKIN\", \"studentId\": \"146\"}', 1782820867, 1782822281),
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
(38, 14, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"3\"}', 1782840550, 1782840550),
(39, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"4\"}', 1782841220, 1782841220),
(41, 14, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"4\"}', 1782841220, 1782841220),
(42, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"5\"}', 1782841452, 1782841452),
(44, 14, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"5\"}', 1782841452, 1782841452),
(45, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"6\"}', 1782841817, 1782841817),
(47, 14, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"6\"}', 1782841817, 1782841817),
(48, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"114\", \"studentId\": \"1\"}', 1782871160, 1782871160),
(49, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"114\", \"studentId\": \"1\"}', 1782871160, 1782884108),
(50, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"115\", \"studentId\": \"1\"}', 1782871209, 1782884108),
(51, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"115\", \"studentId\": \"1\"}', 1782871209, 1782871209),
(52, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"116\", \"studentId\": \"1\"}', 1782871261, 1782871261),
(53, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"116\", \"studentId\": \"1\"}', 1782871261, 1782884115),
(54, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"15\"}', 1782874398, 1782874398),
(55, 16, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 1, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"15\"}', 1782874398, 1782884111),
(56, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"16\"}', 1782875284, 1782875284),
(57, 16, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 1, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"16\"}', 1782875284, 1782884112),
(58, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"7\"}', 1782898300, 1782898300),
(59, 17, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 1, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"7\"}', 1782898300, 1782901496),
(61, 14, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"7\"}', 1782898300, 1782898300),
(62, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"8\"}', 1782898697, 1782898697),
(63, 17, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 1, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"8\"}', 1782898697, 1782902670),
(65, 14, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"8\"}', 1782898697, 1782898697),
(66, 17, 'Lớp học có khoảnh khắc mới!', 'Cô Trần Hoàng Anh vừa đăng tải album ảnh hoạt động \"Tập vẽ con cá voi\" của lớp Mầm 1. Mời ba mẹ vào xem.', 'ALBUM_NEW', 1, 0, NULL, 1782900976, 1782902630),
(67, 16, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 1, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"19\"}', 1782901725, 1782906351),
(68, 5, 'Dặn dò thuốc mới', 'Bé Nguyễn Minh Khang (Mầm 1) có dặn dò thuốc mới từ phụ huynh. Vui lòng kiểm tra.', 'MEDICATION_REQUEST', 0, 0, '{\"type\": \"MEDICATION_REQUEST\", \"studentId\": \"1\", \"medRequestId\": \"19\"}', 1782901725, 1782901725),
(69, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"118\", \"studentId\": \"1\"}', 1782901982, 1782916776),
(70, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"118\", \"studentId\": \"1\"}', 1782901982, 1782906351),
(71, 17, 'Thông báo họp Phụ huynh Lớp Mầm 1', 'Kính gửi ba mẹ bé Nguyễn Minh Khang, lớp Mầm 1 sẽ tổ chức buổi họp phụ huynh cuối học kỳ vào lúc 08:30 thứ Bảy tuần này tại phòng học tòa A. Rất mong ba mẹ sắp xếp thời gian tham dự đầy đủ.', 'CLASS_NOTICE', 1, 1, '{\"room\": \"Phòng Mầm 1 - Tòa A\", \"type\": \"MEETING\", \"classId\": \"1\"}', 1782905382, 1782978143),
(72, 4, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"118\"}', 1782906339, 1782906339),
(73, 17, 'Cập nhật Đơn xin phép', 'Đơn xin phép nghỉ học của bé Nguyễn Minh Khang đã được duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"118\"}', 1782906339, 1782978149),
(74, 4, 'Cập nhật Dặn dò y tế', 'Giáo viên đã cập nhật trạng thái dặn dò y tế của bé Nguyễn Minh Khang thành: Completed. Ghi chú: ', 'MEDICAL_REQUEST', 0, 0, '{\"type\": \"MEDICAL_REQUEST\", \"requestId\": \"18\"}', 1782916612, 1782916612),
(75, 17, 'Cập nhật Dặn dò y tế', 'Giáo viên đã cập nhật trạng thái dặn dò y tế của bé Nguyễn Minh Khang thành: Completed. Ghi chú: ', 'MEDICAL_REQUEST', 1, 0, '{\"type\": \"MEDICAL_REQUEST\", \"requestId\": \"18\"}', 1782916612, 1782978244),
(76, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"9\"}', 1782916698, 1782916698),
(77, 17, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 1, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"9\"}', 1782916698, 1782978149),
(79, 14, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"9\"}', 1782916698, 1782916698),
(80, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"119\", \"studentId\": \"19\"}', 1782916925, 1782916932),
(81, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"119\", \"studentId\": \"19\"}', 1782916925, 1782916925),
(82, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"10\"}', 1782917544, 1782917544),
(83, 17, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 1, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"10\"}', 1782917544, 1782978134),
(85, 14, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"10\"}', 1782917544, 1782917544),
(88, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"120\", \"studentId\": \"19\"}', 1782923845, 1782923845),
(89, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"120\", \"studentId\": \"19\"}', 1782923845, 1782923845),
(91, 4, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"11\"}', 1782923949, 1782923949),
(92, 17, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 1, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"11\"}', 1782923949, 1782978198),
(94, 14, 'Bài đăng mới từ lớp học', 'Cô giáo vừa đăng một hoạt động mới của lớp. Hãy vào xem nhé!', 'NEWSFEED', 0, 0, '{\"type\": \"NEWSFEED\", \"postId\": \"11\"}', 1782923949, 1782923949),
(96, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"121\", \"studentId\": \"1\"}', 1782984794, 1782984794),
(97, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Khang (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"121\", \"studentId\": \"1\"}', 1782984794, 1782984794),
(98, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"122\", \"studentId\": \"19\"}', 1782997975, 1782997975),
(99, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"122\", \"studentId\": \"19\"}', 1782997975, 1782997975),
(101, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"123\", \"studentId\": \"19\"}', 1782998118, 1782998118),
(102, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"123\", \"studentId\": \"19\"}', 1782998118, 1782998118),
(104, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"124\", \"studentId\": \"19\"}', 1782998152, 1782998152),
(105, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"124\", \"studentId\": \"19\"}', 1782998152, 1782998250),
(107, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"125\", \"studentId\": \"19\"}', 1782998244, 1782998244),
(108, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"125\", \"studentId\": \"19\"}', 1782998244, 1782998244),
(110, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"126\", \"studentId\": \"19\"}', 1782998973, 1783011906),
(111, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"126\", \"studentId\": \"19\"}', 1782998973, 1782998973),
(113, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"127\", \"studentId\": \"19\"}', 1783000568, 1783011537),
(114, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"127\", \"studentId\": \"19\"}', 1783000568, 1783000568),
(117, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"128\", \"studentId\": \"19\"}', 1783002330, 1783011532),
(118, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"128\", \"studentId\": \"19\"}', 1783002330, 1783002330),
(121, 5, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 1, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"129\", \"studentId\": \"19\"}', 1783011850, 1783014901),
(122, 16, 'Đơn xin nghỉ học mới', 'Bé Nguyễn Minh Chánh (Mầm 1) có đơn xin nghỉ học từ phụ huynh. Vui lòng kiểm tra và phê duyệt.', 'LEAVE_REQUEST', 0, 0, '{\"type\": \"LEAVE_REQUEST\", \"requestId\": \"129\", \"studentId\": \"19\"}', 1783011850, 1783011850);

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
(1, 'Nguyễn Văn An', NULL, '0901234567', 'an.nguyen@gmail.com', '079090123456', 'Kỹ sư phần mềm', '123 Lê Lợi, Quận 1, TP.HCM', 'https://example.com/avatars/pr001.jpg'),
(2, 'Trần Thị Bích', NULL, '0912345678', 'bich.tran@gmail.com', '079191234567', 'Giáo viên', '456 Nguyễn Trãi, Quận 5, TP.HCM', 'https://example.com/avatars/pr002.jpg'),
(3, 'Lê Hoàng Hải', NULL, '0923456789', 'hai.le@gmail.com', '079292345678', 'Bác sĩ', '789 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM', 'https://example.com/avatars/pr003.jpg'),
(4, 'Nguyễn Anh Tuấn', NULL, '0911111111', 'tuan.nguyen@gmail.com', NULL, 'Kỹ sư', '65 Huỳnh Thúc Kháng, Q1', NULL),
(5, 'Vũ Quốc Bảo', NULL, '0945678901', 'bao.vu@gmail.com', '048094567890', 'Kinh doanh tự do', '654 Trần Phú, Quận Hải Châu, Đà Nẵng', 'https://example.com/avatars/pr005.jpg'),
(6, 'Hồ Công Danh', NULL, '086655189', 'hocong.danh16@gmail.com', '07020002832', 'IT', 'Bình Tân, HCM', 'https://media.kindercare.app/parents/parents-profile-avatar/534926184_1951092382389301_2242079378559548722_n.jpg'),
(14, 'Lê Hoàng Phong', NULL, '0933445566', 'phong.le@gmail.com', '079334455667', 'Kiến trúc sư', '12 Nguyễn Đình Chiểu, Quận 3, TP.HCM', NULL),
(15, 'Trần Ngọc Bích', NULL, '0944556677', 'bich.tran88@gmail.com', '079445566778', 'Nhân viên ngân hàng', '34 Lê Duẩn, Quận 1, TP.HCM', 'https://example.com/avatars/pr015.jpg'),
(17, 'Lê Minh Tuấn', NULL, '0988777666', 'minhtuan.le@gmail.com', '079088001234', 'Kiến trúc sư', '102 Nguyễn Đình Chiểu, Quận 3, TP.HCM', NULL);

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
(1, 'Tháng', 1, 0.00),
(2, 'Quý', 3, 0.00),
(3, 'Nửa năm', 6, 5.00),
(4, 'Năm', 12, 10.00);

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
(2, 'Trần Thị Mai', '0999999999', 'mai.tran@kindercare.edu.vn');

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

--
-- Dumping data for table `ProxyAuthorizations`
--

INSERT INTO `ProxyAuthorizations` (`AuthorizationID`, `StudentID`, `ParentID`, `AuthorizationDate`, `Type`, `ProxyName`, `ProxyPhone`, `ProxyIDCard`, `ProxyPhotoURL`, `Notes`, `Status`, `CreatedAt`) VALUES
(1, 19, 6, 1782864000, 'checkout', 'Tao nè', '0866551849', '070205002832', 'https://media.kindercare.app/parents/proxy-photos/1782828115311-894231506.png', 'Hay hút thuốc sg bạc', 'Approved', 1782828115),
(2, 1, 17, 1782899861, 'checkout', 'Nguyễn Văn Hùng', '0933333333', '079093001234', 'https://media.kindercare.app/proxy/hung.jpg', 'Cậu ruột của bé đón thay vì bố bận đi công tác', 'Approved', 1782899861),
(3, 1, 17, 1782994167, 'checkout', 'hdjdb', '65656', NULL, 'https://media.kindercare.app/parents/proxy-photos/1782994190178-172123014.jpg', 'jdjdj', 'Cancelled', 1782994190);

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
(1, 145, '06-2026', 9, 8, 9, 10, 8, 'Bé Phúc rất năng động, hòa đồng với các bạn. Cần rèn thêm kỹ năng tô màu.', 1782400000),
(2, 146, '06-2026', 8, 9, 9, 8, 10, 'Bé Linh ngoan, có năng khiếu vẽ và cảm thụ âm nhạc rất tốt.', 1782400000),
(3, 1, '06-2026', 9, 9, 8, 10, 9, 'Bé Khang có sự phát triển vượt trội về thể chất, nhanh nhẹn, hòa đồng với các bạn trong lớp.', 1782900578),
(4, 19, '06-2026', 8, 9, 8, 9, 10, 'Bé An chăm chỉ, có khả năng ngôn ngữ tốt, hòa đồng với bạn bè.', 1783004269),
(5, 19, '07-2026', 9, 8, 9, 8, 9, 'Bé An năng động, sáng tạo trong các hoạt động mỹ thuật.', 1783004269),
(6, 19, '08-2026', 8, 8, 9, 9, 10, 'Bé An tiến bộ rõ rệt về kỹ năng xã hội và thẩm mỹ.', 1783004269);

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
(1, 145, 2, '2026-06-26 15:30:00'),
(2, 146, 3, '2026-06-26 15:30:00');

-- --------------------------------------------------------

--
-- Table structure for table `StudentExtracurriculars`
--

CREATE TABLE `StudentExtracurriculars` (
  `EnrollmentID` int NOT NULL,
  `StudentID` int DEFAULT NULL,
  `ActivityID` int DEFAULT NULL,
  `RegisteredMonth` varchar(10) NOT NULL,
  `Status` varchar(20) DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `StudentExtracurriculars`
--

INSERT INTO `StudentExtracurriculars` (`EnrollmentID`, `StudentID`, `ActivityID`, `RegisteredMonth`, `Status`) VALUES
(1, 145, 1, '06-2026', 'Active'),
(2, 146, 2, '06-2026', 'Active');

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
(122, 4, 'Ba', 1),
(123, 4, 'Ba', 1),
(124, 4, 'Ba', 1),
(125, 4, 'Ba', 1),
(126, 4, 'Ba', 1),
(127, 4, 'Ba', 1),
(128, 4, 'Ba', 1),
(129, 4, 'Ba', 1),
(130, 4, 'Ba', 1),
(131, 4, 'Ba', 1),
(132, 4, 'Ba', 1),
(133, 4, 'Ba', 1),
(134, 4, 'Ba', 1),
(135, 4, 'Ba', 1),
(136, 4, 'Ba', 1),
(137, 4, 'Ba', 1),
(138, 4, 'Ba', 1),
(139, 4, 'Ba', 1),
(140, 4, 'Ba', 1),
(141, 4, 'Ba', 1),
(142, 4, 'Ba', 1),
(143, 4, 'Ba', 1),
(144, 6, 'Ba', 1),
(145, 14, 'Ba', 1),
(146, 15, 'Mẹ', 1);

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
(20, 'Trần Gia Bảo', 1673740800, 'Nam', 'Không', 1757030400, 'Active', NULL, 2),
(21, 'Lê Nhã Uyên', 1679443200, 'Nữ', 'Dị ứng sữa bò', 1757030400, 'Active', NULL, 2),
(22, 'Phạm Tuấn Kiệt', 1683676800, 'Nam', 'Không', 1757030400, 'Active', NULL, 2),
(23, 'Vũ Ngọc Diệp', 1688774400, 'Nữ', 'Dị ứng lạc', 1757030400, 'Active', NULL, 2),
(24, 'Đinh Trọng Vũ', 1644796800, 'Nam', 'Không', 1757030400, 'Active', NULL, 3),
(25, 'Hoàng Mộc Miên', 1651276800, 'Nữ', 'Không', 1757030400, 'Active', NULL, 3),
(26, 'Ngô Đức Anh', 1655251200, 'Nam', 'Dị ứng hải sản', 1757030400, 'Active', NULL, 3),
(27, 'Bùi Thảo My', 1660953600, 'Nữ', 'Không', 1757030400, 'Active', NULL, 3),
(28, 'Lý Thiên Phúc', 1641772800, 'Nam', 'Không', 1757030400, 'Active', NULL, 3),
(29, 'Đoàn Tú Anh', 1651708800, 'Nữ', 'Dị ứng thời tiết', 1757030400, 'Active', NULL, 4),
(30, 'Trương Nhật Minh', 1662940800, 'Nam', 'Không', 1757030400, 'Active', NULL, 4),
(31, 'Hồ Bích Ngọc', 1669334400, 'Nữ', 'Không', 1757030400, 'Active', NULL, 4),
(32, 'Dương Hải Đăng', 1615161600, 'Nam', 'Không', 1757030400, 'Active', NULL, 5),
(33, 'Tô Tuệ Lâm', 1626652800, 'Nữ', 'Dị ứng tôm', 1757030400, 'Active', NULL, 5),
(34, 'Phan Chấn Hưng', 1633132800, 'Nam', 'Không', 1757030400, 'Active', NULL, 5),
(35, 'Đỗ Quỳnh Anh', 1639526400, 'Nữ', 'Không', 1757030400, 'Active', NULL, 5),
(36, 'Mai Gia Huy', 1611532800, 'Nam', 'Dị ứng mèo', 1757030400, 'Active', NULL, 6),
(37, 'Trịnh Tường Vy', 1618185600, 'Nữ', 'Không', 1757030400, 'Active', NULL, 6),
(38, 'Khổng Thái Sơn', 1630281600, 'Nam', 'Không', 1757030400, 'Active', NULL, 6),
(39, 'Tống Khánh Linh', 1636588800, 'Nữ', 'Dị ứng đậu nành', 1757030400, 'Active', NULL, 6),
(40, 'Nguyễn Anh Dũng', 1578787200, 'Nam', 'Không', 1757030400, 'Active', NULL, 7),
(41, 'Trần Lan Anh', 1582588800, 'Nữ', 'Không', 1757030400, 'Active', NULL, 7),
(42, 'Lê Quốc Bảo', 1583625600, 'Nam', 'Dị ứng hải sản', 1757030400, 'Active', NULL, 7),
(43, 'Phạm Thảo My', 1586822400, 'Nữ', 'Không', 1757030400, 'Active', NULL, 7),
(44, 'Hoàng Trọng Tín', 1589932800, 'Nam', 'Không', 1757030400, 'Active', NULL, 7),
(45, 'Vũ Thanh Hà', 1593475200, 'Nữ', 'Dị ứng thời tiết', 1757030400, 'Active', NULL, 7),
(46, 'Đặng Nam Khánh', 1594771200, 'Nam', 'Không', 1757030400, 'Active', NULL, 7),
(47, 'Bùi Minh Khuê', 1596585600, 'Nữ', 'Không', 1757030400, 'Active', NULL, 7),
(48, 'Đỗ Gia Hưng', 1600387200, 'Nam', 'Dị ứng sữa bò', 1757030400, 'Active', NULL, 7),
(49, 'Ngô Ngọc Diệp', 1603324800, 'Nữ', 'Không', 1757030400, 'Active', NULL, 7),
(50, 'Dương Thiên Phú', 1604880000, 'Nam', 'Không', 1757030400, 'Active', NULL, 7),
(51, 'Lý Nhã Kỳ', 1606780800, 'Nữ', 'Dị ứng lạc', 1757030400, 'Active', NULL, 7),
(52, 'Trương Tấn Phát', 1610582400, 'Nam', 'Không', 1757030400, 'Active', NULL, 7),
(53, 'Đoàn Bảo Ngọc', 1614470400, 'Nữ', 'Không', 1757030400, 'Active', NULL, 7),
(54, 'Hồ Chí Kiên', 1615334400, 'Nam', 'Không', 1757030400, 'Active', NULL, 7),
(55, 'Trịnh Kim Ngân', 1617494400, 'Nữ', 'Không', 1757030400, 'Active', NULL, 7),
(56, 'Đinh Thái Sơn', 1621382400, 'Nam', 'Dị ứng lông mèo', 1757030400, 'Active', NULL, 7),
(57, 'Tô Tuệ Nhi', 1624233600, 'Nữ', 'Không', 1757030400, 'Active', NULL, 7),
(58, 'Phan Khôi Nguyên', 1625616000, 'Nam', 'Không', 1757030400, 'Active', NULL, 7),
(59, 'Mai Phương Trà', 1628726400, 'Nữ', 'Không', 1757030400, 'Active', NULL, 7),
(60, 'Khổng Việt Hoàng', 1632528000, 'Nam', 'Không', 1757030400, 'Active', NULL, 7),
(61, 'Tống Minh Châu', 1635552000, 'Nữ', 'Không', 1757030400, 'Active', NULL, 7),
(62, 'Lương Thế Vinh', 1636934400, 'Nam', 'Không', 1757030400, 'Active', NULL, 7),
(63, 'Châu Mỹ Lệ', 1639958400, 'Nữ', 'Không', 1757030400, 'Active', NULL, 7),
(64, 'Bạch Chấn Phong', 1628380800, 'Nam', 'Dị ứng phấn hoa', 1757030400, 'Active', NULL, 7),
(85, 'Phạm Bảo Khang', 1641772800, 'Nam', 'Không', 1757030400, 'Active', NULL, 9),
(86, 'Lê Thị Ngọc Bích', 1644796800, 'Nữ', 'Không', 1757030400, 'Active', NULL, 9),
(87, 'Hoàng Gia Hưng', 1647734400, 'Nam', 'Dị ứng phấn hoa', 1757030400, 'Active', NULL, 9),
(88, 'Vũ Thị Hà My', 1649116800, 'Nữ', 'Không', 1757030400, 'Active', NULL, 9),
(89, 'Đỗ Văn Tài', 1652313600, 'Nam', 'Không', 1757030400, 'Active', NULL, 9),
(90, 'Trương Bích Ngọc', 1655510400, 'Nữ', 'Dị ứng sữa bò', 1757030400, 'Active', NULL, 9),
(91, 'Bùi Tiến Dũng', 1658448000, 'Nam', 'Không', 1757030400, 'Active', NULL, 9),
(92, 'Ngô Thu Phương', 1661817600, 'Nữ', 'Không', 1757030400, 'Active', NULL, 9),
(93, 'Đặng Quang Hải', 1662076800, 'Nam', 'Không', 1757030400, 'Active', NULL, 9),
(94, 'Lý Nhã My', 1665792000, 'Nữ', 'Dị ứng thời tiết', 1757030400, 'Active', NULL, 9),
(95, 'Hồ Văn Cường', 1668124800, 'Nam', 'Không', 1757030400, 'Active', NULL, 9),
(96, 'Đoàn Thị Thúy', 1670198400, 'Nữ', 'Không', 1757030400, 'Active', NULL, 9),
(97, 'Châu Tấn Phát', 1643068800, 'Nam', 'Dị ứng hải sản', 1757030400, 'Active', NULL, 9),
(98, 'Bạch Tuyết Nhi', 1646006400, 'Nữ', 'Không', 1757030400, 'Active', NULL, 9),
(99, 'La Quốc Toản', 1646870400, 'Nam', 'Không', 1757030400, 'Active', NULL, 9),
(100, 'Khổng Tuấn Kiệt', 1650326400, 'Nam', 'Không', 1757030400, 'Active', NULL, 9),
(101, 'Trịnh Kim Chi', 1653436800, 'Nữ', 'Dị ứng lạc', 1757030400, 'Active', NULL, 9),
(102, 'Cao Nhật Minh', 1656547200, 'Nam', 'Không', 1757030400, 'Active', NULL, 9),
(103, 'Đinh Thu Thủy', 1657152000, 'Nữ', 'Không', 1757030400, 'Active', NULL, 9),
(104, 'Lương Thế Thành', 1659916800, 'Nam', 'Không', 1757030400, 'Active', NULL, 9),
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
(122, 'Phan Anh Tuấn', 1684108800, 'Nam', 'Không', 1781082000, 'Active', NULL, 1),
(123, 'Lê Khôi Nguyên', 1672876800, 'Nam', 'Không', NULL, 'Active', NULL, 2),
(124, 'Nguyễn Ngọc Hân', 1676332800, 'Nữ', 'Không', NULL, 'Active', NULL, 2),
(125, 'Trần Minh Khang', 1679270400, 'Nam', 'Dị ứng phấn hoa', NULL, 'Active', NULL, 2),
(126, 'Phạm Yến Nhi', 1681084800, 'Nữ', 'Không', NULL, 'Active', NULL, 2),
(127, 'Hoàng Quốc Việt', 1684713600, 'Nam', 'Không', NULL, 'Active', NULL, 2),
(128, 'Đỗ Bảo Trâm', 1687046400, 'Nữ', 'Dị ứng sữa bò', NULL, 'Active', NULL, 2),
(129, 'Vũ Hải Đăng', 1688688000, 'Nam', 'Không', NULL, 'Active', NULL, 2),
(130, 'Đinh Tuyết Mai', 1693353600, 'Nữ', 'Không', NULL, 'Active', NULL, 2),
(131, 'Bùi Tuấn Anh', 1694476800, 'Nam', 'Không', NULL, 'Active', NULL, 2),
(132, 'Trương Ngọc Anh', 1698192000, 'Nữ', 'Dị ứng thời tiết', NULL, 'Active', NULL, 2),
(133, 'Lý Chí Thành', 1699488000, 'Nam', 'Không', NULL, 'Active', NULL, 2),
(134, 'Ngô Kim Liên', 1702598400, 'Nữ', 'Không', NULL, 'Active', NULL, 2),
(135, 'Đoàn Hữu Tuấn', 1674864000, 'Nam', 'Không', NULL, 'Active', NULL, 2),
(136, 'Hồ Phương Linh', 1676851200, 'Nữ', 'Dị ứng hải sản', NULL, 'Active', NULL, 2),
(137, 'Châu Tuấn Hưng', 1678233600, 'Nam', 'Không', NULL, 'Active', NULL, 2),
(138, 'Bạch Nhã Yến', 1681430400, 'Nữ', 'Không', NULL, 'Active', NULL, 2),
(139, 'La Thành Đạt', 1684454400, 'Nam', 'Dị ứng lạc', NULL, 'Active', NULL, 2),
(140, 'Khổng Ngọc Hà', 1687305600, 'Nữ', 'Không', NULL, 'Active', NULL, 2),
(141, 'Trịnh Quang Nhật', 1688256000, 'Nam', 'Không', NULL, 'Active', NULL, 2),
(142, 'Cao Diệu Minh', 1691712000, 'Nữ', 'Không', NULL, 'Active', NULL, 2),
(143, 'Phùng Gia Hân', 1683849600, 'Nữ', 'Không', NULL, 'Active', NULL, 2),
(144, 'Vương Đình Phong', 1694131200, 'Nam', 'Dị ứng phấn hoa', NULL, 'Active', NULL, 2),
(145, 'Lê Hoàng Phúc', 1695427200, 'Nam', 'Không', 1781082000, 'Active', NULL, 1),
(146, 'Trần Ngọc Linh', 1698019200, 'Nữ', 'Dị ứng phấn hoa', 1781082000, 'Active', NULL, 2);

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
(3, 'Nguyễn Thị Lan', '0901234567', 'lan.nguyen@kindercare.edu.vn', 642729600, 'Nữ', '079190001234', '123 Nguyễn Huệ, Quận 1', 'Hạng III', 'Active'),
(5, 'Lê Quang Huy', '0912345678', 'huy.le@kindercare.edu.vn', 1541077538, 'Nam', '000000008\n1929394', '123 Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM', 'Hạng II', 'Active'),
(7, 'Đoàn Tuyết Mai', '0911222333', 'tuyetmai@kindercare.edu.vn', 705456000, 'Nữ', '079123456789', 'Quận 7, TP.HCM', 'Hạng II', 'Active'),
(8, 'Ngô Phương Trinh', '0988777555', 'phuongtrinh@kindercare.edu.vn', 808876800, 'Nữ', '079987654321', 'Quận 4, TP.HCM', 'Hạng III', 'Active'),
(16, 'Trần Hoàng Anh', '0977111222', 'hoanganh.tran@kindercare.edu.vn', 788918400, 'Nữ', '079188002233', '150 Sư Vạn Hạnh, Quận 10, TP.HCM', 'Hạng III', 'Active');

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

--
-- Dumping data for table `Transactions`
--

INSERT INTO `Transactions` (`TransactionID`, `InvoiceID`, `AmountPaid`, `PaymentMethod`, `TransactionCode`, `TransactionDate`, `Status`) VALUES
(1, 2, 6430000.00, 'Chuyển khoản Bank', 'MB-INV002-FTX998', 1782259200, 'Success'),
(2, NULL, 6280000.00, 'Chuyển khoản Ngân hàng (App)', 'KINCARE-MB-JULY26-001', 1782901316, 'Success');

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
  `ReceivePushNotif` tinyint(1) DEFAULT '1',
  `fcm_token` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`UserID`, `Username`, `PasswordHash`, `RoleID`, `Status`, `AvatarURL`, `ResetPasswordToken`, `TokenExpiry`, `ReceiveEmailNotif`, `ReceivePushNotif`, `fcm_token`) VALUES
(1, 'admin_it', 'hash_pass', 1, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(2, 'hieutruong_mai', 'hash_pass', 2, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(3, 'gv_lan', 'hash_pass', 3, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(4, 'ph_tuan', '$2a$12$iWf2E00ASg54.I3mqkNCgOAGwuNK38VGkW3y.5wxCad2GopnYTjr6', 4, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(5, 'gv_quanghuy', '$2a$12$5BtJO/BxEiWdpbaqpCzrUOlLqWbQUhQcrmkq.bjBSARw87d1LH5W.', 3, 'Active', '', NULL, NULL, 1, 1, NULL),
(6, 'hcngdanh', '$2a$12$Oy1J6YGhPdXGU6hqYIGQoe2PVmtYAOx9k3XXOKgYaIeqF/RzX1/VC', 4, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(7, 'gv_tuyetmai', 'hash_pass', 3, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(8, 'gv_phuongtrinh', 'hash_pass', 3, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(9, 'ph_test', '$2a$12$WsebqTNPffC.dvswlAB92OTiB9/tTmWuSNJ8QUDupy53BQaY/LVru', 4, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(10, 'ph_minhtri', '$2a$12$EYO6GwUZrX.3SPW8qfRiueO8pPoCIbQfqCff.60E3vCaJns2wZLLC', 4, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(11, 'guest_001', 'hash_pass_guest', 5, 'Inactive', NULL, NULL, NULL, 0, 0, NULL),
(12, 'ph_thuhuong', '$2a$12$iWf2E00ASg54.I3mqkNCgOAGwuNK38VGkW3y.5wxCad2GopnYTjr6', 4, 'Active', 'https://media.kindercare.app/Avatars/ph_thuhuong.jpg', NULL, NULL, 1, 1, NULL),
(13, 'gv_kimthanh', 'hash_pass', 3, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(14, 'ph_hoangphong', '$2a$12$0hpdFN.j.WdO1XfRlWJhWOwyWnrzCnTHFRoCJCOgqDJlaC0gVaiEG', 4, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(15, 'ph_ngocbich', '$2a$12$0hpdFN.j.WdO1XfRlWJhWOwyWnrzCnTHFRoCJCOgqDJlaC0gVaiEG', 4, 'Active', 'https://example.com/avatars/pr015.jpg', NULL, NULL, 1, 1, NULL),
(16, 'gv_hoanganh', '$2a$12$0hpdFN.j.WdO1XfRlWJhWOwyWnrzCnTHFRoCJCOgqDJlaC0gVaiEG', 3, 'Active', NULL, NULL, NULL, 1, 1, NULL),
(17, 'ph_minhtuan', '$2a$12$0hpdFN.j.WdO1XfRlWJhWOwyWnrzCnTHFRoCJCOgqDJlaC0gVaiEG', 4, 'Active', NULL, NULL, NULL, 1, 1, NULL);

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

--
-- Dumping data for table `WeeklyRewards`
--

INSERT INTO `WeeklyRewards` (`RewardID`, `StudentID`, `WeekNumber`, `Year`, `TeacherNote`, `DateAwarded`) VALUES
(1, 145, 25, 2026, 'Phúc nhận cờ bé ngoan vì tuần này ăn hết suất rất nhanh.', '2026-06-26 16:00:00'),
(2, 146, 25, 2026, 'Linh nhận cờ bé ngoan vì biết giúp cô dọn đồ chơi.', '2026-06-26 16:00:00');

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
  ADD KEY `CreatedBy` (`CreatedBy`);

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
-- Indexes for table `Invoices`
--
ALTER TABLE `Invoices`
  ADD PRIMARY KEY (`InvoiceID`),
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
  ADD KEY `StudentID` (`StudentID`),
  ADD KEY `ActivityID` (`ActivityID`);

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
-- Indexes for table `Teachers`
--
ALTER TABLE `Teachers`
  ADD PRIMARY KEY (`TeacherID`);

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
-- AUTO_INCREMENT for table `Attendances`
--
ALTER TABLE `Attendances`
  MODIFY `AttendanceID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=681;

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
  MODIFY `ClassID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `DailyActivities`
--
ALTER TABLE `DailyActivities`
  MODIFY `ActivityID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `DailyAlbumPhotos`
--
ALTER TABLE `DailyAlbumPhotos`
  MODIFY `PhotoID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `DailyAlbums`
--
ALTER TABLE `DailyAlbums`
  MODIFY `AlbumID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `DailyLessons`
--
ALTER TABLE `DailyLessons`
  MODIFY `LessonLogID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `DailySchedules`
--
ALTER TABLE `DailySchedules`
  MODIFY `DailyScheduleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=314;

--
-- AUTO_INCREMENT for table `Events`
--
ALTER TABLE `Events`
  MODIFY `EventID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Extracurriculars`
--
ALTER TABLE `Extracurriculars`
  MODIFY `ActivityID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `fcm_tokens`
--
ALTER TABLE `fcm_tokens`
  MODIFY `TokenID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- AUTO_INCREMENT for table `Feedbacks`
--
ALTER TABLE `Feedbacks`
  MODIFY `FeedbackID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Grades`
--
ALTER TABLE `Grades`
  MODIFY `GradeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `HealthRecords`
--
ALTER TABLE `HealthRecords`
  MODIFY `RecordID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Invoices`
--
ALTER TABLE `Invoices`
  MODIFY `InvoiceID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `LeaveRequests`
--
ALTER TABLE `LeaveRequests`
  MODIFY `RequestID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT for table `MedicationRequests`
--
ALTER TABLE `MedicationRequests`
  MODIFY `MedRequestID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `MenuDetails`
--
ALTER TABLE `MenuDetails`
  MODIFY `MenuDetailID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Menus`
--
ALTER TABLE `Menus`
  MODIFY `MenuID` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `MonthlySchedules`
--
ALTER TABLE `MonthlySchedules`
  MODIFY `MonthlyScheduleID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `Newsfeeds`
--
ALTER TABLE `Newsfeeds`
  MODIFY `PostID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `Notifications`
--
ALTER TABLE `Notifications`
  MODIFY `NotifID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

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
  MODIFY `AssessmentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `StudentBadges`
--
ALTER TABLE `StudentBadges`
  MODIFY `StudentBadgeID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `StudentExtracurriculars`
--
ALTER TABLE `StudentExtracurriculars`
  MODIFY `EnrollmentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Students`
--
ALTER TABLE `Students`
  MODIFY `StudentID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=147;

--
-- AUTO_INCREMENT for table `Transactions`
--
ALTER TABLE `Transactions`
  MODIFY `TransactionID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `UserID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
-- Constraints for table `Teachers`
--
ALTER TABLE `Teachers`
  ADD CONSTRAINT `Teachers_ibfk_1` FOREIGN KEY (`TeacherID`) REFERENCES `Users` (`UserID`);

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
