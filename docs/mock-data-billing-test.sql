-- ============================================================
-- MOCK DATA — test billing/tuition/MoMo payment
-- StudentID = 19 (Nguyễn Minh Chánh, ClassID=1 → YearID=1)
-- ParentID  = 6  (Ba của bé, quan hệ có sẵn trong StudentParents)
-- BaseFees (YearID=1): MonthlyTuition=4,500,000 | DailyMealFee=65,000
--
-- Chạy tuần tự từ trên xuống. Không dùng ID cứng cho các bảng
-- AUTO_INCREMENT — để MySQL tự cấp phát, tránh đụng dữ liệu đã có.
--
-- LƯU Ý VỀ TIMEZONE: tất cả DueDate/TransactionDate dưới đây dùng
-- epoch UNIX cứng đã tính sẵn bằng công thức giống hệt getDueDate()
-- trong billing.service.js (server Node chạy UTC — đã xác nhận trên
-- container kindercare-api-test). KHÔNG dùng UNIX_TIMESTAMP()/CURDATE()
-- của MySQL trực tiếp vì kết quả phụ thuộc session time_zone của MySQL,
-- có thể lệch nếu MySQL không cùng timezone với server Node.
-- ============================================================

-- ------------------------------------------------------------
-- 0. Dọn dữ liệu mock cũ nếu chạy lại script này (an toàn re-run)
-- ------------------------------------------------------------
DELETE t FROM Transactions t
  JOIN Invoices i ON t.InvoiceID = i.InvoiceID
  WHERE i.StudentID = 19 AND i.BillingMonth IN ('05-2026', '06-2026', '07-2026', '08-2026');

DELETE FROM Invoices WHERE StudentID = 19 AND BillingMonth IN ('05-2026', '06-2026', '07-2026', '08-2026');

DELETE FROM StudentTuitionPlans WHERE StudentID = 19;

-- ------------------------------------------------------------
-- 1. Đăng ký gói học phí — gói Quý (3 tháng, 0% discount),
--    bắt đầu 07-2026 → chu kỳ 07-2026 đến 09-2026.
-- ------------------------------------------------------------
INSERT INTO StudentTuitionPlans (StudentID, PackageID, StartMonth, MonthlyTuitionSnapshot, Status)
VALUES (19, 2, '07-2026', 4500000.00, 'Active');

-- Invoice TUITION cho kỳ đầu (07-2026 - 09-2026): 3 x 4,500,000 = 13,500,000
-- DueDate = ngày 10/07/2026 00:00 GMT+7 = epoch 1783616400
INSERT INTO Invoices
  (StudentID, PackageID, PeriodRange, BillingMonth, TuitionFee, DiscountAmount, InvoiceType, PaymentStatus, DueDate)
VALUES
  (19, 2, '07-2026 - 09-2026', '07-2026', 13500000.00, 0.00, 'TUITION', 'Unpaid', 1783616400);

-- ------------------------------------------------------------
-- 2. Invoice MONTHLY tháng 07-2026 — CHƯA thanh toán (test nút
--    thanh toán thủ công / MoMo). Có ExtracurricularFee + Surcharge
--    để breakdown hiển thị đầy đủ trên UI.
--    ExpectedMealFee giả định 23 ngày công x 65,000 = 1,495,000
--    DueDate = 10/07/2026 00:00 GMT+7 = epoch 1783616400
-- ------------------------------------------------------------
INSERT INTO Invoices
  (StudentID, BillingMonth, ExpectedMealFee, ExtracurricularFee, Surcharge, RefundAmount, InvoiceType, PaymentStatus, DueDate)
VALUES
  (19, '07-2026', 1495000.00, 500000.00, 100000.00, 0.00, 'MONTHLY', 'Unpaid', 1783616400);

-- ------------------------------------------------------------
-- 3. Invoice MONTHLY tháng 06-2026 — ĐÃ thanh toán đủ (test lịch
--    sử giao dịch / hiển thị hóa đơn Paid).
--    DueDate = 10/06/2026 00:00 GMT+7 = epoch 1781024400
-- ------------------------------------------------------------
INSERT INTO Invoices
  (StudentID, BillingMonth, ExpectedMealFee, ExtracurricularFee, Surcharge, RefundAmount, InvoiceType, PaymentStatus, DueDate)
VALUES
  (19, '06-2026', 1430000.00, 500000.00, 0.00, 0.00, 'MONTHLY', 'Paid', 1781024400);

-- TransactionDate = 08/06/2026 09:00 GMT+7 = epoch 1780884000
INSERT INTO Transactions (InvoiceID, AmountPaid, PaymentMethod, TransactionCode, Status, TransactionDate)
SELECT InvoiceID, TotalAmount, 'Chuyển khoản Bank', 'MB-MOCK-JUN26-001', 'Success', 1780884000
FROM Invoices WHERE StudentID = 19 AND BillingMonth = '06-2026' AND InvoiceType = 'MONTHLY';

-- ------------------------------------------------------------
-- 4. Invoice MONTHLY tháng 08-2026 — SẮP đến hạn (để test cron
--    sendPaymentReminders nhánh "upcoming": còn đúng 3 ngày).
--    Điều kiện cron: DueDate <= now + 3 ngày AND DueDate > now.
--    → set DueDate = hôm nay + 2 ngày (chắc chắn lọt trong cửa sổ
--    "còn <= 3 ngày" bất kể giờ chạy script trong ngày là mấy giờ).
-- ------------------------------------------------------------
INSERT INTO Invoices
  (StudentID, BillingMonth, ExpectedMealFee, ExtracurricularFee, Surcharge, RefundAmount, InvoiceType, PaymentStatus, DueDate)
VALUES
  (19, '08-2026', 1495000.00, 0.00, 0.00, 65000.00, 'MONTHLY', 'Unpaid',
   UNIX_TIMESTAMP(UTC_TIMESTAMP()) + 2 * 86400);

-- ------------------------------------------------------------
-- 5. Invoice TUITION tháng 05-2026 (giả lập hóa đơn LỊCH SỬ, trước
--    khi plan Quý ở mục 1 bắt đầu — độc lập, không thuộc plan hiện
--    tại, chỉ để có dữ liệu test) — ĐÃ QUÁ HẠN, chưa thanh toán
--    (test cron nhắc "overdue").
--    Điều kiện cron: DueDate <= now AND OverdueReminderSentAt IS NULL.
--    → set DueDate = hôm qua (chắc chắn đã qua hạn).
-- ------------------------------------------------------------
INSERT INTO Invoices
  (StudentID, PackageID, PeriodRange, BillingMonth, TuitionFee, DiscountAmount, InvoiceType, PaymentStatus, DueDate)
VALUES
  (19, 1, '05-2026 - 05-2026', '05-2026', 4500000.00, 0.00, 'TUITION', 'Unpaid',
   UNIX_TIMESTAMP(UTC_TIMESTAMP()) - 1 * 86400);

-- ============================================================
-- KIỂM TRA LẠI SAU KHI CHẠY
-- ============================================================
SELECT InvoiceID, InvoiceType, BillingMonth, TotalAmount, PaymentStatus,
       FROM_UNIXTIME(DueDate) AS dueDateReadable
FROM Invoices
WHERE StudentID = 19
ORDER BY BillingMonth;
