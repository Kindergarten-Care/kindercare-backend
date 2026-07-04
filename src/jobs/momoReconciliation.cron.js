import cron from 'node-cron';
import { reconcilePendingMomoTransactions } from '../modules/parent/parent.service.js';
import logger from '../config/logger.js';

// Chạy mỗi 5 phút — chủ động hỏi MoMo trạng thái các giao dịch còn Pending quá 2 phút,
// bù cho trường hợp IPN không gọi được tới server (mất mạng, sandbox không gửi...).
export const startMomoReconciliationCron = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const count = await reconcilePendingMomoTransactions();
      if (count > 0) {
        logger.info(`[MoMo Reconcile Cron] Đã quét ${count} giao dịch MoMo còn Pending`);
      }
    } catch (error) {
      logger.error(`[MoMo Reconcile Cron] Lỗi khi đối soát giao dịch Pending: ${error.message}`);
    }
  });

  logger.info('[MoMo Reconcile Cron] Đã lên lịch đối soát giao dịch MoMo Pending (chạy mỗi 5 phút)');
};
