import express from 'express';
import billingController from './billing.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Đăng ký gói học phí cho học sinh
router.post('/students/:studentId/tuition-plan', authenticate, authorize(2), billingController.registerTuitionPlan);

// Chạy hóa đơn hàng tháng cho toàn trường (trigger tay để test/demo — không cần đợi tới
// ngày 1, gọi bất kỳ lúc nào trong tháng đều tạo hóa đơn Published=0 giống hệt cron thật;
// bỏ trống billingMonth = tháng hiện tại. Cũng là endpoint cron thật gọi lúc 00:05 ngày 1).
router.post('/run-monthly', authenticate, authorize(2), billingController.runMonthlyBilling);

// Thêm phụ thu vào 1 hóa đơn
router.patch('/invoices/:invoiceId/surcharge', authenticate, authorize(2), billingController.addSurcharge);

// Sửa hạn đóng của 1 hóa đơn (gia hạn/rút ngắn thủ công)
router.patch('/invoices/:invoiceId/due-date', authenticate, authorize(2), billingController.updateDueDate);

// Công khai toàn bộ hóa đơn TUITION/MONTHLY nháp của 1 tháng cho phụ huynh (DueDate = lúc publish + 10 ngày)
router.patch('/invoices/publish', authenticate, authorize(2), billingController.publishInvoicesForMonth);

// Công khai 1 hóa đơn TUITION/MONTHLY nháp riêng lẻ
router.patch('/invoices/:invoiceId/publish', authenticate, authorize(2), billingController.publishInvoice);

export default router;
