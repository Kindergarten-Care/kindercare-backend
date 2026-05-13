import express from 'express';

const router = express.Router();

/**
 * Register your module routes here
 * Example:
 * import userRoute from '../modules/user/user.route.js';
 * router.use('/user', userRoute);
 */
const defaultRoutes = [
  // Add your real modules here
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
