import cron from 'node-cron';
import { reconcilePendingMomoTransactions, reconcilePendingVnpayTransactions } from '../modules/parent/parent.service.js';
import logger from '../config/logger.js';

// Chạy mỗi 5 phút — chủ động hỏi MoMo/VNPay trạng thái các giao dịch còn Pending quá 2
// phút, bù cho trường hợp IPN không gọi được tới server (mất mạng, sandbox không gửi...).
export const startPaymentReconciliationCron = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const momoCount = await reconcilePendingMomoTransactions();
      const vnpayCount = await reconcilePendingVnpayTransactions();
      if (momoCount > 0 || vnpayCount > 0) {
        logger.info(`[Payment Reconcile Cron] Đã quét ${momoCount} giao dịch MoMo, ${vnpayCount} giao dịch VNPay còn Pending`);
      }
    } catch (error) {
      logger.error(`[Payment Reconcile Cron] Lỗi khi đối soát giao dịch Pending: ${error.message}`);
    }
  });

  logger.info('[Payment Reconcile Cron] Đã lên lịch đối soát giao dịch MoMo/VNPay Pending (chạy mỗi 5 phút)');
};
