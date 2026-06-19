import express from 'express';
import parentController from './parent.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Get children of the logged-in parent
router.get('/children', authenticate, authorize(4), parentController.getMyChildren);

// Get profile of the logged-in parent
router.get('/profile', authenticate, authorize(4), parentController.getMyProfile);

// Get health records of a child
router.get('/children/:studentId/health-records', authenticate, authorize(4), parentController.getChildHealthRecords);

export default router;

