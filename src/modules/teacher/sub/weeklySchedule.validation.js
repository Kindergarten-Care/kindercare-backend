import Joi from 'joi';
import httpStatus from 'http-status';
import ApiError from '../../../utils/ApiError.js';

const VALID_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const VALID_ACTIVITY_TYPES = ['pickup', 'meal', 'study', 'nap', 'play', 'dropoff', 'other'];
export { VALID_WEEKDAYS, VALID_ACTIVITY_TYPES };

const weeklyScheduleItemSchema = Joi.object({
  dayOfWeek: Joi.string().valid(...VALID_WEEKDAYS).required(),
  startTime: Joi.string().pattern(/^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/).required()
    .messages({ 'string.pattern.base': 'startTime phải đúng định dạng HH:mm' }),
  endTime: Joi.string().pattern(/^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/).required()
    .messages({ 'string.pattern.base': 'endTime phải đúng định dạng HH:mm' }),
  activityName: Joi.string().max(255).required(),
  activityType: Joi.string().valid(...VALID_ACTIVITY_TYPES).default('other'),
  details: Joi.string().allow('', null).optional(),
  location: Joi.string().max(100).allow('', null).optional(),
}).custom((value, helpers) => {
  const { startTime, endTime } = value;
  if (startTime && endTime) {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startVal = startH * 60 + startM;
    const endVal = endH * 60 + endM;
    if (endVal <= startVal) {
      return helpers.message('Thời gian kết thúc (endTime) phải lớn hơn thời gian bắt đầu (startTime)');
    }
  }
  return value;
});

const ALLOWED_CSV_MIME = ['text/csv', 'application/vnd.ms-excel', 'text/plain', 'application/octet-stream'];

const formatError = (error) => {
  if (!error) return null;
  return error.details.map((d) => d.message).join('; ');
};

const parsePositiveInt = (raw, name) => {
  const v = parseInt(raw, 10);
  if (isNaN(v)) {
    throw new ApiError(httpStatus.BAD_REQUEST, `${name} phải là số`);
  }
  return v;
};

export const validateClassIdParam = (req, res, next) => {
  try {
    parsePositiveInt(req.params.classId, 'classId');
    next();
  } catch (err) {
    next(err);
  }
};

export const validateGetMonthlySchedule = (req, res, next) => {
  try {
    parsePositiveInt(req.params.classId, 'classId');
    const y = parsePositiveInt(req.params.year, 'year');
    const m = parsePositiveInt(req.params.month, 'month');
    if (m < 1 || m > 12) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'month phải từ 1-12');
    }
    if (y < 2020 || y > 2100) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'year không hợp lệ');
    }
    next();
  } catch (err) {
    next(err);
  }
};

export const validateUpsertMonthlySchedule = (req, res, next) => {
  const schema = Joi.object({
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2020).max(2100).required(),
    monthTheme: Joi.string().max(255).required(),
  });
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return next(new ApiError(httpStatus.BAD_REQUEST, formatError(error)));
  req.body = value;
  next();
};

export const validateGetWeeklySchedule = (req, res, next) => {
  try {
    parsePositiveInt(req.params.classId, 'classId');
    parsePositiveInt(req.params.wsId, 'wsId');
    next();
  } catch (err) {
    next(err);
  }
};

export const validateSaveWeeklySchedule = (req, res, next) => {
  const schema = Joi.object({
    monthlyScheduleId: Joi.number().integer().positive().required(),
    weekOrder: Joi.number().integer().min(1).max(5).required(),
    weekTheme: Joi.string().max(255).allow('').required(),
    items: Joi.array().items(weeklyScheduleItemSchema).default([]),
  });
  const { error, value } = schema.validate(req.body, { abortEarly: false });
  if (error) return next(new ApiError(httpStatus.BAD_REQUEST, formatError(error)));
  req.body = value;
  next();
};

export const validateDeleteWeeklySchedule = (req, res, next) => {
  try {
    parsePositiveInt(req.params.classId, 'classId');
    parsePositiveInt(req.params.wsId, 'wsId');
    next();
  } catch (err) {
    next(err);
  }
};

const validateCsvUpload = (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng upload file CSV'));
  }
  if (!ALLOWED_CSV_MIME.includes(req.file.mimetype)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Chỉ chấp nhận file CSV'));
  }
  next();
};

export const validatePreviewCSV = [
  validateCsvUpload,
];

export const validateImportCSV = [
  validateCsvUpload,
  (req, res, next) => {
    const schema = Joi.object({
      monthlyScheduleId: Joi.number().integer().positive().required(),
    });
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) return next(new ApiError(httpStatus.BAD_REQUEST, formatError(error)));
    req.body = value;
    next();
  },
];