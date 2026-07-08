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
 * /principal/accounts:
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
 *                   example: Reset mật khẩu thành công (Mặc định: 123456)
 *                 data:
 *                   type: 'null'
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
