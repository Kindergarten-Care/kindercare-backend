import express from 'express';
import authRoute from '../modules/auth/auth.route.js';
import userRoute from '../modules/user/user.route.js';
import parentRoute from '../modules/parent/parent.route.js';
import teacherRoute from '../modules/teacher/teacher.route.js';
import pool from '../config/db.js';
import notificationRoute from '../modules/notification/notification.route.js';
import billingRoute from '../modules/billing/billing.route.js';

const router = express.Router();

const defaultRoutes = [
    { path: '/auth', route: authRoute },
    { path: '/users', route: userRoute },
    { path: '/parent', route: parentRoute },
    { path: '/teacher', route: teacherRoute },
    { path: '/notifications', route: notificationRoute },
    { path: '/billing', route: billingRoute },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;


