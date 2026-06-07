import express from 'express';
import authController from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

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
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Tên đăng nhập
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
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: admin_it
 *                         roleId:
 *                           type: integer
 *                           example: 1
 *                         roleName:
 *                           type: string
 *                           example: Admin
 *                         fcmToken:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *       400:
 *         description: Thiếu thông tin đăng nhập
 *       401:
 *         description: Sai thông tin đăng nhập
 *       403:
 *         description: Tài khoản bị vô hiệu hóa
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/admin/login:
 *   post:
 *     summary: Đăng nhập Admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Tên đăng nhập
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
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           example: 1
 *                         username:
 *                           type: string
 *                           example: admin_it
 *                         roleId:
 *                           type: integer
 *                           example: 1
 *                         roleName:
 *                           type: string
 *                           example: Admin
 *                         fcmToken:
 *                           type: string
 *                           nullable: true
 *                           example: null
 *       400:
 *         description: Thiếu thông tin đăng nhập
 *       401:
 *         description: Sai thông tin đăng nhập
 *       403:
 *         description: Không có quyền truy cập hoặc tài khoản bị vô hiệu hóa
 */
router.post('/admin/login', authController.loginAdmin);

/**
 * @swagger
 * /auth/principal/login:
 *   post:
 *     summary: Đăng nhập Hiệu trưởng
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Tên đăng nhập
 *                 example: hieutruong_mai
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
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           example: 2
 *                         username:
 *                           type: string
 *                           example: hieutruong_mai
 *                         roleId:
 *                           type: integer
 *                           example: 2
 *                         roleName:
 *                           type: string
 *                           example: Principal
 *                         fcmToken:
 *                           type: string
 *                           nullable: true
 *                           example: token_ht_01
 *       400:
 *         description: Thiếu thông tin đăng nhập
 *       401:
 *         description: Sai thông tin đăng nhập
 *       403:
 *         description: Không có quyền truy cập hoặc tài khoản bị vô hiệu hóa
 */
router.post('/principal/login', authController.loginPrincipal);

/**
 * @swagger
 * /auth/teacher/login:
 *   post:
 *     summary: Đăng nhập Giáo viên
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Tên đăng nhập
 *                 example: gv_lan
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
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           example: 3
 *                         username:
 *                           type: string
 *                           example: gv_lan
 *                         roleId:
 *                           type: integer
 *                           example: 3
 *                         roleName:
 *                           type: string
 *                           example: Teacher
 *                         fcmToken:
 *                           type: string
 *                           nullable: true
 *                           example: token_gv_01
 *       400:
 *         description: Thiếu thông tin đăng nhập
 *       401:
 *         description: Sai thông tin đăng nhập
 *       403:
 *         description: Không có quyền truy cập hoặc tài khoản bị vô hiệu hóa
 */
router.post('/teacher/login', authController.loginTeacher);

/**
 * @swagger
 * /auth/parent/login:
 *   post:
 *     summary: Đăng nhập Phụ huynh
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [identifier, password]
 *             properties:
 *               identifier:
 *                 type: string
 *                 description: Tên đăng nhập, email hoặc số điện thoại
 *                 example: ph_tuan
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
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         userId:
 *                           type: integer
 *                           example: 9
 *                         username:
 *                           type: string
 *                           example: ph_tuan
 *                         roleId:
 *                           type: integer
 *                           example: 4
 *                         roleName:
 *                           type: string
 *                           example: Parent
 *                         fcmToken:
 *                           type: string
 *                           nullable: true
 *                           example: token_ph_01
 *       400:
 *         description: Thiếu thông tin đăng nhập
 *       401:
 *         description: Sai thông tin đăng nhập
 *       403:
 *         description: Không có quyền truy cập hoặc tài khoản bị vô hiệu hóa
 */
router.post('/parent/login', authController.loginParent);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Đăng xuất
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
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
 *                   example: Đăng xuất thành công
 *                 data:
 *                   nullable: true
 *                   example: null
 *       401:
 *         description: Token không hợp lệ hoặc đã hết hạn
 */
router.post('/logout', authenticate, authController.logout);

export default router;
