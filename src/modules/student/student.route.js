import express from 'express';
import * as studentController from './student.controller.js';

const router = express.Router();

router.get('/', studentController.getAllStudents);

export default router;
