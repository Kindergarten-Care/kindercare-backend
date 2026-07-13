import express from 'express';
import authRoute from '../modules/auth/auth.route.js';
import userRoute from '../modules/user/user.route.js';
import parentRoute from '../modules/parent/parent.route.js';
import teacherRoute from '../modules/teacher/teacher.route.js';
import pool from '../config/db.js';
import principalRoute from '../modules/principal/principal.route.js';
import notificationRoute from '../modules/notification/notification.route.js';
import billingRoute from '../modules/billing/billing.route.js';
import newsfeedRoute from '../modules/newsfeed/newsfeed.route.js';
import studentRoute from '../modules/student/student.route.js';

const router = express.Router();

const defaultRoutes = [
    { path: '/auth', route: authRoute },
    { path: '/users', route: userRoute },
    { path: '/parent', route: parentRoute },
    { path: '/teacher', route: teacherRoute },
    { path: '/principal', route: principalRoute },
    { path: '/notifications', route: notificationRoute },
    { path: '/billing', route: billingRoute },
    { path: '/teacher', route: newsfeedRoute },
    { path: '/students', route: studentRoute },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;


