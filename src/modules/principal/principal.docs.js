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
 *       Trả về danh sách tài khoản theo role được chỉ định. Mỗi item gồm 4 trường:
 *       `id`, `fullName`, `username`, `email`. Dùng cho màn hình quản trị của hiệu trưởng
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
 *       400:
 *         description: Bad Request - thiếu hoặc sai giá trị `role`
 *       401:
 *         description: Unauthorized - thiếu/không hợp lệ token
 *       403:
 *         description: Forbidden - không phải role hiệu trưởng
 */
