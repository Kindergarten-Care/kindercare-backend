import cron from 'node-cron';
import { runMonthlyBilling } from '../modules/billing/billing.service.js';
import logger from '../config/logger.js';

// Chạy 00:05 ngày 1 hàng tháng (giờ server). Idempotent nhờ
// UNIQUE(StudentID, BillingMonth, InvoiceType) trong Invoices.
export const startMonthlyBillingCron = () => {
  cron.schedule('5 0 1 * *', async () => {
    logger.info('[Billing Cron] Bắt đầu chạy hóa đơn hàng tháng');
    try {
      const result = await runMonthlyBilling();
      logger.info(`[Billing Cron] Hoàn tất: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`[Billing Cron] Lỗi khi chạy hóa đơn hàng tháng: ${error.message}`);
    }
  }, {
    timezone: 'Asia/Ho_Chi_Minh',
  });

  logger.info('[Billing Cron] Đã lên lịch chạy hóa đơn hàng tháng (00:05 ngày 1 hàng tháng)');
};
