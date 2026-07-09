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
