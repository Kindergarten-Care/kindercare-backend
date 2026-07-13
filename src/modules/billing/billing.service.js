import pool from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';
import { monthIndex, addMonths, getMonthKey } from '../../utils/dateHelpers.js';
import { sendPushToUser } from '../notification/notification.service.js';
import logger from '../../config/logger.js';

const REMINDER_LEAD_DAYS = 3;
const SECONDS_PER_DAY = 86400;
const EXTRACURRICULAR_PENDING_EXPIRY_HOURS = 48;

const TZ_OFFSET_SECONDS = 7 * 60 * 60;

const parseMonthKeyToRange = (monthKey) => {
  const [monthStr, yearStr] = monthKey.split('-');
  const month = parseInt(monthStr, 10);
  const year = parseInt(yearStr, 10);
  const daysInMonth = new Date(year, month, 0).getDate();
  return { month, year, daysInMonth };
};

const DUE_DAY_OF_MONTH = 10;

/**
 * Hạn đóng của 1 hóa đơn = ngày 10 của billingMonth, 00:00 giờ GMT+7.
 * @param {string} billingMonth - 'MM-YYYY'
 * @returns {number} unix timestamp (giây)
 */
const getDueDate = (billingMonth) => {
  const { month, year } = parseMonthKeyToRange(billingMonth);
  return Math.floor(new Date(year, month - 1, DUE_DAY_OF_MONTH).getTime() / 1000) - TZ_OFFSET_SECONDS;
};

/**
 * Xác định 1 kỳ học phí đã "tới hạn" chưa, dựa trên chu kỳ của gói.
 * @param {{StartMonth: string}} plan
 * @param {{DurationInMonths: number}} pkg
 * @param {string} billingMonth - 'MM-YYYY'
 * @returns {boolean}
 */
export const isTuitionDue = (plan, pkg, billingMonth) => {
  const idx = monthIndex(plan.StartMonth, billingMonth);
  return idx >= 0 && idx % pkg.DurationInMonths === 0;
};

/**
 * Tính tiền học phí cho 1 kỳ (gross, discount, net, periodRange).
 * @param {{MonthlyTuitionSnapshot: number}} plan
 * @param {{DurationInMonths: number, DiscountPercentage: number}} pkg
 * @param {string} billingMonth - 'MM-YYYY', tháng bắt đầu kỳ
 */
export const tuitionForCycle = (plan, pkg, billingMonth) => {
  const gross = pkg.DurationInMonths * Number(plan.MonthlyTuitionSnapshot);
  const discount = gross * (Number(pkg.DiscountPercentage) || 0) / 100;
  const net = gross - discount;
  const endMonth = addMonths(billingMonth, pkg.DurationInMonths - 1);
  return {
    tuitionFee: gross,
    discountAmount: discount,
    totalNet: net,
    periodRange: `${billingMonth} - ${endMonth}`,
  };
};

/**
 * Lấy MonthlyTuition hiện hành (BaseFees) theo năm học của lớp bé đang học.
 * @param {number} studentId
 */
const getMonthlyTuitionForStudent = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT bf.MonthlyTuition AS monthlyTuition
     FROM Students s
     JOIN Classes c ON s.ClassID = c.ClassID
     JOIN BaseFees bf ON bf.YearID = c.YearID
     WHERE s.StudentID = ?`,
    [studentId]
  );
  if (rows.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Không tìm thấy học phí cơ bản cho lớp/năm học của học sinh này');
  }
  return Number(rows[0].monthlyTuition);
};

const getPackageById = async (packageId) => {
  const [rows] = await pool.query(
    'SELECT PackageID, PackageName, DurationInMonths, DiscountPercentage FROM PaymentPackages WHERE PackageID = ?',
    [packageId]
  );
  if (rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy gói học phí');
  }
  return rows[0];
};

/**
 * Tạo 1 hóa đơn HỌC PHÍ cho 1 kỳ (idempotent — bỏ qua nếu đã tồn tại).
 * @param {object} plan - StudentTuitionPlans row
 * @param {object} pkg - PaymentPackages row
 * @param {string} billingMonth - 'MM-YYYY'
 * @returns {Promise<object|null>} invoice đã tạo, hoặc null nếu đã tồn tại
 */
export const generateTuitionInvoice = async (plan, pkg, billingMonth) => {
  const { tuitionFee, discountAmount, periodRange } = tuitionForCycle(plan, pkg, billingMonth);

  try {
    const [result] = await pool.query(
      `INSERT INTO Invoices
         (StudentID, PackageID, PeriodRange, BillingMonth, TuitionFee, DiscountAmount, InvoiceType, DueDate, Published)
       VALUES (?, ?, ?, ?, ?, ?, 'TUITION', NULL, 0)`,
      [plan.StudentID, plan.PackageID, periodRange, billingMonth, tuitionFee, discountAmount]
    );
    return { invoiceId: result.insertId, tuitionFee, discountAmount, periodRange, billingMonth };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return null;
    }
    throw error;
  }
};

/**
 * Đăng ký gói học phí cho học sinh — snapshot giá, tạo plan và hóa đơn kỳ đầu.
 * @param {number} studentId
 * @param {number} packageId
 * @param {string} [startMonth] - 'MM-YYYY', default = tháng hiện tại
 */
export const registerTuitionPlan = async (studentId, packageId, startMonth) => {
  const [studentRows] = await pool.query('SELECT StudentID FROM Students WHERE StudentID = ?', [studentId]);
  if (studentRows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy học sinh');
  }

  const pkg = await getPackageById(packageId);
  const monthlyTuition = await getMonthlyTuitionForStudent(studentId);
  const resolvedStartMonth = startMonth || getMonthKey(Math.floor(Date.now() / 1000));

  const [planResult] = await pool.query(
    `INSERT INTO StudentTuitionPlans (StudentID, PackageID, StartMonth, MonthlyTuitionSnapshot, Status)
     VALUES (?, ?, ?, ?, 'Active')`,
    [studentId, packageId, resolvedStartMonth, monthlyTuition]
  );

  const plan = {
    PlanID: planResult.insertId,
    StudentID: studentId,
    PackageID: packageId,
    StartMonth: resolvedStartMonth,
    MonthlyTuitionSnapshot: monthlyTuition,
  };

  const tuitionInvoice = await generateTuitionInvoice(plan, pkg, resolvedStartMonth);
  const monthlyInvoice = await generateMonthlyInvoice(studentId, resolvedStartMonth);

  return { plan, tuitionInvoice, monthlyInvoice };
};

/**
 * Số ngày công (T2–T6, trừ ngày lễ) trong 1 tháng.
 * @param {string} billingMonth - 'MM-YYYY'
 * @returns {Promise<number>}
 */
export const workingDays = async (billingMonth) => {
  const { month, year, daysInMonth } = parseMonthKeyToRange(billingMonth);

  let weekdayCount = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = new Date(year, month - 1, d).getDay(); // 0=Sun..6=Sat
    if (dayOfWeek >= 1 && dayOfWeek <= 5) weekdayCount++;
  }

  const monthStartSec = Math.floor(new Date(year, month - 1, 1).getTime() / 1000) - TZ_OFFSET_SECONDS;
  const monthEndSec = Math.floor(new Date(year, month - 1, daysInMonth, 23, 59, 59).getTime() / 1000) - TZ_OFFSET_SECONDS;

  const [holidayRows] = await pool.query(
    'SELECT HolidayDate FROM Holidays WHERE HolidayDate BETWEEN ? AND ?',
    [monthStartSec, monthEndSec]
  );

  let holidayWeekdayCount = 0;
  for (const row of holidayRows) {
    const localDate = new Date((Number(row.HolidayDate) + TZ_OFFSET_SECONDS) * 1000);
    const dayOfWeek = localDate.getUTCDay();
    if (dayOfWeek >= 1 && dayOfWeek <= 5) holidayWeekdayCount++;
  }

  return weekdayCount - holidayWeekdayCount;
};

/**
 * Lấy DailyMealFee hiện hành theo năm học của lớp bé (live, không snapshot).
 * @param {number} studentId
 */
const getDailyMealFeeForStudent = async (studentId) => {
  const [rows] = await pool.query(
    `SELECT bf.DailyMealFee AS dailyMealFee
     FROM Students s
     JOIN Classes c ON s.ClassID = c.ClassID
     JOIN BaseFees bf ON bf.YearID = c.YearID
     WHERE s.StudentID = ?`,
    [studentId]
  );
  if (rows.length === 0) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Không tìm thấy học phí cơ bản cho lớp/năm học của học sinh này');
  }
  return Number(rows[0].dailyMealFee);
};

/**
 * Tiền ăn dự kiến (thu trước) cho 1 học sinh trong 1 tháng.
 * @param {number} studentId
 * @param {string} billingMonth - 'MM-YYYY'
 */
export const expectedMealFee = async (studentId, billingMonth) => {
  const [days, dailyFee] = await Promise.all([
    workingDays(billingMonth),
    getDailyMealFeeForStudent(studentId),
  ]);
  return days * dailyFee;
};

/**
 * Tiền hoàn tiền ăn của tháng trước (nghỉ có phép, được miễn tiền ăn).
 * Đơn nghỉ đã auto-Approved sẵn — chỉ cần lọc IsMealFeeDeducted=1.
 * @param {number} studentId
 * @param {string} prevMonth - 'MM-YYYY'
 */
export const refundForPrevMonth = async (studentId, prevMonth) => {
  const { month, year, daysInMonth } = parseMonthKeyToRange(prevMonth);
  const monthStartSec = Math.floor(new Date(year, month - 1, 1).getTime() / 1000) - TZ_OFFSET_SECONDS;
  const monthEndSec = Math.floor(new Date(year, month - 1, daysInMonth, 23, 59, 59).getTime() / 1000) - TZ_OFFSET_SECONDS;

  const [rows] = await pool.query(
    `SELECT FromDate, ToDate
     FROM LeaveRequests
     WHERE StudentID = ? AND IsMealFeeDeducted = 1
       AND FromDate <= ? AND ToDate >= ?`,
    [studentId, monthEndSec, monthStartSec]
  );

  if (rows.length === 0) return 0;

  const dailyFee = await getDailyMealFeeForStudent(studentId);

  let deductedDays = 0;
  for (const row of rows) {
    const from = Math.max(Number(row.FromDate), monthStartSec);
    const to = Math.min(Number(row.ToDate), monthEndSec);
    for (let sec = from; sec <= to; sec += 86400) {
      const localDate = new Date((sec + TZ_OFFSET_SECONDS) * 1000);
      const dayOfWeek = localDate.getUTCDay();
      if (dayOfWeek >= 1 && dayOfWeek <= 5) deductedDays++;
    }
  }

  return deductedDays * dailyFee;
};

/**
 * Tạo 1 phiếu thu HÀNG THÁNG cho 1 học sinh (idempotent — bỏ qua nếu đã tồn tại).
 * @param {number} studentId
 * @param {string} billingMonth - 'MM-YYYY'
 * @returns {Promise<object|null>} invoice đã tạo, hoặc null nếu đã tồn tại
 */
export const generateMonthlyInvoice = async (studentId, billingMonth) => {
  const prevMonth = addMonths(billingMonth, -1);

  const [meal, refund] = await Promise.all([
    expectedMealFee(studentId, billingMonth),
    refundForPrevMonth(studentId, prevMonth),
  ]);

  try {
    const [result] = await pool.query(
      `INSERT INTO Invoices
         (StudentID, BillingMonth, ExpectedMealFee, Surcharge, RefundAmount, InvoiceType, DueDate, Published)
       VALUES (?, ?, ?, 0, ?, 'MONTHLY', NULL, 0)`,
      [studentId, billingMonth, meal, refund]
    );
    return {
      invoiceId: result.insertId,
      billingMonth,
      expectedMealFee: meal,
      refundAmount: refund,
    };
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return null;
    }
    throw error;
  }
};

/**
 * Cron đầu tháng — chạy cho toàn trường. Với mỗi học sinh có plan Active:
 * tới kỳ → tạo hóa đơn TUITION; luôn tạo phiếu MONTHLY. Idempotent nhờ
 * UNIQUE(StudentID, BillingMonth, InvoiceType) — chạy lại không tạo trùng.
 * @param {string} [billingMonth] - 'MM-YYYY', default = tháng hiện tại
 */
export const runMonthlyBilling = async (billingMonth) => {
  const resolvedBillingMonth = billingMonth || getMonthKey(Math.floor(Date.now() / 1000));

  const [plans] = await pool.query(
    `SELECT stp.PlanID, stp.StudentID, stp.PackageID, stp.StartMonth, stp.MonthlyTuitionSnapshot,
            pp.PackageID AS pkgId, pp.PackageName, pp.DurationInMonths, pp.DiscountPercentage
     FROM StudentTuitionPlans stp
     JOIN PaymentPackages pp ON stp.PackageID = pp.PackageID
     WHERE stp.Status = 'Active'`
  );

  let tuitionCount = 0;
  let monthlyCount = 0;
  let skipped = 0;
  const failedStudentIds = [];

  for (const row of plans) {
    const plan = {
      PlanID: row.PlanID,
      StudentID: row.StudentID,
      PackageID: row.PackageID,
      StartMonth: row.StartMonth,
      MonthlyTuitionSnapshot: row.MonthlyTuitionSnapshot,
    };
    const pkg = {
      PackageID: row.pkgId,
      PackageName: row.PackageName,
      DurationInMonths: row.DurationInMonths,
      DiscountPercentage: row.DiscountPercentage,
    };

    try {
      if (isTuitionDue(plan, pkg, resolvedBillingMonth)) {
        const tuitionInvoice = await generateTuitionInvoice(plan, pkg, resolvedBillingMonth);
        if (tuitionInvoice) tuitionCount++;
        else skipped++;
      }

      const monthlyInvoice = await generateMonthlyInvoice(row.StudentID, resolvedBillingMonth);
      if (monthlyInvoice) monthlyCount++;
      else skipped++;
    } catch (error) {
      // Lỗi ở 1 học sinh (vd. thiếu BaseFees cho lớp/năm học) không được làm dừng cả cron —
      // ghi nhận lại để hiệu trưởng biết học sinh nào chưa có hóa đơn tháng này, xử lý thủ công.
      logger.error(`[Billing] Lỗi khi tạo hóa đơn cho StudentID ${row.StudentID}: ${error.message}`);
      failedStudentIds.push(row.StudentID);
    }
  }

  let extracurricularCount = 0;
  try {
    extracurricularCount = await renewExtracurricularEnrollments(resolvedBillingMonth);
  } catch (error) {
    logger.error(`[Billing] Lỗi khi gia hạn ngoại khóa cho ${resolvedBillingMonth}: ${error.message}`);
  }

  return {
    billingMonth: resolvedBillingMonth,
    generated: { tuition: tuitionCount, monthly: monthlyCount, extracurricular: extracurricularCount },
    skipped,
    failedStudentIds,
  };
};

/**
 * Gia hạn ngoại khóa sang billingMonth cho mọi enrollment Active của tháng
 * liền trước — tạo enrollment mới Status='Pending' (phụ huynh phải thanh
 * toán lại mỗi tháng, không tự động Active) + cộng phí vào invoice
 * EXTRACURRICULAR của tháng đó. Idempotent nhờ UNIQUE(StudentID, ActivityID,
 * RegisteredMonth) trên StudentExtracurriculars.
 * @param {string} billingMonth - 'MM-YYYY'
 * @returns {Promise<number>} số enrollment đã gia hạn
 */
const renewExtracurricularEnrollments = async (billingMonth) => {
  const prevMonth = addMonths(billingMonth, -1);

  const [activeEnrollments] = await pool.query(
    `SELECT se.StudentID, se.ActivityID, e.MonthlyFee
     FROM StudentExtracurriculars se
     JOIN Extracurriculars e ON se.ActivityID = e.ActivityID
     WHERE se.RegisteredMonth = ? AND se.Status = 'Active'`,
    [prevMonth]
  );

  let renewedCount = 0;
  for (const enrollment of activeEnrollments) {
    try {
      const invoiceId = await addToExtracurricularInvoice(enrollment.StudentID, billingMonth, enrollment.MonthlyFee);
      await pool.query(
        `INSERT INTO StudentExtracurriculars (StudentID, ActivityID, RegisteredMonth, Status, InvoiceID)
         VALUES (?, ?, ?, 'Pending', ?)`,
        [enrollment.StudentID, enrollment.ActivityID, billingMonth, invoiceId]
      );
      renewedCount++;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') continue;
      // Lỗi ở 1 enrollment không được làm dừng cả vòng gia hạn — các enrollment còn lại
      // vẫn phải được xử lý, học sinh lỗi sẽ không có invoice ngoại khóa tháng này.
      logger.error(
        `[Billing] Lỗi khi gia hạn ngoại khóa StudentID ${enrollment.StudentID}, ActivityID ${enrollment.ActivityID}: ${error.message}`
      );
    }
  }
  return renewedCount;
};

const getInvoiceById = async (invoiceId) => {
  const [rows] = await pool.query('SELECT * FROM Invoices WHERE InvoiceID = ?', [invoiceId]);
  if (rows.length === 0) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Không tìm thấy hóa đơn');
  }
  return rows[0];
};

/**
 * Thêm phụ thu vào 1 hóa đơn (cộng dồn vào Surcharge hiện có).
 * Tính lại PaymentStatus ngay sau đó vì Surcharge làm TotalAmount (generated
 * column) tăng — invoice đã Paid trước đó có thể rơi về Partial/Unpaid.
 * @param {number} invoiceId
 * @param {number} amount
 * @param {string} [note]
 */
export const addSurcharge = async (invoiceId, amount, note) => {
  await getInvoiceById(invoiceId);

  await pool.query(
    'UPDATE Invoices SET Surcharge = Surcharge + ? WHERE InvoiceID = ?',
    [amount, invoiceId]
  );

  await recalculateInvoicePaymentStatus(invoiceId);

  return getInvoiceById(invoiceId);
};

/**
 * Sửa hạn đóng của 1 hóa đơn (gia hạn/rút ngắn thủ công bởi hiệu trưởng).
 * Reset ReminderSentAt/OverdueReminderSentAt để cron nhắc nhở tính lại đúng
 * theo hạn mới, tránh bỏ sót nhắc nhở khi gia hạn hoặc nhắc sai khi rút ngắn hạn.
 * @param {number} invoiceId
 * @param {number} dueDate - unix timestamp (giây)
 */
export const updateDueDate = async (invoiceId, dueDate) => {
  await getInvoiceById(invoiceId);

  await pool.query(
    'UPDATE Invoices SET DueDate = ?, ReminderSentAt = NULL, OverdueReminderSentAt = NULL WHERE InvoiceID = ?',
    [dueDate, invoiceId]
  );

  return getInvoiceById(invoiceId);
};

/**
 * Công khai toàn bộ hóa đơn TUITION/MONTHLY nháp (Published=0) của 1 tháng cho
 * phụ huynh thấy và thanh toán. Hóa đơn EXTRACURRICULAR không thuộc quy trình
 * duyệt này nên không bị điều kiện InvoiceType đụng tới.
 * DueDate = thời điểm publish + 10 ngày (không phải ngày 10 cố định của
 * billingMonth) — để hiệu trưởng publish trễ không làm phụ huynh bị rút ngắn
 * thời gian đóng tiền.
 * @param {string} billingMonth - 'MM-YYYY'
 * @returns {Promise<{billingMonth: string, publishedCount: number}>}
 */
export const publishInvoicesForMonth = async (billingMonth) => {
  const [result] = await pool.query(
    `UPDATE Invoices
     SET Published = 1,
         PublishedAt = UNIX_TIMESTAMP(),
         DueDate = UNIX_TIMESTAMP() + 10 * 86400
     WHERE BillingMonth = ? AND InvoiceType IN ('TUITION', 'MONTHLY') AND Published = 0`,
    [billingMonth]
  );
  return { billingMonth, publishedCount: result.affectedRows };
};

/**
 * Công khai 1 tập hóa đơn TUITION/MONTHLY nháp được chọn tùy ý (bulk-select
 * trên UI) — không phải toàn bộ tháng, không phải chỉ 1 cái. ID nào không hợp
 * lệ (không tồn tại, EXTRACURRICULAR, hoặc đã publish rồi) bị bỏ qua thay vì
 * làm hỏng cả batch — trả về rõ đã công khai được gì và bỏ qua gì để FE báo
 * lại cho hiệu trưởng.
 * @param {number[]} invoiceIds
 * @returns {Promise<{publishedCount: number, publishedIds: number[], skippedIds: number[]}>}
 */
export const publishSelectedInvoices = async (invoiceIds) => {
  const uniqueIds = [...new Set(invoiceIds)];

  const [rows] = await pool.query(
    `SELECT InvoiceID, InvoiceType, Published FROM Invoices WHERE InvoiceID IN (?)`,
    [uniqueIds]
  );
  const rowById = new Map(rows.map((r) => [r.InvoiceID, r]));

  const publishableIds = [];
  const skippedIds = [];
  for (const id of uniqueIds) {
    const row = rowById.get(id);
    if (!row || row.InvoiceType === 'EXTRACURRICULAR' || row.Published) {
      skippedIds.push(id);
    } else {
      publishableIds.push(id);
    }
  }

  if (publishableIds.length === 0) {
    return { publishedCount: 0, publishedIds: [], skippedIds };
  }

  await pool.query(
    `UPDATE Invoices
     SET Published = 1, PublishedAt = UNIX_TIMESTAMP(), DueDate = UNIX_TIMESTAMP() + 10 * 86400
     WHERE InvoiceID IN (?)`,
    [publishableIds]
  );

  return { publishedCount: publishableIds.length, publishedIds: publishableIds, skippedIds };
};

/**
 * Công khai 1 hóa đơn TUITION/MONTHLY nháp riêng lẻ (sau khi hiệu trưởng đã
 * sửa surcharge/due-date cho đúng). Không áp dụng cho EXTRACURRICULAR (luôn
 * Published=1 sẵn từ lúc tạo) hoặc hóa đơn đã publish trước đó.
 * @param {number} invoiceId
 */
export const publishInvoice = async (invoiceId) => {
  const invoice = await getInvoiceById(invoiceId);

  if (invoice.InvoiceType === 'EXTRACURRICULAR') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Hóa đơn ngoại khóa không thuộc quy trình duyệt/công khai');
  }
  if (invoice.Published) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Hóa đơn đã được công khai trước đó');
  }

  await pool.query(
    `UPDATE Invoices
     SET Published = 1, PublishedAt = UNIX_TIMESTAMP(), DueDate = UNIX_TIMESTAMP() + 10 * 86400
     WHERE InvoiceID = ?`,
    [invoiceId]
  );

  return getInvoiceById(invoiceId);
};

/**
 * Tính lại PaymentStatus của 1 hóa đơn dựa trên tổng các Transaction đã Success
 * so với TotalAmount hiện tại (TotalAmount là generated column, tự đổi theo
 * ExtracurricularFee/Surcharge/...). Kích hoạt ngoại khóa nếu chuyển thành Paid.
 * Dùng chung cho mọi nơi có thể làm lệch PaymentStatus: ghi nhận thanh toán,
 * IPN, và các thay đổi phí sau khi đã có transaction (hủy hoạt động, đăng ký thêm).
 * @param {number} invoiceId
 * @returns {Promise<{totalPaid: number, totalAmount: number, paymentStatus: string}>}
 */
export const recalculateInvoicePaymentStatus = async (invoiceId) => {
  const [[{ totalPaid }]] = await pool.query(
    `SELECT COALESCE(SUM(AmountPaid), 0) AS totalPaid
     FROM Transactions WHERE InvoiceID = ? AND Status = 'Success'`,
    [invoiceId]
  );
  const invoice = await getInvoiceById(invoiceId);
  const totalAmount = Number(invoice.TotalAmount);

  let paymentStatus = 'Unpaid';
  if (totalAmount === 0) {
    paymentStatus = Number(totalPaid) > 0 ? 'Paid' : 'Unpaid';
  } else if (Number(totalPaid) >= totalAmount) {
    paymentStatus = 'Paid';
  } else if (Number(totalPaid) > 0) {
    paymentStatus = 'Partial';
  }

  await pool.query('UPDATE Invoices SET PaymentStatus = ? WHERE InvoiceID = ?', [paymentStatus, invoiceId]);
  if (paymentStatus === 'Paid') {
    await activateExtracurricularsForInvoice(invoiceId);
  }

  return { totalPaid: Number(totalPaid), totalAmount, paymentStatus };
};

/**
 * Ghi nhận thanh toán cho 1 hóa đơn — insert Transaction, cập nhật PaymentStatus
 * dựa trên SUM(AmountPaid) các transaction Success so với TotalAmount.
 * @param {number} invoiceId
 * @param {number} amountPaid
 * @param {string} method
 * @param {string} [code]
 */
export const recordPayment = async (invoiceId, amountPaid, method, code) => {
  await getInvoiceById(invoiceId);

  const [txResult] = await pool.query(
    `INSERT INTO Transactions (InvoiceID, AmountPaid, PaymentMethod, TransactionCode, Status)
     VALUES (?, ?, ?, ?, 'Success')`,
    [invoiceId, amountPaid, method, code || null]
  );

  const { totalPaid, totalAmount, paymentStatus } = await recalculateInvoicePaymentStatus(invoiceId);

  return {
    transactionId: txResult.insertId,
    invoiceId,
    amountPaid,
    totalPaid,
    totalAmount,
    paymentStatus,
  };
};

/**
 * Khi 1 invoice EXTRACURRICULAR được thanh toán đủ (Paid), kích hoạt
 * (Status='Active') mọi enrollment Pending gắn với invoice đó. Gọi từ
 * cả recordPayment (thanh toán thủ công) và MoMo IPN handler.
 * @param {number} invoiceId
 */
export const activateExtracurricularsForInvoice = async (invoiceId) => {
  await pool.query(
    `UPDATE StudentExtracurriculars SET Status = 'Active', ActivatedAt = UNIX_TIMESTAMP(NOW())
     WHERE InvoiceID = ? AND Status = 'Pending'`,
    [invoiceId]
  );
};

/**
 * Lấy hoặc tạo invoice EXTRACURRICULAR Unpaid cho 1 học sinh/tháng, rồi
 * cộng thêm phí hoạt động mới vào ExtracurricularFee (gộp nhiều hoạt
 * động đăng ký cùng tháng vào 1 invoice duy nhất).
 * @param {number} studentId
 * @param {string} billingMonth - 'MM-YYYY'
 * @param {number} activityFee
 * @returns {Promise<number>} invoiceId
 */
export const addToExtracurricularInvoice = async (studentId, billingMonth, activityFee) => {
  // Không lọc theo PaymentStatus — Invoices có UNIQUE(StudentID, BillingMonth, InvoiceType),
  // nên chỉ có đúng 1 invoice EXTRACURRICULAR/học sinh/tháng dù đã Paid hay chưa. Lọc bỏ
  // invoice đã Paid ở đây từng khiến code rơi xuống nhánh INSERT bên dưới và đụng unique
  // constraint (Duplicate entry) khi đăng ký thêm hoạt động thứ 2 trong tháng đã thanh toán.
  const [existing] = await pool.query(
    `SELECT InvoiceID, PaymentStatus FROM Invoices
     WHERE StudentID = ? AND BillingMonth = ? AND InvoiceType = 'EXTRACURRICULAR'`,
    [studentId, billingMonth]
  );

  if (existing.length > 0) {
    const { InvoiceID: invoiceId, PaymentStatus: previousStatus } = existing[0];
    await pool.query(
      'UPDATE Invoices SET ExtracurricularFee = ExtracurricularFee + ? WHERE InvoiceID = ?',
      [activityFee, invoiceId]
    );

    if (previousStatus === 'Paid') {
      // Invoice này vừa được cộng thêm phí sau khi đã Paid từ trước — TotalAmount (generated
      // column) vừa tăng theo ExtracurricularFee, cần tính lại PaymentStatus theo tổng mới
      // (thường rơi về Partial, nhưng để recalculateInvoicePaymentStatus quyết định cho đúng).
      await recalculateInvoicePaymentStatus(invoiceId);
    }

    return invoiceId;
  }

  const dueDate = getDueDate(billingMonth);
  const [result] = await pool.query(
    `INSERT INTO Invoices (StudentID, BillingMonth, ExtracurricularFee, InvoiceType, PaymentStatus, DueDate)
     VALUES (?, ?, ?, 'EXTRACURRICULAR', 'Unpaid', ?)`,
    [studentId, billingMonth, activityFee, dueDate]
  );
  return result.insertId;
};

/**
 * Quét các hóa đơn chưa Paid cần nhắc hạn đóng, gửi push cho phụ huynh của học sinh.
 * Chạy hàng ngày. Đánh dấu ReminderSentAt/OverdueReminderSentAt để không gửi trùng.
 * - Sắp tới hạn: còn đúng REMINDER_LEAD_DAYS ngày, chưa từng nhắc.
 * - Quá hạn: đã qua DueDate, chưa từng nhắc quá hạn (chỉ nhắc 1 lần).
 * @param {number} [nowSec] - unix timestamp hiện tại (giây), default = Date.now()
 */
export const sendPaymentReminders = async (nowSec) => {
  const now = nowSec ?? Math.floor(Date.now() / 1000);
  const upcomingThreshold = now + REMINDER_LEAD_DAYS * SECONDS_PER_DAY;

  const [upcomingInvoices] = await pool.query(
    `SELECT i.InvoiceID, i.StudentID, i.DueDate, i.TotalAmount, i.InvoiceType, i.BillingMonth
     FROM Invoices i
     WHERE i.PaymentStatus != 'Paid'
       AND (i.InvoiceType = 'EXTRACURRICULAR' OR i.Published = 1)
       AND i.DueDate IS NOT NULL
       AND i.DueDate <= ? AND i.DueDate > ?
       AND i.ReminderSentAt IS NULL`,
    [upcomingThreshold, now]
  );

  const [overdueInvoices] = await pool.query(
    `SELECT i.InvoiceID, i.StudentID, i.DueDate, i.TotalAmount, i.InvoiceType, i.BillingMonth
     FROM Invoices i
     WHERE i.PaymentStatus != 'Paid'
       AND (i.InvoiceType = 'EXTRACURRICULAR' OR i.Published = 1)
       AND i.DueDate IS NOT NULL
       AND i.DueDate <= ?
       AND i.OverdueReminderSentAt IS NULL`,
    [now]
  );

  let upcomingSent = 0;
  let overdueSent = 0;

  for (const invoice of upcomingInvoices) {
    try {
      const sent = await notifyParentsOfInvoice(invoice, 'upcoming');
      if (sent) {
        await pool.query('UPDATE Invoices SET ReminderSentAt = ? WHERE InvoiceID = ?', [now, invoice.InvoiceID]);
        upcomingSent++;
      }
    } catch (error) {
      // Lỗi gửi nhắc cho 1 invoice (vd. push lỗi) không được làm dừng cả vòng quét —
      // ReminderSentAt không set nên cron ngày sau sẽ tự thử lại cho tới khi quá hạn 3 ngày.
      logger.error(`[Payment Reminder] Lỗi khi nhắc sắp đến hạn InvoiceID ${invoice.InvoiceID}: ${error.message}`);
    }
  }

  for (const invoice of overdueInvoices) {
    try {
      const sent = await notifyParentsOfInvoice(invoice, 'overdue');
      if (sent) {
        await pool.query('UPDATE Invoices SET OverdueReminderSentAt = ? WHERE InvoiceID = ?', [now, invoice.InvoiceID]);
        overdueSent++;
      }
    } catch (error) {
      logger.error(`[Payment Reminder] Lỗi khi nhắc quá hạn InvoiceID ${invoice.InvoiceID}: ${error.message}`);
    }
  }

  return { upcomingSent, overdueSent };
};

const notifyParentsOfInvoice = async (invoice, kind) => {
  const [parentRows] = await pool.query(
    'SELECT ParentID FROM StudentParents WHERE StudentID = ?',
    [invoice.StudentID]
  );
  if (parentRows.length === 0) return false;

  const studentLabel = `học sinh ID ${invoice.StudentID}`;
  const amount = Number(invoice.TotalAmount).toLocaleString('vi-VN');
  const title = kind === 'upcoming' ? 'Sắp đến hạn đóng học phí' : 'Hóa đơn đã quá hạn thanh toán';
  const body = kind === 'upcoming'
    ? `Hóa đơn tháng ${invoice.BillingMonth} của ${studentLabel} (${amount}đ) sắp đến hạn đóng. Vui lòng thanh toán sớm.`
    : `Hóa đơn tháng ${invoice.BillingMonth} của ${studentLabel} (${amount}đ) đã quá hạn thanh toán. Vui lòng thanh toán để tránh gián đoạn dịch vụ.`;

  const results = await Promise.allSettled(
    parentRows.map((row) =>
      sendPushToUser(
        row.ParentID,
        title,
        body,
        { type: 'INVOICE_REMINDER', invoiceId: String(invoice.InvoiceID), studentId: String(invoice.StudentID), kind },
        kind === 'overdue'
      )
    )
  );
  results.forEach((result, i) => {
    if (result.status === 'rejected') {
      logger.error(
        `[Payment Reminder] Lỗi gửi push ParentID ${parentRows[i].ParentID} cho InvoiceID ${invoice.InvoiceID}: ${result.reason?.message}`
      );
    }
  });

  return true;
};

/**
 * Tự động hủy các enrollment ngoại khóa còn Pending quá 48h kể từ lúc
 * đăng ký/gia hạn (CreatedAt) — coi như phụ huynh không thanh toán.
 * Trừ đúng số tiền hoạt động đó ra khỏi ExtracurricularFee của invoice
 * liên kết (không xóa/hủy invoice — có thể còn hoạt động khác trong đó
 * vẫn Pending/Active).
 * @param {number} [nowSec] - unix timestamp hiện tại (giây), default = Date.now()
 * @returns {Promise<number>} số enrollment đã bị hủy
 */
export const expirePendingExtracurriculars = async (nowSec) => {
  const now = nowSec ?? Math.floor(Date.now() / 1000);
  const expiryThreshold = now - EXTRACURRICULAR_PENDING_EXPIRY_HOURS * 3600;

  const [expiredRows] = await pool.query(
    `SELECT se.EnrollmentID, se.InvoiceID, e.MonthlyFee
     FROM StudentExtracurriculars se
     JOIN Extracurriculars e ON se.ActivityID = e.ActivityID
     WHERE se.Status = 'Pending' AND se.CreatedAt <= ?`,
    [expiryThreshold]
  );

  for (const row of expiredRows) {
    // Status='Expired' (khác 'Cancelled' của hủy tay) và FeeRefunded=1 vì trường hợp này
    // CÓ trừ tiền khỏi invoice — registerExtracurricular dựa vào FeeRefunded để biết có
    // cần cộng phí mới khi đăng ký lại hay không (xem parent.service.js).
    await pool.query(
      "UPDATE StudentExtracurriculars SET Status = 'Expired', FeeRefunded = 1 WHERE EnrollmentID = ?",
      [row.EnrollmentID]
    );
    if (row.InvoiceID) {
      await pool.query(
        'UPDATE Invoices SET ExtracurricularFee = GREATEST(ExtracurricularFee - ?, 0) WHERE InvoiceID = ?',
        [row.MonthlyFee, row.InvoiceID]
      );
      // ExtracurricularFee vừa giảm kéo TotalAmount (generated column) giảm theo — nếu invoice
      // còn hoạt động khác đã thanh toán trong đó, số đã trả có thể giờ đủ/dư cho TotalAmount
      // mới và phải chuyển Paid, không được đứng yên ở PaymentStatus cũ.
      await recalculateInvoicePaymentStatus(row.InvoiceID);
    }
  }

  return expiredRows.length;
};
