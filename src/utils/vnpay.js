import crypto from 'crypto';
import axios from 'axios';

/**
 * Định dạng Date thành 'yyyyMMddHHmmss' theo giờ GMT+7 (bắt buộc bởi VNPay),
 * không phụ thuộc timezone của server chạy Node (thường là UTC trên Docker).
 * @param {Date} date
 * @returns {string}
 */
const formatVnpayDate = (date) => {
  const gmt7 = new Date(date.getTime() + 7 * 60 * 60 * 1000);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${gmt7.getUTCFullYear()}${pad(gmt7.getUTCMonth() + 1)}${pad(gmt7.getUTCDate())}` +
    `${pad(gmt7.getUTCHours())}${pad(gmt7.getUTCMinutes())}${pad(gmt7.getUTCSeconds())}`
  );
};

/**
 * Encode giá trị theo đúng chuẩn VNPay dùng để tạo chữ ký và query string
 * (encodeURIComponent, nhưng khoảng trắng là '+' thay vì '%20' — kiểu
 * application/x-www-form-urlencoded, không phải encodeURIComponent thuần).
 * @param {string} value
 * @returns {string}
 */
const vnpEncode = (value) => encodeURIComponent(value).replace(/%20/g, '+');

/**
 * Ghép các tham số (đã sort key theo alphabet) thành chuỗi để ký/tạo query string.
 * @param {Record<string,string>} params
 * @returns {string}
 */
const buildSignData = (params) =>
  Object.keys(params)
    .sort()
    .map((key) => `${key}=${vnpEncode(params[key])}`)
    .join('&');

const sign = (data, secretKey) =>
  crypto.createHmac('sha512', secretKey).update(Buffer.from(data, 'utf-8')).digest('hex');

/**
 * Tạo URL thanh toán VNPay (redirect flow) cho 1 hóa đơn.
 * @param {object} params
 * @param {string} params.txnRef - mã tham chiếu giao dịch, duy nhất, tối đa 34 ký tự
 * @param {number} params.amount - số tiền VNĐ (chưa nhân 100)
 * @param {string} params.orderInfo
 * @param {string} params.ipAddr - IP của khách hàng (bắt buộc)
 * @returns {{payUrl: string, createDate: string}}
 */
export const createVnpayPaymentUrl = ({ txnRef, amount, orderInfo, ipAddr }) => {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const vnpUrl = process.env.VNPAY_URL;
  const returnUrl = process.env.VNPAY_RETURN_URL;

  const createDate = formatVnpayDate(new Date());
  const expireDate = formatVnpayDate(new Date(Date.now() + 15 * 60 * 1000));

  const params = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: tmnCode,
    vnp_Amount: String(Math.round(amount) * 100),
    vnp_CurrCode: 'VND',
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: 'other',
    vnp_Locale: 'vn',
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
    vnp_ExpireDate: expireDate,
  };

  const signData = buildSignData(params);
  const secureHash = sign(signData, secretKey);

  const payUrl = `${vnpUrl}?${signData}&vnp_SecureHash=${secureHash}`;

  return { payUrl, createDate };
};

/**
 * Xác thực chữ ký của return/IPN request từ VNPay.
 * @param {Record<string,string>} query - req.query gốc (đã bị Express decode)
 * @returns {boolean}
 */
export const verifyVnpaySignature = (query) => {
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const { vnp_SecureHash, vnp_SecureHashType, ...rest } = query;

  if (!vnp_SecureHash) return false;

  const signData = buildSignData(rest);
  const expectedHash = sign(signData, secretKey);

  return expectedHash.toLowerCase() === String(vnp_SecureHash).toLowerCase();
};

/**
 * Truy vấn trạng thái giao dịch trực tiếp từ VNPay (API querydr) — dùng để đối soát
 * khi IPN không tới được server.
 * @param {string} txnRef
 * @param {string} transactionDate - vnp_CreateDate gốc lúc tạo giao dịch ('yyyyMMddHHmmss')
 * @param {string} ipAddr - IP server gọi API (VNPay yêu cầu, không cần là IP khách hàng)
 * @returns {Promise<object>}
 */
export const queryVnpayTransactionStatus = async (txnRef, transactionDate, ipAddr) => {
  const tmnCode = process.env.VNPAY_TMN_CODE;
  const secretKey = process.env.VNPAY_HASH_SECRET;
  const apiUrl = process.env.VNPAY_API_URL;

  const requestId = crypto.randomUUID().replace(/-/g, '').slice(0, 20);
  const createDate = formatVnpayDate(new Date());

  const params = {
    vnp_RequestId: requestId,
    vnp_Version: '2.1.0',
    vnp_Command: 'querydr',
    vnp_TmnCode: tmnCode,
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: `Truy van giao dich ${txnRef}`,
    vnp_TransactionDate: transactionDate,
    vnp_CreateDate: createDate,
    vnp_IpAddr: ipAddr,
  };

  const signData = buildSignData(params);
  params.vnp_SecureHash = sign(signData, secretKey);

  const { data } = await axios.post(apiUrl, params, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000,
  });

  return data;
};
