import express from 'express';
import parentController from './parent.controller.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Get children of the logged-in parent
router.get('/children', authenticate, authorize(4), parentController.getMyChildren);

export default router;
