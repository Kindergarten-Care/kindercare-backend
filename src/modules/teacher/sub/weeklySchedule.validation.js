import Joi from 'joi';
import httpStatus from 'http-status';
import ApiError from '../../../utils/ApiError.js';
import pool from '../../../config/db.js';

const VALID_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
export { VALID_WEEKDAYS };

const weeklyScheduleItemSchema = Joi.object({
  dayOfWeek: Joi.string().valid(...VALID_WEEKDAYS).required(),
  startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).required(),
  endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)(:([0-5]\d))?$/).required(),
  activityName: Joi.string().max(150).required(),
  activityType: Joi.string().valid('pickup', 'meal', 'study', 'nap', 'play', 'dropoff', 'other').default('other'),
  details: Joi.string().allow('', null).optional(),
  location: Joi.string().max(100).allow('', null).optional(),
  orderIndex: Joi.number().integer().min(0).optional()
});

export const validateUpsertTemplate = (req, res, next) => {
  const schema = Joi.object({
    yearId: Joi.number().integer().positive().required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2020).max(2100).required(),
    weekNumber: Joi.number().integer().min(1).max(5).required(),
    weekTheme: Joi.string().max(200).allow('', null).optional(),
    weekStartDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow('', null).optional(),
    weekEndDate: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).allow('', null).optional(),
    items: Joi.array().items(weeklyScheduleItemSchema).optional()
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(d => d.message);
    return next(new ApiError(httpStatus.BAD_REQUEST, errors.join('; ')));
  }

  req.body = value;
  next();
};

export const validatePreviewCSV = (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng upload file CSV'));
  }

  const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Chỉ chấp nhận file CSV'));
  }

  next();
};

/**
 * Validate CSV rows for valid weekdays (Mon-Fri only)
 */
export const validateCSVWeekdays = (csvData) => {
  const invalidRows = [];
  for (let i = 0; i < csvData.length; i++) {
    const day = csvData[i].Day || csvData[i].dayOfWeek;
    if (!VALID_WEEKDAYS.includes(day)) {
      invalidRows.push({
        row: i + 2,
        day: day,
        week: csvData[i].Week
      });
    }
  }
  return invalidRows;
};

export const validateImportCSV = (req, res, next) => {
  if (!req.file) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Vui lòng upload file CSV'));
  }

  const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
  if (!allowedMimeTypes.includes(req.file.mimetype)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'Chỉ chấp nhận file CSV'));
  }

  const schema = Joi.object({
    yearId: Joi.number().integer().positive().required(),
    month: Joi.number().integer().min(1).max(12).required(),
    year: Joi.number().integer().min(2020).max(2100).required()
  });

  const { error, value } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(d => d.message);
    return next(new ApiError(httpStatus.BAD_REQUEST, errors.join('; ')));
  }

  req.body = value;
  next();
};

export const validateGetTemplates = (req, res, next) => {
  const { classId, year, month } = req.params;

  if (isNaN(parseInt(classId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'classId phải là số'));
  }

  if (isNaN(parseInt(year))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'year phải là số'));
  }

  const m = parseInt(month);
  if (isNaN(m) || m < 1 || m > 12) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'month phải từ 1-12'));
  }

  next();
};

export const validateTemplateId = (req, res, next) => {
  const { templateId } = req.params;

  if (isNaN(parseInt(templateId))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'templateId phải là số'));
  }

  next();
};
