import express from 'express';
import * as teacherController from './teacher.controller.js';
import * as teacherValidation from './teacher.validation.js';
import * as lessonPlanController from './sub/lessonPlan.controller.js';
import * as lessonPlanValidation from './sub/lessonPlan.validation.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import { upload } from '../../utils/s3Upload.js';

const router = express.Router();

// Apply authentication and teacher role authorization to all routes in this module
router.use(authenticate, authorize(3));

// Dashboard
router.get('/dashboard', teacherController.getDashboard);

// Profile
router.get('/profile', teacherController.getProfile);
router.put('/profile', teacherValidation.validateUpdateProfile, teacherController.updateProfile);

// Work History
router.get('/work-history', teacherController.getWorkHistory);

// Settings
router.get('/settings', teacherController.getSettings);
router.put('/settings', teacherController.updateSettings);

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
router.put(
  '/classes/:classId/menu',
  teacherValidation.validateUpdateClassMenu,
  teacherController.updateClassMenu
);
router.get(
  '/classes/:classId/schedule',
  teacherValidation.validateGetClassSchedule,
  teacherController.getClassSchedule
);
router.get(
  '/classes/:classId/schedule/weekly',
  teacherValidation.validateGetWeeklySchedule,
  teacherController.getWeeklySchedule
);


// Attendance & Meals
router.get(
  '/classes/:classId/students',
  teacherValidation.validateGetClassStudents,
  teacherController.getClassStudents
);
router.post('/attendance/quick', teacherValidation.validateQuickAttendance, teacherController.submitQuickAttendance);
router.post('/attendance/meals', teacherValidation.validateQuickMealLogs, teacherController.submitQuickMealLogs);
router.post('/attendance/activities', teacherController.submitQuickActivities);

// Uploads
router.post('/upload', upload.single('image'), teacherController.uploadImage);

// Medical Requests
router.get(
  '/classes/:classId/medical-requests',
  teacherValidation.validateGetMedicalRequests,
  teacherController.getMedicalRequests
);
router.put(
  '/medical-requests/:requestId',
  teacherValidation.validateUpdateMedicalRequest,
  teacherController.updateMedicalRequestStatus
);

// Newsfeed
router.post(
  '/classes/:classId/newsfeed',
  teacherValidation.validateCreateNewsfeed,
  teacherController.createNewsfeed
);
router.get(
  '/classes/:classId/newsfeed',
  teacherController.getNewsfeeds
);
router.delete(
  '/classes/:classId/newsfeed/:postId',
  teacherController.deleteNewsfeed
);

// Detailed Students
router.get(
  '/classes/:classId/detailed-students',
  teacherValidation.validateGetDetailedStudents,
  teacherController.getDetailedClassStudents
);

// Student Assessments (Phiếu bé ngoan)
router.get(
  '/classes/:classId/assessments',
  teacherValidation.validateGetClassAssessments,
  teacherController.getClassAssessments
);
router.post(
  '/classes/:classId/assessments',
  teacherValidation.validateSubmitClassAssessments,
  teacherController.submitClassAssessments
);

// Reward Badges
router.get('/reward-badges', teacherController.getRewardBadges);

// Monthly Automated Good Kids
router.get(
  '/classes/:classId/monthly-good-kids',
  teacherController.getMonthlyGoodKids
);

// Weekly Rewards
router.get(
  '/classes/:classId/weekly-rewards',
  teacherValidation.validateGetWeeklyRewards,
  teacherController.getWeeklyRewards
);
router.post(
  '/classes/:classId/weekly-rewards',
  teacherValidation.validateAwardWeeklyRewards,
  teacherController.awardWeeklyRewards
);

router.put('/classes/:classId/schedule/:scheduleId/status', teacherValidation.validateUpdateScheduleStatus, teacherController.updateScheduleStatus);

router.post('/attendance/scan', teacherValidation.validateScanQR, teacherController.scanQRAttendance);

// =============================
// Lesson Plans (Giáo án)
// =============================
router.get(
  '/lesson-plans',
  lessonPlanValidation.validateListLessonPlans,
  lessonPlanController.getLessonPlans
);
router.get(
  '/lesson-plans/:id',
  lessonPlanValidation.validateLessonPlanIdParam,
  lessonPlanController.getLessonPlanDetail
);
router.post(
  '/lesson-plans',
  lessonPlanValidation.validateUpsertLessonPlan,
  lessonPlanController.upsertLessonPlan
);
router.post(
  '/lesson-plans/:id/submit',
  lessonPlanValidation.validateSubmitOrWithdraw,
  lessonPlanController.submitLessonPlan
);
router.post(
  '/lesson-plans/:id/withdraw',
  lessonPlanValidation.validateSubmitOrWithdraw,
  lessonPlanController.withdrawLessonPlan
);
router.patch(
  '/lesson-plans/:id/items/:itemId/complete',
  lessonPlanValidation.validateCompleteLessonPlanItem,
  lessonPlanController.completeLessonPlanItem
);

// Weekly Schedule Templates
import weeklyScheduleRouter from './sub/weeklySchedule.route.js';
router.use('/', weeklyScheduleRouter);

export default router;
