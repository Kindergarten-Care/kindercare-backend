import express from 'express';
import authRoute from '../modules/auth/auth.route.js';

const router = express.Router();

const defaultRoutes = [
    { path: '/auth', route: authRoute },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;
