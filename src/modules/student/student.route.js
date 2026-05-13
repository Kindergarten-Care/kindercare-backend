import express from 'express';
import * as studentController from './student.controller.js';

const router = express.Router();

// Endpoint: GET /api/v1/student/all
router.get('/', studentController.getAllStudents);

export default router;
