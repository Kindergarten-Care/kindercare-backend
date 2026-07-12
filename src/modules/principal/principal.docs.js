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
