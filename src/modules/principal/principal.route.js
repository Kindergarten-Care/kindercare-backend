import express from 'express';
import principalController from './principal.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

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

// Đặt lại mật khẩu của tài khoản về mặc định (chỉ hiệu trưởng)
router.patch('/accounts/:id/reset-password', authenticate, authorize(2), principalController.resetAccountPassword);

// Khóa tài khoản
router.patch('/accounts/:id/lock', authenticate, authorize(2), principalController.lockAccount);

// Mở khóa tài khoản
router.patch('/accounts/:id/unlock', authenticate, authorize(2), principalController.unlockAccount);

export default router;
