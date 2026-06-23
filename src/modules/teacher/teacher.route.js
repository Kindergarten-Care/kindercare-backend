import express from 'express';
import teacherController from './teacher.controller.js';
import { authenticate } from '../../middlewares/auth.middleware.js';

const router = express.Router();

const validateClassId = (req, res, next) => {
    const { classId } = req.params;
    const parsedId = Number(classId);

    if (!classId || Number.isNaN(parsedId) || !Number.isInteger(parsedId) || parsedId <= 0) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'classId phải là một số nguyên dương hợp lệ',
            data: null,
        });
    }

    next();
};

router.get('/classes/:classId/students/detailed', authenticate, validateClassId, teacherController.getDetailedStudents);

export default router;
