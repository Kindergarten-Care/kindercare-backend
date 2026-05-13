import express from 'express';
import studentRoute from '../modules/student/student.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/student',
    route: studentRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
