import express from 'express';
import teacherController from './teacher.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Scan QR code and record attendance
router.post('/attendance/scan', authenticate, authorize(3), teacherController.scanAttendance);

export default router;
