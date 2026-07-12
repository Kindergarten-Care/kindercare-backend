/**
 * @swagger
 * /principal/profile:
 *   get:
 *     summary: Lấy thông tin profile của hiệu trưởng đang đăng nhập
 *     description: |
 *       Trả về thông tin cá nhân của hiệu trưởng lấy từ token JWT đăng nhập. Tương tự
 *       `GET /parent/profile` nhưng dành cho role Principal (roleId=2).
 *     tags: ["Principal - Profile"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin hiệu trưởng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy thông tin hiệu trưởng thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     principalId:
 *                       type: integer
 *                       example: 2
 *                     fullName:
 *                       type: string
 *                       example: Trần Thị Mai
 *                     phoneNumber:
 *                       type: string
 *                       example: "0999999999"
 *                     email:
 *                       type: string
 *                       example: mai.tran@kindercare.edu.vn
 *                     username:
 *                       type: string
 *                       description: Username đăng nhập (lấy từ bảng Users)
 *                       example: hieutruong_mai
 *                     avatarUrl:
 *                       type: string
 *                       nullable: true
 *                       description: URL avatar (lấy từ Users.AvatarURL, có thể null)
 *                       example: null
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy thông tin hiệu trưởng
 */

/**
 * @swagger
 * /principal/grades-classes:
 *   get:
 *     summary: Lấy toàn bộ danh sách khối và lớp
 *     description: |
 *       Trả về danh sách tất cả các khối học, mỗi khối học chứa danh sách các lớp học thuộc khối đó.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Grades"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách khối và lớp thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách khối và lớp thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       gradeId:
 *                         type: integer
 *                         example: 1
 *                       gradeName:
 *                         type: string
 *                         example: Mầm
 *                       classes:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             classId:
 *                               type: integer
 *                               example: 1
 *                             className:
 *                               type: string
 *                               example: Mầm 1
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/grades-classes:
 *   post:
 *     summary: Tạo khối học và lớp học tương ứng
 *     description: |
 *       API này cho phép tạo khối học mới hoặc dùng khối học đã có. 
 *       Có thể truyền mảng `classes` để tạo các lớp học tương ứng vào khối đó.
 *       Nếu lớp học đã tồn tại trong khối, hệ thống sẽ bỏ qua để tránh trùng lặp.
 *       
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Grades"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gradeName
 *             properties:
 *               gradeName:
 *                 type: string
 *                 example: "Chồi"
 *               classes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Chồi 1", "Chồi 2"]
 *                 description: Danh sách tên các lớp học (không bắt buộc)
 *     responses:
 *       201:
 *         description: Tạo khối và lớp thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Tạo khối/lớp thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     gradeId:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Thiếu thông tin bắt buộc (vd thiếu gradeName)
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/accounts:
 *   post:
 *     summary: Tạo tài khoản giáo viên hoặc phụ huynh
 *     description: |
 *       Tạo tài khoản mới và cấp quyền tương ứng dựa vào `role`.
 *       Mật khẩu mặc định sẽ được đặt là `123456`.
 *       
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Accounts"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [teacher, parent]
 *         description: Loại tài khoản cần tạo (`teacher` hoặc `parent`)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - fullName
 *             properties:
 *               username:
 *                 type: string
 *                 example: "nguyenvan_a"
 *                 description: Tên đăng nhập (phải duy nhất)
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Văn A"
 *                 description: Họ và tên
 *               phoneNumber:
 *                 type: string
 *                 example: "0987654321"
 *                 description: Số điện thoại (Bắt buộc với phụ huynh)
 *               email:
 *                 type: string
 *                 example: "nguyenvana@gmail.com"
 *                 description: Địa chỉ email (Tùy chọn)
 *     responses:
 *       201:
 *         description: Tạo tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: Tạo tài khoản thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 10
 *                     role:
 *                       type: string
 *                       example: teacher
 *       400:
 *         description: Thiếu thông tin bắt buộc hoặc trùng tên đăng nhập
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *   get:
 *     summary: Lấy danh sách tài khoản theo role (gộp teacher + parent)
 *     description: |
 *       Trả về danh sách tài khoản theo role được chỉ định. Mỗi item gồm 5 trường:
 *       `id`, `fullName`, `username`, `email`, `avatarUrl`. Dùng cho màn hình quản trị của hiệu trưởng
 *       khi cần chọn giáo viên hoặc tra cứu phụ huynh.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *
 *       **Lưu ý:** Nếu sau này cần xem cả Admin/Principal thì dùng `GET /users/by-role`
 *       (hiện tại admin mới được gọi).
 *     tags: ["Principal - Accounts"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         required: true
 *         schema:
 *           type: string
 *           enum: [teacher, parent]
 *         description: Tên role cần lấy (`teacher` hoặc `parent`)
 *         example: teacher
 *     responses:
 *       200:
 *         description: Lấy danh sách tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy danh sách tài khoản teacher thành công
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: TeacherID hoặc ParentID (đều trùng UserID)
 *                         example: 3
 *                       fullName:
 *                         type: string
 *                         example: Nguyễn Thị Lan
 *                       username:
 *                         type: string
 *                         example: gv_lan
 *                       email:
 *                         type: string
 *                         nullable: true
 *                         example: lan.nguyen@kindercare.edu.vn
 *                       avatarUrl:
 *                         type: string
 *                         nullable: true
 *                         description: URL avatar của tài khoản
 *                         example: null
 *       400:
 *         description: Bad Request - thiếu hoặc sai giá trị `role`
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/teacher/{id}/detail:
 *   get:
 *     summary: Lấy thông tin chi tiết tài khoản giáo viên
 *     description: |
 *       Trả về thông tin đầy đủ của giáo viên kèm danh sách lớp đang phụ trách
 *       (join từ `ClassTeachers` ↔ `Classes`).
 *
 *       Dùng cho màn hình chi tiết khi hiệu trưởng bấm vào 1 dòng trong danh sách.
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Teacher"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: TeacherID (đồng thời là UserID)
 *         example: 5
 *     responses:
 *       200:
 *         description: Lấy thông tin chi tiết giáo viên thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Lấy thông tin chi tiết giáo viên thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 5 }
 *                     username: { type: string, example: gv_quanghuy }
 *                     status: { type: string, example: Active }
 *                     avatarUrl: { type: string, nullable: true, example: null }
 *                     roleId: { type: integer, example: 3 }
 *                     roleName: { type: string, example: Teacher }
 *                     fullName: { type: string, example: Lê Quang Huy }
 *                     phoneNumber: { type: string, nullable: true, example: "12312412" }
 *                     email: { type: string, nullable: true, example: "ok" }
 *                     dateOfBirth: { type: integer, nullable: true, example: null, description: "Unix timestamp (seconds)" }
 *                     gender: { type: string, nullable: true, example: Nam }
 *                     idCard: { type: string, nullable: true, example: null }
 *                     address: { type: string, nullable: true, example: null }
 *                     professionalRank: { type: string, nullable: true, example: "Hạng II" }
 *                     workStatus: { type: string, example: Active }
 *                     totalClasses:
 *                       type: integer
 *                       description: Tổng số lớp giáo viên đang phụ trách
 *                       example: 2
 *                     classes:
 *                       type: array
 *                       description: Danh sách lớp giáo viên đang phụ trách
 *                       items:
 *                         type: object
 *                         properties:
 *                           classId: { type: integer, example: 1 }
 *                           className: { type: string, example: "Mầm 1" }
 *                           roleInClass: { type: string, example: "Giáo viên trưởng" }
 *                           assignedDate: { type: integer, nullable: true, description: "Unix timestamp (seconds)", example: 1781082000 }
 *       400:
 *         description: Bad Request - id không hợp lệ
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy giáo viên
 */

/**
 * @swagger
 * /principal/parent/{id}/detail:
 *   get:
 *     summary: Lấy thông tin chi tiết tài khoản phụ huynh
 *     description: |
 *       Trả về thông tin đầy đủ của phụ huynh kèm danh sách con
 *       (join từ `StudentParents` ↔ `Students` ↔ `Classes`).
 *
 *       Dùng cho màn hình chi tiết khi hiệu trưởng bấm vào 1 dòng trong danh sách.
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Parent"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ParentID (đồng thời là UserID)
 *         example: 4
 *     responses:
 *       200:
 *         description: Lấy thông tin chi tiết phụ huynh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Lấy thông tin chi tiết phụ huynh thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 4 }
 *                     username: { type: string, example: ph_tuan }
 *                     status: { type: string, example: Active }
 *                     avatarUrl: { type: string, nullable: true, example: null }
 *                     roleId: { type: integer, example: 4 }
 *                     roleName: { type: string, example: Parent }
 *                     fullName: { type: string, example: "Nguyễn Anh Tuấn" }
 *                     dateOfBirth: { type: integer, nullable: true, example: null }
 *                     phoneNumber: { type: string, example: "0909090909" }
 *                     email: { type: string, nullable: true, example: "tuan.nguyen@gmail.com" }
 *                     idCard: { type: string, nullable: true, example: null }
 *                     job: { type: string, nullable: true, example: "Kỹ sư phần mềm" }
 *                     address: { type: string, nullable: true, example: "Quận 1, TP.HCM" }
 *                     parentAvatarUrl: { type: string, nullable: true, example: null }
 *                     children:
 *                       type: array
 *                       description: Danh sách con của phụ huynh
 *                       items:
 *                         type: object
 *                         properties:
 *                           studentId: { type: integer, example: 1 }
 *                           fullName: { type: string, example: "Nguyễn Minh Khang" }
 *                           avatarUrl: { type: string, nullable: true, example: null }
 *                           dateOfBirth: { type: integer, description: "Unix timestamp (seconds)", example: 1684108800 }
 *                           gender: { type: string, nullable: true, example: Nam }
 *                           classId: { type: integer, nullable: true, example: 1 }
 *                           className: { type: string, nullable: true, example: "Mầm 1" }
 *                           relationship: { type: string, example: "Bố" }
 *                           isPrimary: { type: integer, description: "1 = phụ huynh chính", example: 1 }
 *       400:
 *         description: Bad Request - id không hợp lệ
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy phụ huynh
 */

/**
 * @swagger
 * /principal/student/{id}/detail:
 *   get:
 *     summary: Lấy thông tin chi tiết học sinh
 *     description: |
 *       Trả về thông tin chi tiết của học sinh kèm danh sách phụ huynh.
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Student"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: StudentID của học sinh cần lấy thông tin
 *         example: 1
 *     responses:
 *       200:
 *         description: Lấy thông tin chi tiết học sinh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Lấy thông tin chi tiết học sinh thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 1 }
 *                     fullName: { type: string, example: "Nguyễn Minh Khang" }
 *                     dateOfBirth: { type: integer, nullable: true, description: "Unix timestamp (seconds)", example: 1684108800 }
 *                     gender: { type: string, nullable: true, example: "Nam" }
 *                     allergies: { type: string, nullable: true, example: "Dị ứng lạc" }
 *                     admissionDate: { type: integer, nullable: true, description: "Unix timestamp (seconds)", example: 1693526400 }
 *                     status: { type: string, nullable: true, example: "Active" }
 *                     avatarUrl: { type: string, nullable: true, example: null }
 *                     classId: { type: integer, nullable: true, example: 1 }
 *                     className: { type: string, nullable: true, example: "Mầm 1" }
 *                     parents:
 *                       type: array
 *                       description: Danh sách phụ huynh của học sinh
 *                       items:
 *                         type: object
 *                         properties:
 *                           parentId: { type: integer, example: 4 }
 *                           fullName: { type: string, example: "Nguyễn Anh Tuấn" }
 *                           phoneNumber: { type: string, example: "0909090909" }
 *                           email: { type: string, nullable: true, example: "tuan.nguyen@gmail.com" }
 *                           relationship: { type: string, example: "Bố" }
 *                           isPrimary: { type: integer, description: "1 = phụ huynh chính, 0 = phụ huynh phụ", example: 1 }
 *       400:
 *         description: Bad Request - id không hợp lệ
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy học sinh
 */

/**
 * @swagger
 * /principal/student/{id}:
 *   patch:
 *     summary: Sửa thông tin học sinh
 *     description: |
 *       Cập nhật một hoặc nhiều trường thông tin cá nhân của học sinh
 *       (`fullName`, `dateOfBirth`, `gender`, `allergies`, `avatarUrl`). Chỉ cần truyền field muốn sửa.
 *
 *       **Lưu ý:** Endpoint này không dùng để đổi lớp hoặc trạng thái nhập học — dùng
 *       `POST /principal/assignments/students` để xếp lớp, hoặc các API tổng kết/bắt đầu năm học
 *       để thay đổi `EnrollmentStatus`.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Student"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: StudentID của học sinh cần sửa
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Nguyễn Minh Khang"
 *               dateOfBirth:
 *                 type: integer
 *                 description: Unix timestamp (seconds)
 *                 example: 1684108800
 *               gender:
 *                 type: string
 *                 example: "Nam"
 *               allergies:
 *                 type: string
 *                 nullable: true
 *                 example: "Dị ứng lạc"
 *               avatarUrl:
 *                 type: string
 *                 nullable: true
 *                 example: "https://media.kindercare.app/students/avatar.jpg"
 *     responses:
 *       200:
 *         description: Cập nhật thông tin học sinh thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Cập nhật thông tin học sinh thành công }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Bad Request - id không hợp lệ, hoặc không truyền field nào để sửa
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy học sinh
 */

/**
 * @swagger
 * /principal/students/import:
 *   post:
 *     summary: Import học sinh hàng loạt từ file CSV hoặc XLSX
 *     description: |
 *       Đọc file CSV **hoặc XLSX** (nhận diện theo đuôi file gốc), tạo mỗi dòng thành
 *       1 học sinh (`ClassID = NULL` — chưa xếp lớp, cần xếp lớp riêng qua
 *       `POST /principal/assignments/students`).
 *
 *       Nếu dòng có cột `PackageID` hợp lệ (khớp với `PaymentPackages` đang có),
 *       hệ thống tự động tạo `StudentTuitionPlans` cho học sinh đó — `MonthlyTuitionSnapshot`
 *       lấy từ `BaseFees` của **năm học đang active** (vì học sinh mới import chưa có lớp,
 *       không thể xác định năm học theo lớp như luồng đăng ký gói bình thường).
 *       `StartMonth` = tháng/năm của `AdmissionDate` (định dạng `MM-YYYY`).
 *
 *       Dòng không có `PackageID`, hoặc `PackageID` không khớp gói nào đang có,
 *       sẽ bỏ qua việc tạo gói học phí (học sinh vẫn được tạo bình thường).
 *
 *       **Định dạng file:** chỉ hỗ trợ đuôi `.csv` và `.xlsx`. XLSX chỉ đọc từ **sheet đầu
 *       tiên**, dòng 1 là header (tên cột), các dòng sau là dữ liệu. Ô ngày tháng trong
 *       XLSX có thể để dạng Date thật (Excel tự format) hoặc chuỗi `dd/mm/yyyy`.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Student"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: |
 *                   File `.csv` hoặc `.xlsx` với các cột: `FullName` (bắt buộc),
 *                   `DateOfBirth` (dd/mm/yyyy), `Gender`, `Allergies`, `AdmissionDate` (dd/mm/yyyy),
 *                   `PackageID` (tùy chọn, số nguyên).
 *     responses:
 *       201:
 *         description: Import thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Đã import thành công 20 học sinh (12 học sinh được đăng ký gói học phí)" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     imported:
 *                       type: integer
 *                       description: Tổng số học sinh đã tạo
 *                       example: 20
 *                     tuitionPlansCreated:
 *                       type: integer
 *                       description: Số học sinh được đăng ký gói học phí (có PackageID hợp lệ trong file)
 *                       example: 12
 *       400:
 *         description: Bad Request - thiếu file, hoặc đuôi file không phải .csv/.xlsx
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/accounts/{id}/reset-password:
 *   patch:
 *     summary: Khôi phục mật khẩu tài khoản về mặc định
 *     description: Đặt lại mật khẩu của tài khoản giáo viên hoặc phụ huynh về mặc định "123456"
 *     tags: ["Principal - Accounts"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tài khoản cần đặt lại mật khẩu (UserID)
 *     responses:
 *       200:
 *         description: Reset mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Reset mật khẩu thành công (Mặc định: 123456)"
 *                 data:
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Bad Request - ID không hợp lệ
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Chỉ hiệu trưởng mới có quyền
 *       404:
 *         description: Not Found - Không tìm thấy tài khoản
 * 
 * /principal/accounts/{id}/lock:
 *   patch:
 *     summary: Khóa tài khoản
 *     description: Chuyển trạng thái của tài khoản sang "inactive"
 *     tags: ["Principal - Accounts"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tài khoản cần khóa (UserID)
 *     responses:
 *       200:
 *         description: Khóa tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Khóa tài khoản thành công
 *                 data:
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Bad Request - ID không hợp lệ
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Chỉ hiệu trưởng mới có quyền
 *       404:
 *         description: Not Found - Không tìm thấy tài khoản
 * 
 * /principal/accounts/{id}/unlock:
 *   patch:
 *     summary: Mở khóa tài khoản
 *     description: Chuyển trạng thái của tài khoản sang "active"
 *     tags: ["Principal - Accounts"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của tài khoản cần mở khóa (UserID)
 *     responses:
 *       200:
 *         description: Mở khóa tài khoản thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Mở khóa tài khoản thành công
 *                 data:
 *                   nullable: true
 *                   example: null
 *       400:
 *         description: Bad Request - ID không hợp lệ
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Chỉ hiệu trưởng mới có quyền
 *       404:
 *         description: Not Found - Không tìm thấy tài khoản
 */

/**
 * @swagger
 * /principal/class/{id}/detail:
 *   get:
 *     summary: Get class detail by ID
 *     description: |
 *       Returns full details of a class including:
 *       - Grade name and class name
 *       - List of teachers assigned to the class (full name, email, phone, avatar, role in class)
 *       - Total number of students
 *       - Today's attendance summary (present, absent, excused) based on `AttendanceDate` unix timestamp matching today's date range
 *       - Full student list (ID, name, avatar, date of birth, admission date)
 *
 *       **Only Principal (roleId=2)** can access this endpoint.
 *     tags: ["Principal - Grades"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ClassID to retrieve details for
 *         example: 1
 *     responses:
 *       200:
 *         description: Class detail retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: Lấy thông tin chi tiết lớp học thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     classId:
 *                       type: integer
 *                       example: 1
 *                     className:
 *                       type: string
 *                       example: Mầm 1
 *                     gradeName:
 *                       type: string
 *                       example: Khối Mầm
 *                     teachers:
 *                       type: array
 *                       description: List of teachers assigned to this class
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 7
 *                           fullName:
 *                             type: string
 *                             example: Nguyễn Thị Lan
 *                           email:
 *                             type: string
 *                             nullable: true
 *                             example: lan.nguyen@kindercare.edu.vn
 *                           phoneNumber:
 *                             type: string
 *                             nullable: true
 *                             example: "0912345678"
 *                           avatarUrl:
 *                             type: string
 *                             nullable: true
 *                             example: https://media.kindercare.app/teachers/avatar.jpg
 *                           roleInClass:
 *                             type: string
 *                             example: MainTeacher
 *                     totalStudents:
 *                       type: integer
 *                       description: Total number of students in this class
 *                       example: 18
 *                     attendanceToday:
 *                       type: object
 *                       description: Attendance summary for today based on unix timestamp range
 *                       properties:
 *                         present:
 *                           type: integer
 *                           example: 15
 *                         absent:
 *                           type: integer
 *                           example: 2
 *                         excused:
 *                           type: integer
 *                           example: 1
 *                     students:
 *                       type: array
 *                       description: Full list of students in this class
 *                       items:
 *                         type: object
 *                         properties:
 *                           studentId:
 *                             type: integer
 *                             example: 19
 *                           fullName:
 *                             type: string
 *                             example: Nguyễn Minh Chánh
 *                           avatarUrl:
 *                             type: string
 *                             nullable: true
 *                             example: https://media.kindercare.app/students/avatar.jpg
 *                           dateOfBirth:
 *                             type: integer
 *                             description: Unix timestamp of student's date of birth
 *                             example: 1464739200
 *                           admissionDate:
 *                             type: integer
 *                             description: Unix timestamp of student's admission date (nullable)
 *                             nullable: true
 *                             example: 1781082000
 *       400:
 *         description: Bad Request - Invalid class ID
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       403:
 *         description: Forbidden - Only Principal can access
 *       404:
 *         description: Not Found - Class with given ID does not exist
 */

/**
 * @swagger
 * /principal/assignments/teacher:
 *   post:
 *     summary: Bổ nhiệm Giáo viên vào lớp
 *     description: Phân công giáo viên chủ nhiệm hoặc giáo viên phụ vào một lớp cụ thể.
 *     tags: ["Principal - Academic Year"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - teacherId
 *             properties:
 *               classId:
 *                 type: integer
 *               teacherId:
 *                 type: integer
 *               roleInClass:
 *                 type: string
 *                 example: Giáo viên chủ nhiệm
 *               assignedDate:
 *                 type: integer
 *                 description: Unix timestamp, mặc định là hiện tại
 *     responses:
 *       200:
 *         description: Bổ nhiệm giáo viên thành công
 *       400:
 *         description: Thiếu tham số
 */

/**
 * @swagger
 * /principal/assignments/students:
 *   post:
 *     summary: Xếp lớp cho học sinh
 *     description: Di chuyển một danh sách học sinh vào một lớp.
 *     tags: ["Principal - Academic Year"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - classId
 *               - studentIds
 *             properties:
 *               classId:
 *                 type: integer
 *               studentIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Xếp lớp học sinh thành công
 */

/**
 * @swagger
 * /principal/academic-year/end:
 *   post:
 *     summary: Tổng kết năm học
 *     description: Tốt nghiệp khối Lá, gỡ lớp cũ các học sinh khác.
 *     tags: ["Principal - Academic Year"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tổng kết năm học thành công
 */

/**
 * @swagger
 * /principal/academic-year/start:
 *   post:
 *     summary: Bắt đầu năm học mới
 *     description: Tạo năm học mới và nhân bản các lớp cũ sang.
 *     tags: ["Principal - Academic Year"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - yearName
 *               - startDate
 *               - endDate
 *               - monthlyTuition
 *               - dailyMealFee
 *             properties:
 *               yearName:
 *                 type: string
 *               startDate:
 *                 type: integer
 *               endDate:
 *                 type: integer
 *               monthlyTuition:
 *                 type: integer
 *               dailyMealFee:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Bắt đầu năm học mới thành công
 */

/**
 * @swagger
 * /principal/academic-years:
 *   get:
 *     summary: Lấy danh sách toàn bộ năm học
 *     description: Trả về danh sách năm học xếp theo thứ tự mới nhất (YearID DESC).
 *     tags: ["Principal - Academic Year"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách năm học thành công
 */

/**
 * @swagger
 * /principal/payment-configs:
 *   get:
 *     summary: Lấy cấu hình gói học phí (chỉ năm học đang active)
 *     description: |
 *       Trả về danh sách gói học phí (`PaymentPackages`) và học phí cơ bản (`BaseFees`)
 *       của **năm học đang active** (`AcademicYears.IsActive = 1`).
 *
 *       **Lưu ý:** API này chỉ trả biểu phí của năm học hiện hành. Nếu cần xem biểu phí
 *       của mọi năm học (kể cả năm không active) và cả hoạt động ngoại khóa, dùng
 *       `GET /principal/fees`.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Fees"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy cấu hình gói học phí thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     packages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer, example: 1 }
 *                           name: { type: string, example: "Gói Tháng" }
 *                           duration: { type: integer, description: "Số tháng của gói", example: 1 }
 *                           discount: { type: number, format: float, example: 0.00 }
 *                     baseFee:
 *                       type: object
 *                       description: Học phí cơ bản của năm học đang active
 *                       properties:
 *                         MonthlyTuition: { type: number, format: float, example: 4000000.00 }
 *                         DailyMealFee: { type: number, format: float, example: 50000.00 }
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/fees:
 *   get:
 *     summary: Lấy toàn bộ danh sách biểu phí (gói học phí, học phí theo mọi năm, hoạt động ngoại khóa)
 *     description: |
 *       Trả về đầy đủ dữ liệu biểu phí của trường, gồm 3 object riêng biệt:
 *       - `packages`: danh sách gói học phí (`PaymentPackages`)
 *       - `baseFees`: học phí cơ bản (`BaseFees`) của **tất cả năm học**, kể cả năm học
 *         không active (khác với `GET /principal/payment-configs` chỉ trả năm active)
 *       - `extracurriculars`: danh sách hoạt động ngoại khóa (`Extracurriculars`) và phí/tháng
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Fees"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách biểu phí thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 data:
 *                   type: object
 *                   properties:
 *                     packages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer, example: 1 }
 *                           name: { type: string, example: "Gói Tháng" }
 *                           duration: { type: integer, example: 1 }
 *                           discount: { type: number, format: float, example: 0.00 }
 *                     baseFees:
 *                       type: array
 *                       description: Học phí cơ bản của tất cả năm học, kể cả năm không active
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer, description: "FeeID", example: 1 }
 *                           yearId: { type: integer, example: 1 }
 *                           yearName: { type: string, nullable: true, example: "Niên khóa 2026-2027" }
 *                           isActive:
 *                             type: integer
 *                             nullable: true
 *                             description: "1 = năm học đang active, 0 = không active"
 *                             example: 0
 *                           monthlyTuition: { type: number, format: float, example: 4000000.00 }
 *                           dailyMealFee: { type: number, format: float, example: 50000.00 }
 *                     extracurriculars:
 *                       type: array
 *                       description: Danh sách hoạt động ngoại khóa
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer, description: "ActivityID", example: 1 }
 *                           name: { type: string, example: "Vẽ" }
 *                           monthlyFee: { type: number, format: float, example: 200000.00 }
 *                           description: { type: string, nullable: true, example: "Lớp vẽ mỹ thuật" }
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/extracurriculars:
 *   post:
 *     summary: Thêm hoạt động ngoại khóa mới
 *     description: |
 *       Tạo mới một hoạt động ngoại khóa (`Extracurriculars`).
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Fees"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - monthlyFee
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Vẽ Sáng Tạo"
 *               monthlyFee:
 *                 type: number
 *                 format: float
 *                 example: 300000.00
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Khám phá hội họa"
 *     responses:
 *       201:
 *         description: Tạo hoạt động ngoại khóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 201 }
 *                 message: { type: string, example: Tạo hoạt động ngoại khóa thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, description: "ActivityID", example: 3 }
 *                     name: { type: string, example: "Vẽ Sáng Tạo" }
 *                     monthlyFee: { type: number, format: float, example: 300000.00 }
 *                     description: { type: string, nullable: true, example: "Khám phá hội họa" }
 *       400:
 *         description: Bad Request - thiếu name hoặc monthlyFee
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *
 * /principal/extracurriculars/{id}:
 *   patch:
 *     summary: Sửa thông tin một hoạt động ngoại khóa
 *     description: |
 *       Cập nhật một hoặc nhiều trường (`name`, `monthlyFee`, `description`) của hoạt động
 *       ngoại khóa (`Extracurriculars`) theo `ActivityID`. Chỉ cần truyền field muốn sửa.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Fees"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ActivityID của hoạt động ngoại khóa cần sửa
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tiếng Anh Tăng Cường"
 *               monthlyFee:
 *                 type: number
 *                 format: float
 *                 example: 500000.00
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Học với giáo viên bản ngữ"
 *     responses:
 *       200:
 *         description: Cập nhật hoạt động ngoại khóa thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Cập nhật hoạt động ngoại khóa thành công }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Bad Request - id không hợp lệ, hoặc không truyền field nào để sửa
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy hoạt động ngoại khóa
 */

/**
 * @swagger
 * /principal/base-fees/{id}:
 *   patch:
 *     summary: Sửa học phí cơ bản của một năm học
 *     description: |
 *       Cập nhật một hoặc nhiều trường (`monthlyTuition`, `dailyMealFee`) của biểu phí cơ bản
 *       (`BaseFees`) theo `FeeID`. Chỉ cần truyền field muốn sửa. Áp dụng được cho biểu phí
 *       của bất kỳ năm học nào, kể cả năm học không active.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Fees"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: FeeID của biểu phí cần sửa (lấy từ `GET /principal/fees` → `baseFees[].id`)
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               monthlyTuition:
 *                 type: number
 *                 format: float
 *                 example: 4200000.00
 *                 description: Học phí/tháng (tùy chọn)
 *               dailyMealFee:
 *                 type: number
 *                 format: float
 *                 example: 55000.00
 *                 description: Phí ăn/ngày (tùy chọn)
 *     responses:
 *       200:
 *         description: Cập nhật biểu phí thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Cập nhật biểu phí thành công }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Bad Request - id không hợp lệ, hoặc không truyền field nào để sửa
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy biểu phí
 */

/**
 * @swagger
 * /principal/payment-packages:
 *   post:
 *     summary: Thêm gói học phí mới
 *     description: |
 *       Tạo mới một gói học phí (`PaymentPackages`).
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Fees"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - duration
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gói Quý"
 *               duration:
 *                 type: integer
 *                 description: Số tháng của gói
 *                 example: 3
 *               discount:
 *                 type: number
 *                 format: float
 *                 description: "% giảm giá (mặc định 0 nếu không truyền)"
 *                 example: 3.00
 *     responses:
 *       201:
 *         description: Tạo gói học phí thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 201 }
 *                 message: { type: string, example: Tạo gói học phí thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, description: "PackageID", example: 4 }
 *                     name: { type: string, example: "Gói Quý" }
 *                     duration: { type: integer, example: 3 }
 *                     discount: { type: number, format: float, example: 3.00 }
 *       400:
 *         description: Bad Request - thiếu name hoặc duration
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/payment-packages/{id}:
 *   patch:
 *     summary: Sửa thông tin một gói học phí
 *     description: |
 *       Cập nhật một hoặc nhiều trường (`name`, `duration`, `discount`) của gói học phí
 *       (`PaymentPackages`) theo `PackageID`. Chỉ cần truyền field muốn sửa.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Fees"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: PackageID của gói học phí cần sửa
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gói Tháng"
 *                 description: Tên gói học phí (tùy chọn)
 *               duration:
 *                 type: integer
 *                 example: 1
 *                 description: Số tháng của gói (tùy chọn)
 *               discount:
 *                 type: number
 *                 format: float
 *                 example: 5.00
 *                 description: "% giảm giá (tùy chọn)"
 *     responses:
 *       200:
 *         description: Cập nhật gói học phí thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Cập nhật gói học phí thành công }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Bad Request - id không hợp lệ hoặc thiếu cả 3 field cần sửa
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy gói học phí
 */

/**
 * @swagger
 * /principal/invoices:
 *   get:
 *     summary: Lấy danh sách hóa đơn (invoices)
 *     description: |
 *       Trả về danh sách hóa đơn (`Invoices`), join thêm tên học sinh và tên gói học phí.
 *       Hỗ trợ lọc qua query string; không truyền tham số nào sẽ trả về toàn bộ hóa đơn,
 *       sắp xếp theo `createdAt` giảm dần.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Fees"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: studentId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Lọc theo học sinh
 *         example: 19
 *       - in: query
 *         name: billingMonth
 *         required: false
 *         schema:
 *           type: string
 *         description: Lọc theo tháng, định dạng `MM-YYYY`
 *         example: "07-2026"
 *       - in: query
 *         name: paymentStatus
 *         required: false
 *         schema:
 *           type: string
 *         description: Lọc theo trạng thái thanh toán (giá trị lưu trong DB, vd `Unpaid`, `Paid`)
 *         example: "Unpaid"
 *       - in: query
 *         name: invoiceType
 *         required: false
 *         schema:
 *           type: string
 *         description: Lọc theo loại hóa đơn (vd `MONTHLY`, `EXTRACURRICULAR`)
 *         example: "EXTRACURRICULAR"
 *     responses:
 *       200:
 *         description: Lấy danh sách hóa đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer, description: "InvoiceID", example: 51 }
 *                       studentId: { type: integer, nullable: true, example: 19 }
 *                       studentFullName: { type: string, nullable: true, example: "Nguyễn Văn A" }
 *                       classId: { type: integer, nullable: true, example: 1 }
 *                       className: { type: string, nullable: true, example: "Mầm 1" }
 *                       packageId: { type: integer, nullable: true, example: null }
 *                       packageName: { type: string, nullable: true, example: null }
 *                       periodRange: { type: string, nullable: true, example: null }
 *                       billingMonth: { type: string, example: "07-2026" }
 *                       tuitionFee: { type: number, format: float, example: 0.00 }
 *                       expectedMealFee: { type: number, format: float, example: 0.00 }
 *                       extracurricularFee: { type: number, format: float, example: 0.00 }
 *                       surcharge: { type: number, format: float, example: 0.00 }
 *                       refundAmount: { type: number, format: float, example: 0.00 }
 *                       discountAmount: { type: number, format: float, example: 0.00 }
 *                       totalAmount:
 *                         type: number
 *                         format: float
 *                         description: "Cột generated: tuitionFee + expectedMealFee + extracurricularFee + surcharge - refundAmount - discountAmount"
 *                         example: 0.00
 *                       paymentStatus: { type: string, example: "Unpaid" }
 *                       invoiceType: { type: string, example: "EXTRACURRICULAR" }
 *                       createdAt: { type: integer, description: "Unix timestamp (seconds)", example: 1783564680 }
 *                       dueDate: { type: integer, nullable: true, description: "Unix timestamp (seconds)", example: 1783616400 }
 *                       reminderSentAt: { type: integer, nullable: true, example: null }
 *                       overdueReminderSentAt: { type: integer, nullable: true, example: 1783645200 }
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/invoices/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết một hóa đơn
 *     description: |
 *       Trả về đầy đủ thông tin của 1 hóa đơn (giống các field trong `GET /principal/invoices`),
 *       kèm thêm `transactions[]` — lịch sử giao dịch thanh toán của hóa đơn đó (bảng `Transactions`),
 *       sắp xếp theo `transactionDate` giảm dần.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Fees"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: InvoiceID của hóa đơn cần xem chi tiết
 *         example: 51
 *     responses:
 *       200:
 *         description: Lấy thông tin chi tiết hóa đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Lấy thông tin chi tiết hóa đơn thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, description: "InvoiceID", example: 51 }
 *                     studentId: { type: integer, nullable: true, example: 19 }
 *                     studentFullName: { type: string, nullable: true, example: "Nguyễn Văn A" }
 *                     classId: { type: integer, nullable: true, example: 1 }
 *                     className: { type: string, nullable: true, example: "Mầm 1" }
 *                     packageId: { type: integer, nullable: true, example: null }
 *                     packageName: { type: string, nullable: true, example: null }
 *                     periodRange: { type: string, nullable: true, example: null }
 *                     billingMonth: { type: string, example: "07-2026" }
 *                     tuitionFee: { type: number, format: float, example: 0.00 }
 *                     expectedMealFee: { type: number, format: float, example: 0.00 }
 *                     extracurricularFee: { type: number, format: float, example: 0.00 }
 *                     surcharge: { type: number, format: float, example: 0.00 }
 *                     refundAmount: { type: number, format: float, example: 0.00 }
 *                     discountAmount: { type: number, format: float, example: 0.00 }
 *                     totalAmount: { type: number, format: float, example: 0.00 }
 *                     paymentStatus: { type: string, example: "Unpaid" }
 *                     invoiceType: { type: string, example: "EXTRACURRICULAR" }
 *                     createdAt: { type: integer, description: "Unix timestamp (seconds)", example: 1783564680 }
 *                     dueDate: { type: integer, nullable: true, description: "Unix timestamp (seconds)", example: 1783616400 }
 *                     reminderSentAt: { type: integer, nullable: true, example: null }
 *                     overdueReminderSentAt: { type: integer, nullable: true, example: 1783645200 }
 *                     transactions:
 *                       type: array
 *                       description: Lịch sử giao dịch thanh toán của hóa đơn
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer, description: "TransactionID", example: 5 }
 *                           amountPaid: { type: number, format: float, example: 500000.00 }
 *                           paymentMethod: { type: string, nullable: true, example: "MoMo" }
 *                           transactionCode: { type: string, nullable: true, example: "MOMO123456" }
 *                           transactionDate: { type: integer, description: "Unix timestamp (seconds)", example: 1783600000 }
 *                           status: { type: string, example: "Success" }
 *       400:
 *         description: Bad Request - id không hợp lệ
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy hóa đơn
 */

/**
 * @swagger
 * /principal/academic-year/{id}/activate:
 *   patch:
 *     summary: Kích hoạt một năm học
 *     description: Đặt năm học được chọn thành trạng thái hoạt động (IsActive = 1) và tự động vô hiệu hóa tất cả các năm học khác.
 *     tags: ["Principal - Academic Year"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của năm học cần kích hoạt
 *     responses:
 *       200:
 *         description: Đặt trạng thái kích hoạt thành công
 *       404:
 *         description: Không tìm thấy năm học
 */

/**
 * @swagger
 * /principal/events:
 *   get:
 *     summary: Lấy danh sách sự kiện
 *     description: |
 *       Trả về danh sách sự kiện (`Events`), kèm `classIds[]`/`studentIds[]` (join từ
 *       `EventClasses`/`EventStudents`). Hỗ trợ lọc theo `eventType`.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Events"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: eventType
 *         required: false
 *         schema:
 *           type: string
 *           enum: [Class, School, Holiday, Student]
 *         description: Lọc theo loại sự kiện
 *         example: School
 *     responses:
 *       200:
 *         description: Lấy danh sách sự kiện thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Lấy danh sách sự kiện thành công }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer, description: "EventID", example: 1 }
 *                       title: { type: string, example: "Khai giảng năm học mới" }
 *                       description: { type: string, nullable: true, example: "Lễ khai giảng toàn trường" }
 *                       startTime: { type: integer, description: "Unix timestamp (seconds)", example: 1787886600 }
 *                       endTime: { type: integer, description: "Unix timestamp (seconds)", example: 1787893800 }
 *                       location: { type: string, nullable: true, example: "Sân trường" }
 *                       status: { type: string, example: "Upcoming" }
 *                       eventType: { type: string, enum: [Class, School, Holiday, Student], example: "School" }
 *                       createdBy: { type: integer, nullable: true, description: "UserID người tạo", example: 2 }
 *                       createdAt: { type: integer, description: "Unix timestamp (seconds)", example: 1783564680 }
 *                       classIds:
 *                         type: array
 *                         description: "Chỉ có giá trị khi eventType = 'Class'"
 *                         items: { type: integer }
 *                         example: []
 *                       studentIds:
 *                         type: array
 *                         description: "Chỉ có giá trị khi eventType = 'Student'"
 *                         items: { type: integer }
 *                         example: []
 *       400:
 *         description: Bad Request - eventType không hợp lệ
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *   post:
 *     summary: Tạo sự kiện mới
 *     description: |
 *       Tạo 1 sự kiện theo `eventType`:
 *       - `Class`: bắt buộc truyền `classIds[]` — sự kiện chỉ hiển thị cho các lớp đó.
 *       - `Student`: bắt buộc truyền `studentIds[]` — sự kiện chỉ hiển thị cho các học sinh đó.
 *       - `School`/`Holiday`: không cần `classIds`/`studentIds` — hiển thị cho toàn trường.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Events"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, startTime, endTime, eventType]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Khai giảng năm học mới"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: "Lễ khai giảng toàn trường"
 *               startTime:
 *                 type: integer
 *                 description: Unix timestamp (seconds)
 *                 example: 1787886600
 *               endTime:
 *                 type: integer
 *                 description: Unix timestamp (seconds)
 *                 example: 1787893800
 *               location:
 *                 type: string
 *                 nullable: true
 *                 example: "Sân trường"
 *               status:
 *                 type: string
 *                 description: "Default 'Upcoming'"
 *                 example: "Upcoming"
 *               eventType:
 *                 type: string
 *                 enum: [Class, School, Holiday, Student]
 *                 example: "Class"
 *               classIds:
 *                 type: array
 *                 description: "Bắt buộc khi eventType = 'Class'"
 *                 items: { type: integer }
 *                 example: [1, 2]
 *               studentIds:
 *                 type: array
 *                 description: "Bắt buộc khi eventType = 'Student'"
 *                 items: { type: integer }
 *                 example: []
 *     responses:
 *       201:
 *         description: Tạo sự kiện thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 201 }
 *                 message: { type: string, example: Tạo sự kiện thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 5 }
 *                     title: { type: string, example: "Họp phụ huynh lớp Mầm 1" }
 *                     description: { type: string, nullable: true, example: null }
 *                     startTime: { type: integer, example: 1787886600 }
 *                     endTime: { type: integer, example: 1787893800 }
 *                     location: { type: string, nullable: true, example: null }
 *                     status: { type: string, example: "Upcoming" }
 *                     eventType: { type: string, example: "Class" }
 *                     createdBy: { type: integer, nullable: true, example: 2 }
 *                     classIds:
 *                       type: array
 *                       items: { type: integer }
 *                       example: [1]
 *                     studentIds:
 *                       type: array
 *                       items: { type: integer }
 *                       example: []
 *       400:
 *         description: Bad Request - thiếu title/startTime/endTime/eventType, eventType không hợp lệ, hoặc thiếu classIds/studentIds tương ứng
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/events/{id}:
 *   patch:
 *     summary: Sửa thông tin sự kiện
 *     description: |
 *       Cập nhật một hoặc nhiều trường của sự kiện. Chỉ cần truyền field muốn sửa.
 *
 *       Nếu truyền `eventType` hoặc `classIds`/`studentIds`, toàn bộ liên kết cũ trong
 *       `EventClasses`/`EventStudents` sẽ bị xóa và tạo lại theo giá trị mới truyền vào
 *       (không truyền `classIds`/`studentIds` khi đổi sang `eventType` khác sẽ xóa hết liên kết cũ).
 *
 *       Sau khi cập nhật thành công, tự động gửi thông báo "Sự kiện đã được cập nhật"
 *       cho các phụ huynh liên quan (theo `eventType` mới).
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Events"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: EventID của sự kiện cần sửa
 *         example: 5
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Họp phụ huynh lớp Mầm 1 (dời lịch)"
 *               description:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               startTime:
 *                 type: integer
 *                 description: Unix timestamp (seconds)
 *                 example: 1787890200
 *               endTime:
 *                 type: integer
 *                 description: Unix timestamp (seconds)
 *                 example: 1787897400
 *               location:
 *                 type: string
 *                 nullable: true
 *                 example: null
 *               status:
 *                 type: string
 *                 example: "Upcoming"
 *               eventType:
 *                 type: string
 *                 enum: [Class, School, Holiday, Student]
 *                 example: "Class"
 *               classIds:
 *                 type: array
 *                 items: { type: integer }
 *                 example: [1, 2]
 *               studentIds:
 *                 type: array
 *                 items: { type: integer }
 *                 example: []
 *     responses:
 *       200:
 *         description: Cập nhật sự kiện thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Cập nhật sự kiện thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 5 }
 *                     title: { type: string, example: "Họp phụ huynh lớp Mầm 1 (dời lịch)" }
 *                     description: { type: string, nullable: true, example: null }
 *                     startTime: { type: integer, example: 1787890200 }
 *                     endTime: { type: integer, example: 1787897400 }
 *                     location: { type: string, nullable: true, example: null }
 *                     status: { type: string, example: "Upcoming" }
 *                     eventType: { type: string, example: "Class" }
 *                     createdBy: { type: integer, nullable: true, example: 2 }
 *                     createdAt: { type: integer, example: 1783564680 }
 *                     classIds:
 *                       type: array
 *                       items: { type: integer }
 *                       example: [1, 2]
 *                     studentIds:
 *                       type: array
 *                       items: { type: integer }
 *                       example: []
 *       400:
 *         description: Bad Request - id không hợp lệ, không truyền field nào để sửa, eventType không hợp lệ, hoặc thiếu classIds/studentIds tương ứng
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy sự kiện
 *   delete:
 *     summary: Xóa sự kiện
 *     description: |
 *       Xóa sự kiện khỏi hệ thống. Các liên kết trong `EventClasses`/`EventStudents` tự
 *       động bị xóa theo (`ON DELETE CASCADE`).
 *
 *       Trước khi xóa, hệ thống gửi thông báo "Sự kiện đã bị hủy" cho các phụ huynh
 *       liên quan (theo `eventType` hiện tại của sự kiện).
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Events"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: EventID của sự kiện cần xóa
 *         example: 5
 *     responses:
 *       200:
 *         description: Xóa sự kiện thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Đã xóa sự kiện thành công }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Bad Request - id không hợp lệ
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy sự kiện
 */

/**
 * @swagger
 * /principal/holidays:
 *   get:
 *     summary: Lấy danh sách ngày nghỉ lễ
 *     description: |
 *       Trả về danh sách ngày nghỉ lễ (`Holidays`), kèm tên năm học (join `AcademicYears`).
 *       Hỗ trợ lọc theo `yearId`.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Events"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: yearId
 *         required: false
 *         schema:
 *           type: integer
 *         description: Lọc theo năm học
 *         example: 1
 *     responses:
 *       200:
 *         description: Lấy danh sách ngày nghỉ lễ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Lấy danh sách ngày nghỉ lễ thành công }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer, description: "HolidayID", example: 1 }
 *                       holidayDate: { type: integer, description: "Unix timestamp (seconds)", example: 1787884800 }
 *                       holidayName: { type: string, nullable: true, example: "Quốc khánh 2/9" }
 *                       yearId: { type: integer, nullable: true, example: 1 }
 *                       yearName: { type: string, nullable: true, example: "Niên khóa 2026-2027" }
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *   post:
 *     summary: Tạo ngày nghỉ lễ mới
 *     description: |
 *       Tạo mới 1 ngày nghỉ lễ (`Holidays`), dùng bởi hệ thống để loại trừ khỏi số ngày công
 *       khi tính `expectedMealFee` trong billing cron.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Events"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [holidayDate]
 *             properties:
 *               holidayDate:
 *                 type: integer
 *                 description: Unix timestamp (seconds)
 *                 example: 1787884800
 *               holidayName:
 *                 type: string
 *                 nullable: true
 *                 example: "Quốc khánh 2/9"
 *               yearId:
 *                 type: integer
 *                 nullable: true
 *                 description: Năm học áp dụng (tùy chọn)
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tạo ngày nghỉ lễ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 201 }
 *                 message: { type: string, example: Tạo ngày nghỉ lễ thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 2 }
 *                     holidayDate: { type: integer, example: 1787884800 }
 *                     holidayName: { type: string, nullable: true, example: "Quốc khánh 2/9" }
 *                     yearId: { type: integer, nullable: true, example: 1 }
 *       400:
 *         description: Bad Request - thiếu holidayDate
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy năm học (nếu truyền yearId)
 */

/**
 * @swagger
 * /principal/holidays/{id}:
 *   patch:
 *     summary: Sửa thông tin một ngày nghỉ lễ
 *     description: |
 *       Cập nhật một hoặc nhiều trường (`holidayDate`, `holidayName`, `yearId`) của ngày
 *       nghỉ lễ (`Holidays`) theo `HolidayID`. Chỉ cần truyền field muốn sửa.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Events"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: HolidayID của ngày nghỉ lễ cần sửa
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               holidayDate:
 *                 type: integer
 *                 description: Unix timestamp (seconds)
 *                 example: 1787971200
 *               holidayName:
 *                 type: string
 *                 nullable: true
 *                 example: "Quốc khánh 2/9 (nghỉ bù)"
 *               yearId:
 *                 type: integer
 *                 nullable: true
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cập nhật ngày nghỉ lễ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Cập nhật ngày nghỉ lễ thành công }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Bad Request - id không hợp lệ, hoặc không truyền field nào để sửa
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy ngày nghỉ lễ, hoặc không tìm thấy năm học (nếu truyền yearId)
 *   delete:
 *     summary: Xóa một ngày nghỉ lễ
 *     description: |
 *       Xóa ngày nghỉ lễ khỏi hệ thống. Lưu ý: xóa ngày nghỉ lễ sẽ ảnh hưởng tới số ngày
 *       công dùng để tính `expectedMealFee` của billing cron cho các tháng liên quan
 *       (nếu hóa đơn tháng đó đã được tạo trước khi xóa, hóa đơn cũ sẽ không tự động tính lại).
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Events"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: HolidayID của ngày nghỉ lễ cần xóa
 *         example: 1
 *     responses:
 *       200:
 *         description: Xóa ngày nghỉ lễ thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Xóa ngày nghỉ lễ thành công }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Bad Request - id không hợp lệ
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy ngày nghỉ lễ
 */

/**
 * @swagger
 * /principal/schedules/monthly:
 *   get:
 *     summary: Lấy danh sách tổng quan thời khóa biểu tháng
 *     description: |
 *       Trả về danh sách `MonthlySchedules` (mỗi item là 1 tháng/1 lớp), kèm tên lớp và
 *       tên khối (join `Classes`/`Grades`). Dùng cho màn hình sidebar "Yêu cầu duyệt".
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Schedules"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: year
 *         required: false
 *         schema: { type: integer }
 *         example: 2026
 *       - in: query
 *         name: month
 *         required: false
 *         schema: { type: integer, minimum: 1, maximum: 12 }
 *         example: 8
 *       - in: query
 *         name: approvedStatus
 *         required: false
 *         schema: { type: integer, enum: [0, 1] }
 *         description: "0 = Chưa duyệt, 1 = Đã duyệt"
 *         example: 0
 *       - in: query
 *         name: classId
 *         required: false
 *         schema: { type: integer }
 *         example: 1
 *     responses:
 *       200:
 *         description: Lấy danh sách thời khóa biểu tháng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Lấy danh sách thời khóa biểu tháng thành công }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer, description: "MonthlyScheduleID", example: 2 }
 *                       classId: { type: integer, example: 1 }
 *                       className: { type: string, example: "Mầm 1" }
 *                       gradeName: { type: string, nullable: true, example: "Khối Mầm" }
 *                       month: { type: integer, example: 8 }
 *                       year: { type: integer, example: 2026 }
 *                       monthTheme: { type: string, example: "Tháng 8 Bứt Phá - Bé Khám Phá Thế Giới Xung Quanh" }
 *                       approvedStatus: { type: integer, enum: [0, 1], example: 0 }
 *                       isActive: { type: integer, example: 1 }
 *                       createdAt: { type: integer, description: "Unix timestamp (seconds)", example: 1783617978 }
 *                       updatedAt: { type: integer, description: "Unix timestamp (seconds)", example: 1783617978 }
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/schedules/monthly/{id}:
 *   get:
 *     summary: Lấy chi tiết đầy đủ 1 thời khóa biểu tháng
 *     description: |
 *       Trả về thông tin `MonthlySchedule` kèm toàn bộ `WeeklySchedules` của tháng đó,
 *       mỗi tuần kèm `items[]` là các hoạt động (`WeeklyScheduleDetails`) đã sort theo
 *       thứ tự ngày trong tuần rồi giờ bắt đầu.
 *
 *       Dùng cho màn hình chi tiết khi hiệu trưởng bấm vào 1 tháng trong danh sách
 *       "Yêu cầu duyệt".
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Schedules"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *         description: MonthlyScheduleID
 *         example: 2
 *     responses:
 *       200:
 *         description: Lấy chi tiết thời khóa biểu tháng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Lấy chi tiết thời khóa biểu tháng thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 2 }
 *                     classId: { type: integer, example: 1 }
 *                     className: { type: string, example: "Mầm 1" }
 *                     gradeName: { type: string, nullable: true, example: "Khối Mầm" }
 *                     month: { type: integer, example: 8 }
 *                     year: { type: integer, example: 2026 }
 *                     monthTheme: { type: string, example: "Tháng 8 Bứt Phá" }
 *                     approvedStatus: { type: integer, enum: [0, 1], example: 0 }
 *                     isActive: { type: integer, example: 1 }
 *                     createdAt: { type: integer, example: 1783617978 }
 *                     updatedAt: { type: integer, example: 1783617978 }
 *                     weeks:
 *                       type: array
 *                       description: Danh sách tuần trong tháng, đã sort theo weekOrder
 *                       items:
 *                         type: object
 *                         properties:
 *                           weeklyScheduleId: { type: integer, example: 5 }
 *                           monthlyScheduleId: { type: integer, example: 2 }
 *                           weekOrder: { type: integer, example: 1 }
 *                           weekTheme: { type: string, example: "Tuần 1: Làm quen với biển cả" }
 *                           createdAt: { type: integer, example: 1783012594 }
 *                           updatedAt: { type: integer, example: 1783012594 }
 *                           items:
 *                             type: array
 *                             description: Các hoạt động trong tuần, đã sort theo ngày rồi giờ bắt đầu
 *                             items:
 *                               type: object
 *                               properties:
 *                                 scheduleDetailId: { type: integer, example: 10 }
 *                                 weeklyScheduleId: { type: integer, example: 5 }
 *                                 dayOfWeek: { type: string, enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday], example: "Monday" }
 *                                 startTime: { type: string, example: "07:30:00" }
 *                                 endTime: { type: string, example: "08:00:00" }
 *                                 activityName: { type: string, example: "Đón trẻ" }
 *                                 details: { type: string, nullable: true, example: null }
 *                                 location: { type: string, nullable: true, example: "Sân trường" }
 *                                 activityType: { type: string, enum: [pickup, meal, study, nap, play, dropoff, other], example: "pickup" }
 *       400:
 *         description: Bad Request - id không hợp lệ
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy thời khóa biểu tháng
 */

/**
 * @swagger
 * /principal/schedules/monthly/{id}/approve:
 *   patch:
 *     summary: Duyệt/từ chối thời khóa biểu tháng
 *     description: |
 *       Cập nhật `ApprovedStatus` của 1 `MonthlySchedule` (0 = Chưa duyệt, 1 = Đã duyệt).
 *       Sau khi cập nhật, tự động gửi push notification cho các giáo viên phụ trách lớp
 *       đó (chạy nền, không ảnh hưởng response).
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Schedules"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *         description: MonthlyScheduleID
 *         example: 2
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [approvedStatus]
 *             properties:
 *               approvedStatus:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: "0 = Chưa duyệt/Từ chối, 1 = Đã duyệt"
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cập nhật trạng thái duyệt thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Đã duyệt thời khóa biểu tháng }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Bad Request - id không hợp lệ, hoặc approvedStatus không phải 0/1
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy thời khóa biểu tháng
 */

/**
 * @swagger
 * /principal/menus:
 *   get:
 *     summary: Lấy danh sách thực đơn
 *     description: |
 *       Trả về danh sách `Menus` (thực đơn theo tuần/lớp), kèm tên lớp (join `Classes`).
 *       Dùng cho trang danh sách thực đơn.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Menus"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: classId
 *         required: false
 *         schema: { type: integer }
 *         example: 1
 *       - in: query
 *         name: year
 *         required: false
 *         schema: { type: integer }
 *         example: 2026
 *       - in: query
 *         name: weekNumber
 *         required: false
 *         schema: { type: integer }
 *         example: 32
 *     responses:
 *       200:
 *         description: Lấy danh sách thực đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Lấy danh sách thực đơn thành công }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: integer, description: "MenuID", example: 1 }
 *                       classId: { type: integer, example: 1 }
 *                       className: { type: string, example: "Mầm 1" }
 *                       weekNumber: { type: integer, example: 32 }
 *                       year: { type: integer, example: 2026 }
 *                       menuName: { type: string, nullable: true, example: "Thực đơn Tuần 32 - Ngày hè năng động (Mầm 1)" }
 *                       createdAt: { type: integer, example: 1783745949 }
 *                       updatedAt: { type: integer, example: 1783745949 }
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */

/**
 * @swagger
 * /principal/menus/{id}:
 *   get:
 *     summary: Lấy chi tiết một thực đơn
 *     description: |
 *       Trả về thông tin `Menu` kèm toàn bộ `MenuDetails` (7 ngày x 3 bữa), đã sort theo
 *       thứ tự ngày trong tuần rồi loại bữa (Breakfast → Lunch → Snack). FE tự group
 *       `menuDetails[]` theo `dayOfWeek` nếu cần hiển thị dạng bảng.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền truy cập.
 *     tags: ["Principal - Menus"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *         description: MenuID
 *         example: 1
 *     responses:
 *       200:
 *         description: Lấy chi tiết thực đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Lấy chi tiết thực đơn thành công }
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: { type: integer, example: 1 }
 *                     classId: { type: integer, example: 1 }
 *                     className: { type: string, example: "Mầm 1" }
 *                     weekNumber: { type: integer, example: 32 }
 *                     year: { type: integer, example: 2026 }
 *                     menuName: { type: string, nullable: true, example: "Thực đơn Tuần 32 - Ngày hè năng động (Mầm 1)" }
 *                     createdAt: { type: integer, example: 1783745949 }
 *                     updatedAt: { type: integer, example: 1783745949 }
 *                     menuDetails:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id: { type: integer, description: "MenuDetailID", example: 16 }
 *                           menuId: { type: integer, example: 1 }
 *                           dayOfWeek: { type: string, enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday], example: "Monday" }
 *                           mealType: { type: string, enum: [Breakfast, Lunch, Snack], example: "Breakfast" }
 *                           dishName: { type: string, example: "Bún bò Huế" }
 *                           calories: { type: integer, nullable: true, example: 300 }
 *                           nutritionalDetails: { type: string, nullable: true, example: "Nước dùng đậm đà, bún dai sợi. Bổ sung sắt." }
 *       400:
 *         description: Bad Request - id không hợp lệ
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy thực đơn
 *   delete:
 *     summary: Xóa một thực đơn
 *     description: |
 *       Xóa `Menu` khỏi hệ thống. Toàn bộ `MenuDetails` liên quan tự động bị xóa theo
 *       (`ON DELETE CASCADE`).
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Menus"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer, minimum: 1 }
 *         description: MenuID cần xóa
 *         example: 1
 *     responses:
 *       200:
 *         description: Xóa thực đơn thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 200 }
 *                 message: { type: string, example: Xóa thực đơn thành công }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Bad Request - id không hợp lệ
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 *       404:
 *         description: Not Found - không tìm thấy thực đơn
 */

/**
 * @swagger
 * /principal/menus/import:
 *   post:
 *     summary: Import thực đơn từ 1 hoặc nhiều file CSV/XLSX
 *     description: |
 *       Nhận **nhiều file cùng lúc** (field `files`, tối đa 10 file/lần), mỗi file là 1
 *       thực đơn tuần cho 1 lớp. Mỗi file phải theo layout 2 vùng:
 *       - Hàng 1: header vùng thông tin — `ClassID,WeekNumber,Year,MenuName`
 *       - Hàng 2: dữ liệu vùng thông tin (đúng 1 hàng)
 *       - Hàng 3: để trống
 *       - Hàng 4: header vùng chi tiết — `DayOfWeek,MealType,DishName,Calories,NutritionalDetails`
 *       - Hàng 5 trở đi: dữ liệu chi tiết (mỗi hàng là 1 món ăn của 1 bữa/1 ngày)
 *
 *       **Xử lý all-or-nothing:** toàn bộ file được xử lý trong 1 transaction. Nếu BẤT KỲ
 *       file nào lỗi (sai format, `ClassID` không tồn tại, hoặc đã có thực đơn cho
 *       lớp/tuần/năm đó), **toàn bộ lô bị hủy** — không file nào được lưu. Response luôn
 *       trả về mảng kết quả cho từng file để FE biết chính xác file nào gây lỗi.
 *
 *       **Chỉ hiệu trưởng (roleId=2)** mới có quyền thực hiện.
 *     tags: ["Principal - Menus"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [files]
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: 1 hoặc nhiều file .csv/.xlsx, mỗi file là 1 thực đơn tuần cho 1 lớp
 *     responses:
 *       201:
 *         description: Tất cả file import thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 statusCode: { type: integer, example: 201 }
 *                 message: { type: string, example: Import thực đơn thành công }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename: { type: string, example: "menu_mam1_tuan32.xlsx" }
 *                       success: { type: boolean, example: true }
 *                       menuId: { type: integer, example: 14 }
 *       400:
 *         description: |
 *           Bad Request - thiếu file, hoặc có ít nhất 1 file lỗi (toàn bộ lô bị hủy).
 *           Response body vẫn trả `data` là mảng kết quả từng file, `success: false` kèm
 *           `message` lỗi cụ thể cho file gây lỗi; các file khác được đánh dấu không xử lý
 *           được vì lô import bị hủy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: false }
 *                 statusCode: { type: integer, example: 400 }
 *                 message: { type: string, example: Import thất bại — xem chi tiết lỗi từng file }
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       filename: { type: string, example: "menu_mam1_tuan32.xlsx" }
 *                       success: { type: boolean, example: false }
 *                       message: { type: string, example: "File \"menu_mam1_tuan32.xlsx\": đã tồn tại thực đơn cho lớp này ở tuần 32/2026" }
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */
