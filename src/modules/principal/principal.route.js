import express from 'express';
import multer from 'multer';
import principalController from './principal.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Lấy thông tin profile của hiệu trưởng đang đăng nhập
router.get('/profile', authenticate, authorize(2), principalController.getMyProfile);

// Lấy danh sách tài khoản theo role (chỉ hiệu trưởng)
//   GET /principal/accounts?role=teacher
//   GET /principal/accounts?role=parent
router.get('/accounts', authenticate, authorize(2), principalController.getAccountsByRole);

// Tạo tài khoản (giáo viên, phụ huynh)
//   POST /principal/accounts?role=teacher
router.post('/accounts', authenticate, authorize(2), principalController.createAccount);

// Lấy danh sách khối và lớp
router.get('/grades-classes', authenticate, authorize(2), principalController.getGradesAndClasses);

// Tạo khối và lớp
router.post('/grades-classes', authenticate, authorize(2), principalController.createGradeAndClasses);

// Lấy thông tin chi tiết lớp học
router.get('/class/:id/detail', authenticate, authorize(2), principalController.getClassDetail);

// Lấy thông tin chi tiết giáo viên theo id
router.get('/teacher/:id/detail', authenticate, authorize(2), principalController.getTeacherDetail);

// Lấy thông tin chi tiết phụ huynh theo id
router.get('/parent/:id/detail', authenticate, authorize(2), principalController.getParentDetail);

// Lấy thông tin chi tiết học sinh theo id
router.get('/student/:id/detail', authenticate, authorize(2), principalController.getStudentDetail);

// Sửa thông tin học sinh (fullName, dateOfBirth, gender, allergies, avatarUrl)
router.patch('/student/:id', authenticate, authorize(2), principalController.updateStudent);

// Tìm kiếm phụ huynh qua SĐT
router.get('/parents/search', authenticate, authorize(2), principalController.searchParentsByPhone);

// Lấy cấu hình gói học phí
router.get('/payment-configs', authenticate, authorize(2), principalController.getPaymentConfigs);

// Lấy danh sách toàn bộ biểu phí (gói học phí + học phí cơ bản mọi năm học, kể cả năm không active)
router.get('/fees', authenticate, authorize(2), principalController.getAllFees);

// Thêm gói học phí mới
router.post('/payment-packages', authenticate, authorize(2), principalController.createPaymentPackage);

// Sửa thông tin một gói học phí (name, duration, discount)
router.patch('/payment-packages/:id', authenticate, authorize(2), principalController.updatePaymentPackage);

// Sửa học phí cơ bản của một năm học (monthlyTuition, dailyMealFee) theo FeeID
router.patch('/base-fees/:id', authenticate, authorize(2), principalController.updateBaseFee);

// Thêm hoạt động ngoại khóa mới
router.post('/extracurriculars', authenticate, authorize(2), principalController.createExtracurricular);

// Sửa thông tin một hoạt động ngoại khóa (name, monthlyFee, description)
router.patch('/extracurriculars/:id', authenticate, authorize(2), principalController.updateExtracurricular);

// Lấy danh sách hóa đơn (invoices), hỗ trợ filter qua query: studentId, billingMonth, paymentStatus, invoiceType
router.get('/invoices', authenticate, authorize(2), principalController.getInvoices);

// Lấy thông tin chi tiết 1 hóa đơn kèm lịch sử giao dịch
router.get('/invoices/:id', authenticate, authorize(2), principalController.getInvoiceDetail);

// Thêm học sinh mới (Wizard Flow)
router.post('/students/enroll', authenticate, authorize(2), principalController.enrollStudent);

// Thêm/Liên kết phụ huynh cho học sinh
router.post('/student/:id/parents', authenticate, authorize(2), principalController.addParentToStudent);

// Import học sinh từ CSV
router.post('/students/import', authenticate, authorize(2), upload.single('file'), principalController.importStudents);

// Lấy danh sách toàn bộ học sinh
router.get('/students', authenticate, authorize(2), principalController.getAllStudents);

// Lấy danh sách học sinh chưa có lớp
router.get('/students/unassigned', authenticate, authorize(2), principalController.getUnassignedStudents);

// Đặt lại mật khẩu của tài khoản về mặc định (chỉ hiệu trưởng)
router.patch('/accounts/:id/reset-password', authenticate, authorize(2), principalController.resetAccountPassword);

// Khóa tài khoản
router.patch('/accounts/:id/lock', authenticate, authorize(2), principalController.lockAccount);

// Mở khóa tài khoản
router.patch('/accounts/:id/unlock', authenticate, authorize(2), principalController.unlockAccount);

// Bổ nhiệm Giáo viên (GVCN hoặc GV Phụ)
router.post('/assignments/teacher', authenticate, authorize(2), principalController.assignTeacherToClass);

// Xếp lớp cho học sinh
router.post('/assignments/students', authenticate, authorize(2), principalController.assignStudentsToClass);

// Tổng kết năm học
router.post('/academic-year/end', authenticate, authorize(2), principalController.endAcademicYear);

// Bắt đầu năm học mới
router.post('/academic-year/start', authenticate, authorize(2), principalController.startAcademicYear);

// Lấy danh sách toàn bộ năm học
router.get('/academic-years', authenticate, authorize(2), principalController.getAcademicYears);

// Kích hoạt một năm học
router.patch('/academic-year/:id/activate', authenticate, authorize(2), principalController.activateAcademicYear);

// Lấy danh sách sự kiện, hỗ trợ filter qua query: eventType (Class, School, Holiday, Student)
router.get('/events', authenticate, authorize(2), principalController.getEvents);

// Tạo sự kiện mới theo eventType
router.post('/events', authenticate, authorize(2), principalController.createEvent);

// Sửa thông tin sự kiện (title, description, startTime, endTime, location, status, eventType, classIds, studentIds)
router.patch('/events/:id', authenticate, authorize(2), principalController.updateEvent);

// Xóa sự kiện
router.delete('/events/:id', authenticate, authorize(2), principalController.deleteEvent);

// Lấy danh sách ngày nghỉ lễ, hỗ trợ filter qua query: yearId
router.get('/holidays', authenticate, authorize(2), principalController.getHolidays);

// Tạo ngày nghỉ lễ mới
router.post('/holidays', authenticate, authorize(2), principalController.createHoliday);

// Sửa thông tin một ngày nghỉ lễ (holidayDate, holidayName, yearId)
router.patch('/holidays/:id', authenticate, authorize(2), principalController.updateHoliday);

// Xóa một ngày nghỉ lễ
router.delete('/holidays/:id', authenticate, authorize(2), principalController.deleteHoliday);

// Lấy danh sách tổng quan thời khóa biểu tháng, hỗ trợ filter qua query: year, month, approvedStatus, classId
router.get('/schedules/monthly', authenticate, authorize(2), principalController.getMonthlySchedules);

// Lấy chi tiết đầy đủ 1 thời khóa biểu tháng (kèm các tuần và hoạt động từng ngày)
router.get('/schedules/monthly/:id', authenticate, authorize(2), principalController.getMonthlyScheduleDetail);

// Duyệt/từ chối 1 thời khóa biểu tháng
router.patch('/schedules/monthly/:id/approve', authenticate, authorize(2), principalController.approveMonthlySchedule);

// Kích hoạt/Vô hiệu hóa thời khóa biểu tháng
router.patch('/schedules/monthly/:id/active', authenticate, authorize(2), principalController.activeMonthlySchedule);

// Lấy danh sách thực đơn, hỗ trợ filter qua query: classId, year, weekNumber
router.get('/menus', authenticate, authorize(2), principalController.getMenus);

// Lấy chi tiết 1 thực đơn (đủ 7 ngày x 3 bữa)
router.get('/menus/:id', authenticate, authorize(2), principalController.getMenuDetail);

// Xóa 1 thực đơn (cascade xóa toàn bộ MenuDetails liên quan)
router.delete('/menus/:id', authenticate, authorize(2), principalController.deleteMenu);

// Import thực đơn từ 1 hoặc nhiều file CSV/XLSX (mỗi file = 1 lớp/1 tuần)
router.post('/menus/import', authenticate, authorize(2), upload.array('files', 10), principalController.importMenus);

export default router;
