import crypto, { randomUUID } from 'crypto';
import axios from 'axios';

const sign = (rawSignature, secretKey) =>
  crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

/**
 * Tạo đơn thanh toán MoMo (payWithMethod, flow redirect).
 * @param {object} params
 * @param {number} params.invoiceId
 * @param {number} params.amount
 * @param {string} params.orderInfo
 * @returns {Promise<{payUrl: string, orderId: string, requestId: string}>}
 */
export const createMomoPayment = async ({ invoiceId, amount, orderInfo }) => {
  const partnerCode = process.env.MOMO_PARTNER_CODE;
  const accessKey = process.env.MOMO_ACCESS_KEY;
  const secretKey = process.env.MOMO_SECRET_KEY;
  const endpoint = process.env.MOMO_ENDPOINT;
  const redirectUrl = `${process.env.MOMO_REDIRECT_BASE_URL}/billing/payment-result`;
  // Cho phép override tạm bằng MOMO_IPN_URL (vd để test bằng webhook.site)
  // mà không đụng vào API_URL — vốn còn dùng cho việc khác.
  const ipnUrl = process.env.MOMO_IPN_URL || `${process.env.API_URL}/parent/invoices/momo-ipn`;

  const orderId = `INV${invoiceId}-${randomUUID()}`;
  const requestId = orderId;
  const requestType = 'payWithMethod';
  const extraData = '';
  const amountStr = String(Math.round(amount));

  const rawSignature =
    `accessKey=${accessKey}&amount=${amountStr}&extraData=${extraData}&ipnUrl=${ipnUrl}` +
    `&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}` +
    `&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;

  const signature = sign(rawSignature, secretKey);

  const body = {
    partnerCode,
    accessKey,
    requestId,
    amount: amountStr,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    signature,
    lang: 'vi',
  };

  const { data } = await axios.post(endpoint, body, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  if (data.resultCode !== 0) {
    throw new Error(`MoMo tạo đơn thất bại: ${data.message} (resultCode=${data.resultCode})`);
  }

  return { payUrl: data.payUrl, orderId, requestId };
};

/**
 * Xác thực chữ ký của IPN callback từ MoMo.
 * @param {object} payload - body gửi từ MoMo
 * @returns {boolean}
 */
export const verifyMomoSignature = (payload) => {
  const secretKey = process.env.MOMO_SECRET_KEY;
  const {
    accessKey, amount, extraData, message, orderId, orderInfo, orderType,
    partnerCode, payType, requestId, responseTime, resultCode, transId, signature,
  } = payload;

  const rawSignature =
    `accessKey=${process.env.MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}` +
    `&message=${message}&orderId=${orderId}&orderInfo=${orderInfo}&orderType=${orderType}` +
    `&partnerCode=${partnerCode}&payType=${payType}&requestId=${requestId}` +
    `&responseTime=${responseTime}&resultCode=${resultCode}&transId=${transId}`;

  const expectedSignature = sign(rawSignature, secretKey);
  return expectedSignature === signature;
};
