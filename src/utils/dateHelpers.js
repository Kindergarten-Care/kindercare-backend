// Tất cả month key trong hệ thống dùng format 'MM-YYYY' (khớp convention hiện có
// của Invoices.BillingMonth và StudentExtracurriculars.RegisteredMonth).

/**
 * Chuyển unix timestamp (giây) thành month key 'MM-YYYY' theo giờ UTC.
 * @param {number} timestamp
 * @returns {string}
 */
export const getMonthKey = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const year = date.getUTCFullYear();
  return `${month}-${year}`;
};

const parseMonthKey = (monthKey) => {
  const [monthStr, yearStr] = monthKey.split('-');
  return { month: parseInt(monthStr, 10), year: parseInt(yearStr, 10) };
};

/**
 * Số tháng chênh lệch giữa startMonth và curMonth (cả hai dạng 'MM-YYYY').
 * @param {string} startMonth
 * @param {string} curMonth
 * @returns {number}
 */
export const monthIndex = (startMonth, curMonth) => {
  const start = parseMonthKey(startMonth);
  const cur = parseMonthKey(curMonth);
  return (cur.year - start.year) * 12 + (cur.month - start.month);
};

/**
 * Cộng n tháng vào month key (dạng 'MM-YYYY').
 * @param {string} monthKey
 * @param {number} n
 * @returns {string}
 */
export const addMonths = (monthKey, n) => {
  const { month, year } = parseMonthKey(monthKey);
  const total = (month - 1) + n;
  const newYear = year + Math.floor(total / 12);
  const newMonth = ((total % 12) + 12) % 12 + 1;
  return `${String(newMonth).padStart(2, '0')}-${newYear}`;
};

/**
 * Danh sách month key liên tiếp bắt đầu từ startMonth, độ dài count.
 * @param {string} startMonth
 * @param {number} count
 * @returns {string[]}
 */
export const monthRange = (startMonth, count) => {
  const months = [];
  for (let i = 0; i < count; i++) {
    months.push(addMonths(startMonth, i));
  }
  return months;
};
