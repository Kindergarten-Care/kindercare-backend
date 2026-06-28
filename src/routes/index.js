import express from 'express';
import authRoute from '../modules/auth/auth.route.js';
import userRoute from '../modules/user/user.route.js';
import parentRoute from '../modules/parent/parent.route.js';
import teacherRoute from '../modules/teacher/teacher.route.js';

const router = express.Router();

const defaultRoutes = [
    { path: '/auth', route: authRoute },
    { path: '/users', route: userRoute },
    { path: '/parent', route: parentRoute },
    { path: '/teacher', route: teacherRoute },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
