import * as billingService from './billing.service.js';
import ApiResponse from '../../utils/ApiResponse.js';
import ApiError from '../../utils/ApiError.js';
import httpStatus from 'http-status';

const registerTuitionPlan = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { packageId, startMonth } = req.body;
    const studentIdVal = parseInt(studentId, 10);

    if (!packageId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng cung cấp packageId');
    }

    const result = await billingService.registerTuitionPlan(studentIdVal, packageId, startMonth);

    res.status(httpStatus.CREATED).json(
      new ApiResponse(httpStatus.CREATED, result, 'Đăng ký gói học phí thành công')
    );
  } catch (error) {
    next(error);
  }
};

const runMonthlyBilling = async (req, res, next) => {
  try {
    const { billingMonth } = req.body;

    const result = await billingService.runMonthlyBilling(billingMonth);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, result, 'Chạy hóa đơn hàng tháng thành công')
    );
  } catch (error) {
    next(error);
  }
};

const addSurcharge = async (req, res, next) => {
  try {
    const { invoiceId } = req.params;
    const { amount, note } = req.body;
    const invoiceIdVal = parseInt(invoiceId, 10);

    if (amount === undefined || amount === null) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng cung cấp amount');
    }

    const invoice = await billingService.addSurcharge(invoiceIdVal, amount, note);

    res.status(httpStatus.OK).json(
      new ApiResponse(httpStatus.OK, { invoice }, 'Thêm phụ thu thành công')
    );
  } catch (error) {
    next(error);
  }
};

export default {
  registerTuitionPlan,
  runMonthlyBilling,
  addSurcharge,
};
