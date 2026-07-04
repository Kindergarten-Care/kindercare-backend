import pool from '../../config/db.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';
import { monthIndex, addMonths, getMonthKey } from '../../utils/dateHelpers.js';
import { sendPushToUser } from '../notification/notification.service.js';

const REMINDER_LEAD_DAYS = 3;
const SECONDS_PER_DAY = 86400;

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
  const dueDate = getDueDate(billingMonth);

  try {
    const [result] = await pool.query(
      `INSERT INTO Invoices
         (StudentID, PackageID, PeriodRange, BillingMonth, TuitionFee, DiscountAmount, InvoiceType, DueDate)
       VALUES (?, ?, ?, ?, ?, ?, 'TUITION', ?)`,
      [plan.StudentID, plan.PackageID, periodRange, billingMonth, tuitionFee, discountAmount, dueDate]
    );
    return { invoiceId: result.insertId, tuitionFee, discountAmount, periodRange, billingMonth, dueDate };
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
  const dueDate = getDueDate(billingMonth);

  try {
    const [result] = await pool.query(
      `INSERT INTO Invoices
         (StudentID, BillingMonth, ExpectedMealFee, Surcharge, RefundAmount, InvoiceType, DueDate)
       VALUES (?, ?, ?, 0, ?, 'MONTHLY', ?)`,
      [studentId, billingMonth, meal, refund, dueDate]
    );
    return {
      invoiceId: result.insertId,
      billingMonth,
      expectedMealFee: meal,
      refundAmount: refund,
      dueDate,
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

    if (isTuitionDue(plan, pkg, resolvedBillingMonth)) {
      const tuitionInvoice = await generateTuitionInvoice(plan, pkg, resolvedBillingMonth);
      if (tuitionInvoice) tuitionCount++;
      else skipped++;
    }

    const monthlyInvoice = await generateMonthlyInvoice(row.StudentID, resolvedBillingMonth);
    if (monthlyInvoice) monthlyCount++;
    else skipped++;
  }

  const extracurricularCount = await renewExtracurricularEnrollments(resolvedBillingMonth);

  return {
    billingMonth: resolvedBillingMonth,
    generated: { tuition: tuitionCount, monthly: monthlyCount, extracurricular: extracurricularCount },
    skipped,
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
      if (error.code !== 'ER_DUP_ENTRY') throw error;
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
 * Ghi nhận thanh toán cho 1 hóa đơn — insert Transaction, cập nhật PaymentStatus
 * dựa trên SUM(AmountPaid) các transaction Success so với TotalAmount.
 * @param {number} invoiceId
 * @param {number} amountPaid
 * @param {string} method
 * @param {string} [code]
 */
export const recordPayment = async (invoiceId, amountPaid, method, code) => {
  const invoice = await getInvoiceById(invoiceId);

  const [txResult] = await pool.query(
    `INSERT INTO Transactions (InvoiceID, AmountPaid, PaymentMethod, TransactionCode, Status)
     VALUES (?, ?, ?, ?, 'Success')`,
    [invoiceId, amountPaid, method, code || null]
  );

  const [[{ totalPaid }]] = await pool.query(
    `SELECT COALESCE(SUM(AmountPaid), 0) AS totalPaid
     FROM Transactions WHERE InvoiceID = ? AND Status = 'Success'`,
    [invoiceId]
  );

  const totalAmount = Number(invoice.TotalAmount);
  let paymentStatus = 'Unpaid';
  if (Number(totalPaid) >= totalAmount && totalAmount > 0) {
    paymentStatus = 'Paid';
  } else if (Number(totalPaid) > 0) {
    paymentStatus = 'Partial';
  }

  await pool.query('UPDATE Invoices SET PaymentStatus = ? WHERE InvoiceID = ?', [paymentStatus, invoiceId]);
  if (paymentStatus === 'Paid') {
    await activateExtracurricularsForInvoice(invoiceId);
  }

  return {
    transactionId: txResult.insertId,
    invoiceId,
    amountPaid,
    totalPaid: Number(totalPaid),
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
    `UPDATE StudentExtracurriculars SET Status = 'Active'
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
  const [existing] = await pool.query(
    `SELECT InvoiceID FROM Invoices
     WHERE StudentID = ? AND BillingMonth = ? AND InvoiceType = 'EXTRACURRICULAR' AND PaymentStatus != 'Paid'`,
    [studentId, billingMonth]
  );

  if (existing.length > 0) {
    const invoiceId = existing[0].InvoiceID;
    await pool.query(
      'UPDATE Invoices SET ExtracurricularFee = ExtracurricularFee + ? WHERE InvoiceID = ?',
      [activityFee, invoiceId]
    );
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
       AND i.DueDate IS NOT NULL
       AND i.DueDate <= ? AND i.DueDate > ?
       AND i.ReminderSentAt IS NULL`,
    [upcomingThreshold, now]
  );

  const [overdueInvoices] = await pool.query(
    `SELECT i.InvoiceID, i.StudentID, i.DueDate, i.TotalAmount, i.InvoiceType, i.BillingMonth
     FROM Invoices i
     WHERE i.PaymentStatus != 'Paid'
       AND i.DueDate IS NOT NULL
       AND i.DueDate <= ?
       AND i.OverdueReminderSentAt IS NULL`,
    [now]
  );

  let upcomingSent = 0;
  let overdueSent = 0;

  for (const invoice of upcomingInvoices) {
    const sent = await notifyParentsOfInvoice(invoice, 'upcoming');
    if (sent) {
      await pool.query('UPDATE Invoices SET ReminderSentAt = ? WHERE InvoiceID = ?', [now, invoice.InvoiceID]);
      upcomingSent++;
    }
  }

  for (const invoice of overdueInvoices) {
    const sent = await notifyParentsOfInvoice(invoice, 'overdue');
    if (sent) {
      await pool.query('UPDATE Invoices SET OverdueReminderSentAt = ? WHERE InvoiceID = ?', [now, invoice.InvoiceID]);
      overdueSent++;
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

  await Promise.all(
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

  return true;
};
