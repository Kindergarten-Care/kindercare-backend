# FE IMPLEMENTATION PLAN — THANH TOÁN HÓA ĐƠN QUA VNPAY

> Tài liệu bổ sung cho [frontend-billing-momo-implementation-plan.md](./frontend-billing-momo-implementation-plan.md) — đọc file đó trước để hiểu bối cảnh chung về hóa đơn (`InvoiceType`, `PaymentStatus`, format tháng...). File này chỉ tập trung vào phần **thanh toán qua VNPay**, là phương thức online thứ 2 song song với MoMo (mục 2.4 ở file trên).
>
> Base URL: `{API_URL}` (vd `https://web-test.kindercare.app/api/v1`). Endpoint dưới đây yêu cầu header `Authorization: Bearer <token>`, trừ VNPay IPN (nội bộ, VNPay-to-BE, FE không gọi).

---

## 0. VNPay khác MoMo ở đâu — FE cần biết để không nhầm

| | MoMo | VNPay |
|---|---|---|
| UI chọn phương thức | Quét QR / ví MoMo | Chọn ngân hàng / thẻ ATM nội địa / thẻ quốc tế / QR ngay trên trang VNPay |
| Cách xác nhận thanh toán | IPN (server-to-server) | IPN (server-to-server) — **giống hệt về nguyên tắc**, FE không thay đổi cách xử lý |
| Trang redirect sau thanh toán | `MOMO_REDIRECT_BASE_URL/billing/payment-result` | `VNPAY_RETURN_URL` — **có thể dùng chung 1 route FE** `/billing/payment-result` cho cả 2 (khuyến nghị) |
| Độ tin cậy IPN ở sandbox | Không ổn định (đã gặp thực tế — IPN sandbox MoMo có thể không bao giờ tới) | Ổn định hơn, nhưng BE vẫn có cơ chế dự phòng (xem mục 3) cho cả 2 |

**Kết luận quan trọng cho FE:** vì BE đã xử lý toàn bộ phần đối soát dự phòng (không phụ thuộc 100% vào IPN), **FE không cần biết hay quan tâm** cổng nào đang dùng khi ở trang xác nhận kết quả — chỉ cần luôn gọi lại `GET /parent/invoices/{invoiceId}` để lấy trạng thái thật, y hệt cách đã làm với MoMo.

---

## 1. Tạo đơn thanh toán VNPay

```
POST /parent/invoices/{invoiceId}/pay-vnpay
```

**Request body:** không cần (rỗng).

**Response 200:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Tạo đơn thanh toán VNPay thành công",
  "data": {
    "payUrl": "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Version=2.1.0&...",
    "txnRef": "111751234567890"
  }
}
```

**FE cần làm:**
1. Gọi API này khi phụ huynh chọn "Thanh toán qua VNPay" (đặt cạnh nút MoMo trong màn hình chọn phương thức, xem mục 2.3/2.4 file MoMo).
2. Ngay khi nhận `payUrl`, **redirect toàn trang** (`window.location.href = payUrl`) — VNPay cũng yêu cầu full-page, không dùng popup/iframe (có thể bị chặn bởi chính sách bảo mật của trang thanh toán).
3. Lưu tạm `txnRef` (ví dụ `sessionStorage`) nếu muốn hiển thị lại trạng thái "đang xử lý" khi phụ huynh quay lại trang mà chưa có kết quả — tương tự cách đã làm với `orderId` của MoMo.

**Lỗi cần xử lý:**
| Status | Nguyên nhân | UI xử lý |
|---|---|---|
| 400 | Hóa đơn có `totalAmount <= 0` | Ẩn nút thanh toán VNPay nếu tổng tiền = 0 (giống MoMo) |
| 404 | Không tìm thấy hóa đơn | Hiện lỗi |
| 500 | VNPay API lỗi / thiếu cấu hình `VNPAY_TMN_CODE` (BE chưa đăng ký xong sandbox) | Hiện lỗi chung, gợi ý thử phương thức khác (MoMo/chuyển khoản) |

---

## 2. VNPay redirect về sau khi thanh toán

Sau khi phụ huynh thanh toán xong (hoặc bấm hủy) trên trang VNPay, trình duyệt được redirect về:

```
{VNPAY_RETURN_URL}?vnp_Amount=...&vnp_TxnRef=...&vnp_ResponseCode=...&vnp_SecureHash=...(nhiều field khác do VNPay gắn vào)
```

**Route xử lý:** dùng **chung route `/billing/payment-result`** đã dựng cho MoMo (mục 2.4b file MoMo) — không cần route riêng cho VNPay. Route này chỉ cần:

1. Hiển thị "Đang xác nhận thanh toán..." (không cần đọc/parse chi tiết query string VNPay gắn vào).
2. Gọi lại `GET /parent/invoices/{invoiceId}` để lấy `paymentStatus` thật.
3. **Tuyệt đối không tự kết luận thành công dựa vào `vnp_ResponseCode` trên URL** — đây là dữ liệu phía client, có thể bị sửa tay trước khi FE đọc được, và VNPay khuyến cáo route return chỉ dùng cho UX, không dùng để xác nhận giao dịch. Nguồn sự thật duy nhất là kết quả từ API BE (đã được xác nhận qua IPN hoặc đối soát chủ động).
4. Áp dụng lại đúng cơ chế polling đã có cho MoMo (gọi lại API mỗi 2s, tối đa 5 lần) nếu `paymentStatus` chưa cập nhật ngay khi vừa redirect về.

> Vì dùng chung route, FE có thể phân biệt vừa thanh toán bằng cổng nào (nếu cần hiển thị khác biệt UI nhỏ) bằng cách nhìn query string: có `vnp_TxnRef` → VNPay, có `orderId`/`resultCode` kiểu MoMo → MoMo. Nhưng việc này **chỉ để hiển thị**, không ảnh hưởng logic xác nhận.

---

## 3. Trạng thái Transaction trong lúc chờ

Giống hệt cơ chế MoMo, chỉ khác `paymentMethod`:

- Ngay sau khi gọi `pay-vnpay`, BE tạo 1 `Transaction` với `status: "Pending"`, `paymentMethod: "VNPay"`.
- IPN VNPay báo về đủ và đúng chữ ký → BE cập nhật `"Success"`/`"Failed"` + tính lại `paymentStatus` ngay lập tức.
- Nếu vì lý do nào đó IPN không tới được server (mất mạng, cấu hình sai IPN URL...), BE có **cơ chế đối soát dự phòng**: tự động gọi lại VNPay hỏi trạng thái thật mỗi khi phụ huynh xem lại hóa đơn (`GET /parent/invoices/:id` hoặc `GET /parent/children/:id/invoices`), và định kỳ mỗi 5 phút qua cron nền. FE **không cần làm gì thêm** cho việc này — chỉ cần gọi lại API xem chi tiết hóa đơn là tự động được cập nhật nếu có kết quả mới.
- Nếu phụ huynh đóng trang giữa chừng và giao dịch chưa từng hoàn tất phía VNPay → Transaction giữ `"Pending"` mãi (không có gì để đối soát vì VNPay cũng chưa có kết quả). UI xử lý giống MoMo: coi `Pending` kéo dài là "chưa xác nhận được", cho phép thử thanh toán lại bằng cách gọi lại `pay-vnpay` tạo đơn mới.

---

## 4. UI gợi ý màn hình chọn phương thức thanh toán

Cập nhật màn hình "Thanh toán ngay" (mục 2.2 file MoMo) từ 2 lựa chọn thành 3:

```
[Chi tiết hóa đơn — paymentStatus ≠ 'Paid']
        │
        ├─ [Thanh toán qua MoMo]      → POST /parent/invoices/:id/pay-momo
        ├─ [Thanh toán qua VNPay]     → POST /parent/invoices/:id/pay-vnpay
        └─ [Đã chuyển khoản tay/khác] → POST /parent/invoices/:id/pay (nếu có màn hình cho nhân viên)
```

Cả 2 nút online đều dẫn tới cùng 1 hành vi: nhận `payUrl` → redirect toàn trang → chờ VNPay/MoMo xử lý → redirect về **cùng 1 route** `/billing/payment-result` → gọi lại API xác nhận.

Gợi ý logo/label: VNPay thường hiển thị kèm logo các ngân hàng liên kết + Napas, MoMo hiển thị logo ví MoMo — có thể thêm icon tương ứng cạnh mỗi nút cho quen thuộc với người dùng Việt Nam.

---

## 5. CHECKLIST IMPLEMENT (bổ sung cho phần VNPay)

- [ ] Thêm nút "Thanh toán qua VNPay" cạnh nút MoMo trong trang chi tiết hóa đơn (`POST /parent/invoices/:id/pay-vnpay`)
- [ ] Redirect toàn trang tới `payUrl` nhận được (không popup/iframe)
- [ ] Tái sử dụng route `/billing/payment-result` đã có cho MoMo — không cần dựng route riêng
- [ ] Đảm bảo route đó gọi lại `GET /parent/invoices/:id` để lấy trạng thái thật, không tin `vnp_ResponseCode` trên URL
- [ ] (Tuỳ chọn) hiển thị icon/label khác nhau MoMo vs VNPay ở lịch sử giao dịch (`transactions[].paymentMethod === 'VNPay'`)

---

## 6. GHI CHÚ / RỦI RO CẦN LƯU Ý

- **Không polling vô hạn** ở trang `/billing/payment-result` — áp dụng đúng giới hạn đã định cho MoMo (tối đa 5 lần, mỗi 2s).
- **Không dùng popup/iframe** cho redirect VNPay, giống MoMo.
- **VNPay sandbox cần domain public thật** để nhận IPN, y hệt lưu ý về MoMo — không test đầy đủ được trên `localhost`.
- **BE hiện dùng chung 1 tài khoản sandbox VNPay** cho mọi môi trường (test + demo chính thức) — không có gì khác biệt về hành vi API phía FE, nhưng nếu thấy trạng thái cập nhật chậm hơn bình thường (vài phút thay vì tức thời) ở 1 trong 2 domain, đó là do IPN URL chỉ cấu hình được cho 1 domain và domain còn lại đang chờ cơ chế đối soát định kỳ — không phải lỗi FE.
- **Chưa test được với giao dịch VNPay thật** tại thời điểm viết tài liệu này (đang chờ đăng ký tài khoản sandbox) — nếu gặp lỗi không khớp với mô tả ở đây khi tích hợp thật, báo lại BE để kiểm tra.
