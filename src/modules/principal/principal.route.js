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

// Tìm kiếm phụ huynh qua SĐT
router.get('/parents/search', authenticate, authorize(2), principalController.searchParentsByPhone);

// Lấy cấu hình gói học phí
router.get('/payment-configs', authenticate, authorize(2), principalController.getPaymentConfigs);

// Thêm học sinh mới (Wizard Flow)
router.post('/students/enroll', authenticate, authorize(2), principalController.enrollStudent);

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

export default router;
