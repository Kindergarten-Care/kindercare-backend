import cron from 'node-cron';
import { expirePendingExtracurriculars } from '../modules/billing/billing.service.js';
import logger from '../config/logger.js';

// Chạy mỗi giờ — tự hủy enrollment ngoại khóa Pending quá 48h chưa thanh toán.
export const startExtracurricularExpiryCron = () => {
  cron.schedule('0 * * * *', async () => {
    try {
      const count = await expirePendingExtracurriculars();
      if (count > 0) {
        logger.info(`[Extracurricular Expiry Cron] Đã hủy ${count} đăng ký ngoại khóa quá hạn thanh toán`);
      }
    } catch (error) {
      logger.error(`[Extracurricular Expiry Cron] Lỗi khi hủy đăng ký quá hạn: ${error.message}`);
    }
  });

  logger.info('[Extracurricular Expiry Cron] Đã lên lịch hủy đăng ký ngoại khóa Pending quá 48h (chạy mỗi giờ)');
};
