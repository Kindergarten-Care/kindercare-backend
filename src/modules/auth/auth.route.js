import express from 'express';
import authController from './auth.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/admin/login', authController.loginAdmin);
router.post('/principal/login', authController.loginPrincipal);
router.post('/teacher/login', authController.loginTeacher);
router.post('/parent/login', authController.loginParent);
router.post('/logout', authenticate, authController.logout);
router.put('/change-password', authenticate, authController.changePassword);

export default router;
