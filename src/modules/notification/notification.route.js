import express from 'express';
import {
  registerToken,
  getFirebaseConfig,
  getNotifications,
  markAsRead,
  markAllAsRead,
} from './notification.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// FCM token registration
router.post('/register-token', authenticate, registerToken);

// Firebase client config (public)
router.get('/firebase-config', getFirebaseConfig);

// Inbox
router.get('/', authenticate, getNotifications);
router.put('/read-all', authenticate, markAllAsRead);
router.put('/:id/read', authenticate, markAsRead);

export default router;
