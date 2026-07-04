import express from 'express';
import parentController from './parent.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { upload } from '../../utils/s3Upload.js';

const router = express.Router();

// Get children of the logged-in parent
router.get('/children', authenticate, authorize(4), parentController.getMyChildren);

// Get detail of a single child
router.get('/children/:studentId', authenticate, authorize(4), parentController.getChildDetail);

// Get relatives of a child
router.get('/children/:studentId/relatives', authenticate, authorize(4), parentController.getChildRelatives);

// Get weekly timetable of a child's class
router.get('/children/:studentId/weekly-timetable', authenticate, authorize(4), parentController.getChildWeeklyTimetable);

// Get profile of the logged-in parent
router.get('/profile', authenticate, authorize(4), parentController.getMyProfile);

// Update profile of the logged-in parent (with optional avatar upload)
router.patch('/profile', authenticate, authorize(4), upload.single('avatar'), parentController.updateMyProfile);

// Change password
router.patch('/change-password', authenticate, authorize(4), parentController.changePassword);

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

// Get class newsfeed of a child's class
router.get('/children/:studentId/newsfeeds', authenticate, authorize(4), parentController.getChildNewsfeeds);

// Get daily menu of a child's class
router.get('/children/:studentId/menu', authenticate, authorize(4), parentController.getChildMenu);

// Get daily activities of a child
router.get('/children/:studentId/daily-activities', authenticate, authorize(4), parentController.getChildDailyActivities);

// Get badges of a child
router.get('/children/:studentId/badges', authenticate, authorize(4), parentController.getChildBadges);

// Generate QR token for attendance
router.get('/children/:studentId/qr-token', authenticate, authorize(4), parentController.getQrToken);

// Get daily events of a child
router.get('/events/daily', authenticate, authorize(4), parentController.getChildDailyEvents);





// Create a leave request for a child (with optional image evidence)
router.post('/leave-requests', authenticate, authorize(4), upload.single('evidence'), parentController.createLeaveRequest);

// Create a medication request for a child (with optional prescription image)
router.post('/medication-requests', authenticate, authorize(4), upload.single('medicineImage'), parentController.createMedicationRequest);

// Create a proxy authorization for a child (with optional proxy photo)
router.post('/proxy-authorizations', authenticate, authorize(4), upload.single('proxyPhoto'), parentController.createProxyAuthorization);

// Get proxy authorizations of a child
router.get('/children/:studentId/proxy-authorizations', authenticate, authorize(4), parentController.getChildProxyAuthorizations);

// Cancel a proxy authorization
router.patch('/proxy-authorizations/:authorizationId/cancel', authenticate, authorize(4), parentController.cancelProxyAuthorization);

// Cancel a leave request
router.patch('/leave-requests/:requestId/cancel', authenticate, authorize(4), parentController.cancelLeaveRequest);

// Cancel a medication request
router.patch('/medication-requests/:medRequestId/cancel', authenticate, authorize(4), parentController.cancelMedicationRequest);

// Get invoices of a child
router.get('/children/:studentId/invoices', authenticate, authorize(4), parentController.getChildInvoices);

// Get detail of a single invoice
router.get('/invoices/:invoiceId', authenticate, authorize(4), parentController.getInvoiceDetail);

// Pay an invoice (manual, e.g. bank transfer recorded by parent)
router.post('/invoices/:invoiceId/pay', authenticate, authorize(4), parentController.payInvoice);

// MoMo IPN callback — called directly by MoMo servers, no JWT auth (verified via signature)
router.post('/invoices/momo-ipn', parentController.momoIpn);

// Create a MoMo payment order for an invoice, returns payUrl to redirect to
router.post('/invoices/:invoiceId/pay-momo', authenticate, authorize(4), parentController.payInvoiceWithMomo);

// Get the catalog of extracurricular activities
router.get('/extracurriculars', authenticate, authorize(4), parentController.getExtracurriculars);

// Get a child's extracurricular enrollments
router.get('/children/:studentId/extracurriculars', authenticate, authorize(4), parentController.getChildExtracurriculars);

// Register a child for an extracurricular activity (effective next month)
router.post('/children/:studentId/extracurriculars', authenticate, authorize(4), parentController.registerExtracurricular);

// Cancel a child's extracurricular enrollment
router.patch('/children/:studentId/extracurriculars/:enrollmentId/cancel', authenticate, authorize(4), parentController.cancelExtracurricular);

export default router;

