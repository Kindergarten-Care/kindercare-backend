import Joi from 'joi';
import httpStatus from 'http-status';
import ApiError from '../../utils/ApiError.js';

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

const getAttendanceHistorySchema = Joi.object({
  studentId: Joi.number().integer().positive().required(),
  month: Joi.string().pattern(MONTH_REGEX).required()
    .messages({ 'string.pattern.base': 'Tháng phải có định dạng YYYY-MM (VD: 2026-07)' })
});

const getMedicationsTodaySchema = Joi.object({
  studentId: Joi.number().integer().positive().required()
});

const updateStudentSchema = Joi.object({
  studentId: Joi.number().integer().positive().required(),
  nickname: Joi.string().trim().max(50).allow('', null).optional(),
  team: Joi.string().trim().max(50).allow('', null).optional()
}).min(2); // studentId is required, so at least one update field (making min 2 properties)

export const validateGetAttendanceHistory = (req, res, next) => {
  const data = {
    studentId: Number(req.params.studentId),
    month: req.query.month
  };

  const { error, value } = getAttendanceHistorySchema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.params.studentId = value.studentId;
  req.query.month = value.month;
  next();
};

export const validateGetMedicationsToday = (req, res, next) => {
  const data = {
    studentId: Number(req.params.studentId)
  };

  const { error, value } = getMedicationsTodaySchema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.params.studentId = value.studentId;
  next();
};

export const validateUpdateStudent = (req, res, next) => {
  const data = {
    studentId: Number(req.params.studentId),
    ...req.body
  };

  const { error, value } = updateStudentSchema.validate(data, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.params.studentId = value.studentId;
  // Exclude studentId from req.body changes
  const { studentId, ...updateBody } = value;
  req.body = updateBody;
  next();
};
