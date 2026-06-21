import express from 'express';
import * as teacherController from './teacher.controller.js';
import * as teacherValidation from './teacher.validation.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Apply authentication and teacher role authorization to all routes in this module
router.use(authenticate, authorize(3));

// Dashboard
router.get('/dashboard', teacherController.getDashboard);

// Profile
router.get('/profile', teacherController.getProfile);
router.put('/profile', teacherValidation.validateUpdateProfile, teacherController.updateProfile);

// Leave Requests
router.get('/leave-requests', teacherController.getLeaveRequests);
router.get(
  '/leave-requests/:requestId',
  teacherValidation.validateGetLeaveRequestDetail,
  teacherController.getLeaveRequestDetail
);
router.put(
  '/leave-requests/:requestId/status',
  teacherValidation.validateUpdateLeaveRequestStatus,
  teacherController.updateLeaveRequestStatus
);

// Classes
router.get('/classes', teacherController.getClasses);
router.get(
  '/classes/:classId/menu',
  teacherValidation.validateGetClassMenu,
  teacherController.getClassMenu
);

// Attendance & Meals
router.get(
  '/classes/:classId/students',
  teacherValidation.validateGetClassStudents,
  teacherController.getClassStudents
);
router.post('/attendance/quick', teacherValidation.validateQuickAttendance, teacherController.submitQuickAttendance);
router.post('/attendance/meals', teacherValidation.validateQuickMealLogs, teacherController.submitQuickMealLogs);

export default router;
