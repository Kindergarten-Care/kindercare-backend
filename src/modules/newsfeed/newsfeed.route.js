import express from 'express';
import {
  getNewsfeedsByClass,
  createNewsfeed,
  deleteNewsfeed,
} from './newsfeed.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/classes/:classId/newsfeeds', authenticate, getNewsfeedsByClass);
router.post('/classes/:classId/newsfeeds', authenticate, createNewsfeed);
router.delete('/newsfeeds/:postId', authenticate, deleteNewsfeed);

export default router;
