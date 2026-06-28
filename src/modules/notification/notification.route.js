import express from 'express';
import { registerToken, getFirebaseConfig } from './notification.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Register/update user's device FCM token
router.post('/register-token', authenticate, registerToken);

// Serve Firebase web configuration properties
router.get('/firebase-config', getFirebaseConfig);

export default router;
