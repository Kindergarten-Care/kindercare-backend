import httpStatus from 'http-status';
import * as invoiceService from './invoice.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';

export const getStudentInvoices = async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Student ID is required');
  }

  const data = await invoiceService.getInvoiceByStudentId(studentId);
  
  res.status(httpStatus.OK).send(
    new ApiResponse(httpStatus.OK, data, 'Student invoices fetched successfully')
  );
};
