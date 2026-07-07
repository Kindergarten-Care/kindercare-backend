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

export default router;
