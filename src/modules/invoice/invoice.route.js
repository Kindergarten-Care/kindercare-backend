import express from 'express';
import * as invoiceController from './invoice.controller.js';

const router = express.Router();

router.get('/student/:studentId', invoiceController.getStudentInvoices);

export default router;
