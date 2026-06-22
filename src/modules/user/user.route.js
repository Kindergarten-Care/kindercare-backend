import express from 'express';
import userController from './user.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/by-role', authenticate, userController.getUsersByRole);

export default router;
