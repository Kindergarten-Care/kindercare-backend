import express from 'express';
import authController from './auth.controller.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Xác thực người dùng
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - identifier
 *               - password
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Username, email hoặc số điện thoại
 *                 example: admin_it
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
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
 *                   example: Đăng nhập thành công
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                         username:
 *                           type: string
 *                         roleId:
 *                           type: integer
 *                         roleName:
 *                           type: string
 *                         fcmToken:
 *                           type: string
 *       400:
 *         description: Thiếu thông tin đăng nhập
 *       401:
 *         description: Sai tên đăng nhập hoặc mật khẩu
 *       403:
 *         description: Tài khoản bị vô hiệu hóa
 */
router.post('/login', authController.login);

export default router;
