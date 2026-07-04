import express from 'express';
import billingController from './billing.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Đăng ký gói học phí cho học sinh
router.post('/students/:studentId/tuition-plan', authenticate, authorize(2), billingController.registerTuitionPlan);

// Chạy hóa đơn hàng tháng cho toàn trường (trigger tay để test / cron gọi)
router.post('/run-monthly', authenticate, authorize(2), billingController.runMonthlyBilling);

// Thêm phụ thu vào 1 hóa đơn
router.patch('/invoices/:invoiceId/surcharge', authenticate, authorize(2), billingController.addSurcharge);

// Sửa hạn đóng của 1 hóa đơn (gia hạn/rút ngắn thủ công)
router.patch('/invoices/:invoiceId/due-date', authenticate, authorize(2), billingController.updateDueDate);

export default router;
