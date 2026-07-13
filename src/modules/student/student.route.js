import express from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';
import * as studentValidation from './student.validation.js';
import * as studentController from './student.controller.js';

const router = express.Router();

// Apply auth middleware to all student endpoints
router.use(authenticate);
router.use(authorize(2, 3)); // Principal (2) and Teacher (3) are allowed

router.get(
  '/:studentId/attendance-history',
  studentValidation.validateGetAttendanceHistory,
  studentController.getAttendanceHistory
);

router.get(
  '/:studentId/medications/today',
  studentValidation.validateGetMedicationsToday,
  studentController.getMedicationsToday
);

router.patch(
  '/:studentId',
  studentValidation.validateUpdateStudent,
  studentController.updateStudent
);

export default router;
