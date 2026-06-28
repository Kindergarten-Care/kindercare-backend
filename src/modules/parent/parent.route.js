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

// Get medication requests of a child
router.get('/children/:studentId/medication-requests', authenticate, authorize(4), parentController.getChildMedicationRequests);

// Get assessments of a child
router.get('/children/:studentId/assessments', authenticate, authorize(4), parentController.getChildAssessments);

// Get daily schedule of a child's class
router.get('/children/:studentId/daily-schedule', authenticate, authorize(4), parentController.getChildDailySchedule);

// Get daily lessons of a child's class
router.get('/children/:studentId/daily-lessons', authenticate, authorize(4), parentController.getChildDailyLessons);

// Get daily albums of a child's class
router.get('/children/:studentId/daily-albums', authenticate, authorize(4), parentController.getChildDailyAlbums);

// Generate QR token for attendance
router.get('/children/:studentId/qr-token', authenticate, authorize(4), parentController.getQrToken);





// Create a leave request for a child (with optional image evidence)
router.post('/leave-requests', authenticate, authorize(4), upload.single('evidence'), parentController.createLeaveRequest);

// Create a medication request for a child (with optional prescription image)
router.post('/medication-requests', authenticate, authorize(4), upload.single('medicineImage'), parentController.createMedicationRequest);

// Cancel a leave request
router.patch('/leave-requests/:requestId/cancel', authenticate, authorize(4), parentController.cancelLeaveRequest);

// Cancel a medication request
router.patch('/medication-requests/:medRequestId/cancel', authenticate, authorize(4), parentController.cancelMedicationRequest);

export default router;

