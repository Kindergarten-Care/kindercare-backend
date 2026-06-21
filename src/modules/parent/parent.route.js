import express from 'express';
import parentController from './parent.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { upload } from '../../utils/s3Upload.js';

const router = express.Router();

// Get children of the logged-in parent
router.get('/children', authenticate, authorize(4), parentController.getMyChildren);

// Get profile of the logged-in parent
router.get('/profile', authenticate, authorize(4), parentController.getMyProfile);

// Get health records of a child
router.get('/children/:studentId/health-records', authenticate, authorize(4), parentController.getChildHealthRecords);

// Get attendance records of a child
router.get('/children/:studentId/attendance', authenticate, authorize(4), parentController.getChildAttendance);

// Get leave requests of a child
router.get('/children/:studentId/leave-requests', authenticate, authorize(4), parentController.getChildLeaveRequests);

// Create a leave request for a child (with optional image evidence)
router.post('/leave-requests', authenticate, authorize(4), upload.single('evidence'), parentController.createLeaveRequest);

// Create a medication request for a child (with optional prescription image)
router.post('/medication-requests', authenticate, authorize(4), upload.single('medicineImage'), parentController.createMedicationRequest);

export default router;

