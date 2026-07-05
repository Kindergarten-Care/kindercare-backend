import cron from 'node-cron';
import { reconcilePendingMomoTransactions } from '../modules/parent/parent.service.js';
import logger from '../config/logger.js';

// Chạy mỗi 5 phút — chủ động hỏi MoMo trạng thái các giao dịch còn Pending quá 2 phút,
// bù cho trường hợp IPN không gọi được tới server (sandbox MoMo không ổn định).
// Không còn quét VNPay ở đây — IPN VNPay đã cấu hình và hoạt động ổn định, cron liên tục
// hỏi lại từng giao dịch còn khiến VNPay trả '94 - Request is duplicated'. Vẫn còn cơ chế
// đối soát VNPay theo yêu cầu (khi parent mở lại hóa đơn) trong parent.service.js làm lưới
// an toàn, không chạy định kỳ nữa.
export const startPaymentReconciliationCron = () => {
  cron.schedule('*/5 * * * *', async () => {
    try {
      const momoCount = await reconcilePendingMomoTransactions();
      if (momoCount > 0) {
        logger.info(`[Payment Reconcile Cron] Đã quét ${momoCount} giao dịch MoMo còn Pending`);
      }
    } catch (error) {
      logger.error(`[Payment Reconcile Cron] Lỗi khi đối soát giao dịch Pending: ${error.message}`);
    }
  });

  logger.info('[Payment Reconcile Cron] Đã lên lịch đối soát giao dịch MoMo Pending (chạy mỗi 5 phút)');
};
