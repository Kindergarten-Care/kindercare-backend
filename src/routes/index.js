import express from 'express';
import studentRoute from '../modules/student/student.route.js';
import invoiceRoute from '../modules/invoice/invoice.route.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/student',
    route: studentRoute,
  },
  {
    path: '/invoice',
    route: invoiceRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
