import cron from 'node-cron';
import { sendPaymentReminders } from '../modules/billing/billing.service.js';
import logger from '../config/logger.js';

// Chạy 08:00 hàng ngày — nhắc hóa đơn sắp/đã quá hạn đóng (xem sendPaymentReminders).
export const startPaymentReminderCron = () => {
  cron.schedule('0 8 * * *', async () => {
    logger.info('[Payment Reminder Cron] Bắt đầu quét hóa đơn cần nhắc hạn đóng');
    try {
      const result = await sendPaymentReminders();
      logger.info(`[Payment Reminder Cron] Hoàn tất: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`[Payment Reminder Cron] Lỗi khi gửi nhắc hạn đóng: ${error.message}`);
    }
  }, {
    timezone: 'Asia/Ho_Chi_Minh',
  });

  logger.info('[Payment Reminder Cron] Đã lên lịch nhắc hạn đóng học phí (08:00 hàng ngày)');
};
