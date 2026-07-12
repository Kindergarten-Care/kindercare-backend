# FE IMPLEMENTATION PLAN — CHI TIẾT HÓA ĐƠN NGOẠI KHÓA (EXTRACURRICULAR BREAKDOWN)

> Tài liệu bổ sung cho [frontend-billing-momo-implementation-plan.md](./frontend-billing-momo-implementation-plan.md) mục 2.6 — đọc file đó trước để hiểu vòng đời enrollment (`Pending`/`Active`/`Cancelled`/`Expired`) và cơ chế hoàn/trừ phí 48h. File này chỉ nói về 1 thay đổi: **hóa đơn EXTRACURRICULAR giờ trả kèm breakdown chi tiết từng hoạt động**, thay vì chỉ có 1 con số tổng.

---

## 0. Vấn đề & giải pháp

**Trước đây:** 1 hóa đơn `EXTRACURRICULAR` gộp phí nhiều hoạt động đăng ký cùng tháng vào 1 số duy nhất — `extracurricularFee`. Phụ huynh nhìn hóa đơn chỉ thấy "Ngoại khóa: 900.000đ", không biết 900k đó gồm những hoạt động gì.

**Giờ:** `GET /parent/invoices/{invoiceId}` trả thêm mảng `extracurricularItems` — liệt kê **đúng tên từng hoạt động đã đăng ký**, phí, và trạng thái — khi hóa đơn đó là loại `EXTRACURRICULAR`.

**Không đổi:** vẫn gộp 1 invoice/tháng/học sinh (không tách hóa đơn riêng từng hoạt động), thanh toán vẫn là 1 lần cho cả invoice. Đây chỉ là bổ sung thông tin hiển thị, không đổi flow thanh toán đã có (mục 2.3/2.4 file MoMo, hoặc file VNPay).

---

## 1. API thay đổi

```
GET /parent/invoices/{invoiceId}
```

Không đổi request. Response có thêm field mới **chỉ khi `invoiceType === 'EXTRACURRICULAR'`**:

**Response 200 (ví dụ invoice ngoại khóa có 2 hoạt động):**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Lấy chi tiết hóa đơn thành công",
  "data": {
    "invoiceId": 11,
    "studentId": 19,
    "invoiceType": "EXTRACURRICULAR",
    "billingMonth": "07-2026",
    "extracurricularFee": 900000,
    "totalAmount": 900000,
    "paymentStatus": "Unpaid",
    "dueDate": 1786269600,
    "transactions": [],
    "extracurricularItems": [
      {
        "enrollmentId": 5,
        "activityId": 1,
        "activityName": "Tiếng Anh Phonics",
        "monthlyFee": 500000,
        "status": "Pending",
        "feeRefunded": false
      },
      {
        "enrollmentId": 6,
        "activityId": 2,
        "activityName": "Vẽ Sáng Tạo",
        "monthlyFee": 400000,
        "status": "Pending",
        "feeRefunded": false
      }
    ]
  }
}
```

**Với hóa đơn `TUITION`/`MONTHLY`** (không phải `EXTRACURRICULAR`): response giữ nguyên như cũ, **không có** field `extracurricularItems` — FE cần kiểm tra `invoiceType` trước khi cố đọc field này, không mặc định nó luôn tồn tại.

### Field chi tiết từng item trong `extracurricularItems`

| Field | Kiểu | Ý nghĩa |
|---|---|---|
| `enrollmentId` | integer | ID của bản ghi đăng ký (dùng để gọi `PATCH .../cancel` nếu cần hủy từ đây) |
| `activityId` | integer | ID hoạt động (khớp `GET /parent/extracurriculars`) |
| `activityName` | string | **Tên hoạt động** — lấy đúng tên đã đăng ký, hiển thị trực tiếp, không cần tra cứu lại danh mục |
| `monthlyFee` | number | Phí hoạt động này (đơn vị VNĐ, không phải phần trăm/tỷ lệ) |
| `status` | string | `Pending` \| `Active` \| `Cancelled` \| `Expired` — xem ý nghĩa ở mục 2.6 file MoMo |
| `feeRefunded` | boolean | Chỉ có ý nghĩa khi `status` là `Cancelled`/`Expired` — `true` nếu phí này đã bị trừ khỏi `extracurricularFee` của hóa đơn (không còn tính vào tổng), `false` nếu phí vẫn còn tính trong `extracurricularFee` dù đã hủy (không hoàn) |

⚠️ **Lưu ý quan trọng về tổng tiền:** `extracurricularFee`/`totalAmount` của hóa đơn là **tổng đã trừ đi các hoạt động có `feeRefunded: true`** — tức là **không phải lúc nào cũng bằng tổng `monthlyFee` của tất cả item trong mảng**. Nếu FE tự cộng `monthlyFee` của toàn bộ item để hiển thị "tổng cộng", con số có thể sai lệch với `totalAmount` thật khi có hoạt động đã bị hủy-và-hoàn-phí. Cách đúng: chỉ cộng `monthlyFee` của các item có `status` khác `Cancelled`/`Expired`, HOẶC của các item có `feeRefunded !== true` (2 cách cho ra cùng kết quả với dữ liệu đúng) — hoặc đơn giản nhất, **cứ tin `totalAmount` từ BE, không tự tính lại**, chỉ dùng `extracurricularItems` để hiển thị breakdown minh họa.

---

## 2. UI gợi ý

### Trang chi tiết hóa đơn (khi `invoiceType === 'EXTRACURRICULAR'`)

Thay vì chỉ hiện 1 dòng "Ngoại khóa: 900.000đ" như hóa đơn MONTHLY/TUITION, hiển thị breakdown dạng danh sách:

```
Hóa đơn ngoại khóa — Tháng 7/2026
─────────────────────────────────
✓ Tiếng Anh Phonics          500.000đ    [Đang chờ thanh toán]
✓ Vẽ Sáng Tạo                400.000đ    [Đang chờ thanh toán]
─────────────────────────────────
Tổng cộng:                   900.000đ
```

Với item đã `Cancelled`/`Expired`, hiển thị gạch ngang + badge tương ứng, và **ẩn khỏi phần cộng tổng hiển thị** nếu `feeRefunded === true` (để không gây nhầm là "vẫn phải trả"), nhưng **vẫn hiện dòng đó** (gạch ngang, mờ) nếu `feeRefunded === false` để phụ huynh hiểu vì sao vẫn phải trả dù đã hủy:

```
Hóa đơn ngoại khóa — Tháng 7/2026
─────────────────────────────────
✓ Tiếng Anh Phonics          500.000đ    [Đang chờ thanh toán]
̶V̶ẽ̶ ̶S̶á̶n̶g̶ ̶T̶ạ̶o̶                ̶4̶0̶0̶.̶0̶0̶0̶đ̶    [Đã hủy — không hoàn phí]
─────────────────────────────────
Tổng cộng:                   900.000đ
```
(ví dụ trên: Vẽ Sáng Tạo bị hủy sau 48h kể từ lúc thanh toán, không hoàn phí, nên vẫn tính vào `totalAmount` — hiển thị rõ để phụ huynh hiểu tại sao)

Badge theo `status` + `feeRefunded`:
| status | feeRefunded | Badge gợi ý |
|---|---|---|
| `Pending` | — | "Đang chờ thanh toán" (màu cam/vàng) |
| `Active` | — | "Đang tham gia" (màu xanh) |
| `Cancelled` | `true` | "Đã hủy — đã hoàn phí" (màu xám) |
| `Cancelled` | `false` | "Đã hủy — không hoàn phí" (màu xám, có thể kèm icon cảnh báo nhẹ) |
| `Expired` | `true` | "Đã hết hạn thanh toán" (màu xám) |

### Danh sách hóa đơn (`GET /parent/children/:id/invoices`)

**Không đổi** — endpoint này không trả `extracurricularItems` (chỉ có ở API chi tiết). Nếu muốn hiện preview breakdown ngay ở danh sách mà không cần vào chi tiết, phải gọi thêm `GET /parent/invoices/:invoiceId` cho từng hóa đơn — không khuyến khích (N+1 request), nên chỉ hiện breakdown khi vào trang chi tiết.

---

## 3. CHECKLIST IMPLEMENT

- [ ] Khi render trang chi tiết hóa đơn, kiểm tra `invoiceType === 'EXTRACURRICULAR'` trước khi tìm `extracurricularItems` trong response
- [ ] Hiển thị danh sách hoạt động kèm `activityName` + `monthlyFee` thay vì chỉ 1 dòng tổng `extracurricularFee`
- [ ] Badge trạng thái theo bảng ở mục 2, phân biệt rõ `Cancelled` có hoàn phí vs không hoàn phí (`feeRefunded`)
- [ ] Không tự cộng lại `monthlyFee` của toàn bộ item để suy ra tổng — luôn hiển thị `totalAmount` từ BE làm số liệu chính thức
- [ ] Nút "Hủy đăng ký" trên từng item (nếu có ở trang này) dùng đúng `enrollmentId` của item đó, gọi `PATCH /parent/children/{studentId}/extracurriculars/{enrollmentId}/cancel` (xem mục 2.6(d) file MoMo)

---

## 4. GHI CHÚ

- Đây là thay đổi **thuần hiển thị** — không có endpoint mới, không đổi flow đăng ký/hủy/thanh toán đã có. Chỉ cần cập nhật UI trang chi tiết hóa đơn khi loại là `EXTRACURRICULAR`.
- Field `activityName` lấy trực tiếp từ bảng danh mục hoạt động tại thời điểm gọi API — nếu tên hoạt động bị đổi sau này ở danh mục, breakdown cũ sẽ hiển thị tên **mới nhất**, không phải tên tại thời điểm đăng ký (hệ thống hiện không lưu snapshot tên hoạt động lúc đăng ký). Trường hợp này hiếm khi xảy ra (tên hoạt động ít khi đổi) nên không cần xử lý đặc biệt, nhưng nên biết nếu thấy sai lệch khi test.
