import Joi from 'joi';
import httpStatus from 'http-status';
import ApiError from '../../../utils/ApiError.js';

const SEVERITY_VALUES = ['Mild', 'Moderate', 'Severe'];
const LOG_SEVERITY_VALUES = ['Normal', 'Mild', 'Moderate', 'Severe'];
const LOG_TYPE_VALUES = ['Temperature', 'Incident', 'Observation', 'Mood', 'Meal', 'Nap'];
const MED_STATUS_VALUES = ['Pending', 'Done', 'Skipped'];

const TERM_PERIOD_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

const bmiMeasurementSchema = Joi.object({
  studentId: Joi.number().integer().positive().required(),
  termPeriod: Joi.string().trim().pattern(TERM_PERIOD_REGEX)
    .messages({ 'string.pattern.base': 'termPeriod phải có định dạng YYYY-MM (VD: 2026-07)' })
    .optional(),
  height: Joi.number().min(50).max(200).required()
    .messages({ 'number.min': 'height phải ≥ 50cm', 'number.max': 'height phải ≤ 200cm' }),
  weight: Joi.number().min(5).max(150).required()
    .messages({ 'number.min': 'weight phải ≥ 5kg', 'number.max': 'weight phải ≤ 150kg' }),
  notes: Joi.string().trim().max(1000).allow('', null).optional(),
  measuredAt: Joi.number().integer().positive().optional()
    .messages({ 'number.integer': 'measuredAt phải là epoch seconds' }),
  bmi: Joi.number().min(5).max(60).optional()
    .messages({ 'number.min': 'BMI không hợp lệ', 'number.max': 'BMI không hợp lệ' })
});

const bmiBatchItemSchema = bmiMeasurementSchema;

const bmiBatchSchema = Joi.object({
  termPeriod: Joi.string().trim().pattern(TERM_PERIOD_REGEX).required()
    .messages({ 'string.pattern.base': 'termPeriod phải có định dạng YYYY-MM' }),
  records: Joi.array().items(bmiBatchItemSchema).min(1).required()
    .messages({ 'array.min': 'records phải có ít nhất 1 phần tử' })
});

const bmiUpdateSchema = Joi.object({
  height: Joi.number().min(50).max(200).optional(),
  weight: Joi.number().min(5).max(150).optional(),
  notes: Joi.string().trim().max(1000).allow('', null).optional()
}).min(1).messages({ 'object.min': 'Cần ít nhất 1 trường để cập nhật' });

const allergyBodySchema = Joi.object({
  allergen: Joi.string().trim().min(1).max(150).required(),
  severity: Joi.string().valid(...SEVERITY_VALUES).default('Mild'),
  reaction: Joi.string().trim().max(255).allow('', null).optional(),
  notes: Joi.string().trim().allow('', null).optional()
});

const allergyUpdateSchema = Joi.object({
  allergen: Joi.string().trim().min(1).max(150).optional(),
  severity: Joi.string().valid(...SEVERITY_VALUES).optional(),
  reaction: Joi.string().trim().max(255).allow('', null).optional(),
  notes: Joi.string().trim().allow('', null).optional()
}).min(1);

const medicationBodySchema = Joi.object({
  medicineName: Joi.string().trim().min(1).max(150).required(),
  dosage: Joi.string().trim().min(1).max(100).required(),
  scheduledTime: Joi.string().trim().max(50).allow('', null).optional(),
  frequency: Joi.string().trim().max(100).allow('', null).optional(),
  status: Joi.string().valid(...MED_STATUS_VALUES).default('Pending'),
  medRequestId: Joi.number().integer().positive().optional(),
  notes: Joi.string().trim().allow('', null).optional()
});

const medicationStatusSchema = Joi.object({
  status: Joi.string().valid(...MED_STATUS_VALUES).required(),
  notes: Joi.string().trim().allow('', null).optional()
});

const healthLogBodySchema = Joi.object({
  logType: Joi.string().valid(...LOG_TYPE_VALUES).required(),
  value: Joi.string().trim().max(100).allow('', null).optional(),
  description: Joi.string().trim().allow('', null).optional(),
  severity: Joi.string().valid(...LOG_SEVERITY_VALUES).default('Normal'),
  actionTaken: Joi.string().trim().allow('', null).optional(),
  loggedAt: Joi.number().integer().positive().optional()
});

const healthLogUpdateSchema = Joi.object({
  logType: Joi.string().valid(...LOG_TYPE_VALUES).optional(),
  value: Joi.string().trim().max(100).allow('', null).optional(),
  description: Joi.string().trim().allow('', null).optional(),
  severity: Joi.string().valid(...LOG_SEVERITY_VALUES).optional(),
  actionTaken: Joi.string().trim().allow('', null).optional(),
  loggedAt: Joi.number().integer().positive().optional()
}).min(1);

const developmentAssessmentItemSchema = Joi.object({
  studentId: Joi.number().integer().positive().required(),
  physicalScore: Joi.number().integer().min(1).max(10).allow(null).optional(),
  emotionalScore: Joi.number().integer().min(1).max(10).allow(null).optional(),
  socialScore: Joi.number().integer().min(1).max(10).allow(null).optional(),
  languageScore: Joi.number().integer().min(1).max(10).allow(null).optional(),
  cognitiveScore: Joi.number().integer().min(1).max(10).allow(null).optional(),
  overallNote: Joi.string().trim().allow('', null).max(500).optional()
}).unknown(true);

const developmentAssessmentBodySchema = Joi.object({
  termPeriod: Joi.string().trim().pattern(/^\d{4}-\d{2}$/).optional(),
  items: Joi.array().items(developmentAssessmentItemSchema).min(1).required()
});

const validateNumericId = (name) => (req, _res, next) => {
  const raw = req.params[name];
  if (raw === undefined || isNaN(parseInt(raw))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, `${name} phải là số`));
  }
  return next();
};

export const validateClassIdParam = validateNumericId('classId');
export const validateStudentIdParam = validateNumericId('studentId');
export const validateAllergyIdParam = validateNumericId('allergyId');
export const validateMedicationIdParam = validateNumericId('medicationId');
export const validateLogIdParam = validateNumericId('logId');

export const validateCreateAllergy = (req, _res, next) => {
  const { error, value } = allergyBodySchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.body = value;
  next();
};

export const validateUpdateAllergy = (req, _res, next) => {
  const { error, value } = allergyUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.body = value;
  next();
};

export const validateCreateMedication = (req, _res, next) => {
  const { error, value } = medicationBodySchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.body = value;
  next();
};

export const validateUpdateMedicationStatus = (req, _res, next) => {
  const { error, value } = medicationStatusSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.body = value;
  next();
};

export const validateCreateHealthLog = (req, _res, next) => {
  const { error, value } = healthLogBodySchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.body = value;
  next();
};

export const validateUpdateHealthLog = (req, _res, next) => {
  const { error, value } = healthLogUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.body = value;
  next();
};

export const validateDevelopmentAssessmentBatch = (req, _res, next) => {
  const { error, value } = developmentAssessmentBodySchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.body = value;
  next();
};

export const validateDevelopmentAssessmentHistory = (req, _res, next) => {
  const { studentId, monthsBack } = req.query;

  if (!studentId || isNaN(parseInt(studentId, 10)) || parseInt(studentId, 10) <= 0) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'studentId phải là số nguyên dương'));
  }

  if (monthsBack !== undefined) {
    const mb = parseInt(monthsBack, 10);
    if (isNaN(mb) || mb < 1 || mb > 12) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'monthsBack phải là số từ 1 đến 12'));
    }
  }

  next();
};

export const validateCreateBmiLog = (req, _res, next) => {
  const raw = req.body;

  if (raw.termPeriod !== undefined) {
    if (typeof raw.termPeriod !== 'string') {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'termPeriod phải là chuỗi định dạng YYYY-MM (VD: 2026-07)'));
    }
    if (!TERM_PERIOD_REGEX.test(raw.termPeriod.trim())) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'termPeriod phải có định dạng YYYY-MM (VD: 2026-07)'));
    }
    req.body = { ...raw, termPeriod: raw.termPeriod.trim() };
  }

  if (raw.studentId !== undefined) {
    const parsed = parseInt(raw.studentId, 10);
    if (isNaN(parsed) || parsed <= 0) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'studentId phải là số nguyên dương'));
    }
    req.body = { ...req.body, studentId: parsed };
  }

  if (raw.height !== undefined) {
    const parsed = parseFloat(raw.height);
    if (isNaN(parsed) || parsed < 50 || parsed > 200) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'height phải là số từ 50-200 (cm)'));
    }
    req.body = { ...req.body, height: parsed };
  }

  if (raw.weight !== undefined) {
    const parsed = parseFloat(raw.weight);
    if (isNaN(parsed) || parsed < 5 || parsed > 150) {
      return next(new ApiError(httpStatus.BAD_REQUEST, 'weight phải là số từ 5-150 (kg)'));
    }
    req.body = { ...req.body, weight: parsed };
  }

  const { error, value } = bmiMeasurementSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.body = value;
  next();
};

export const validateBatchUpsertBmi = (req, _res, next) => {
  const { error, value } = bmiBatchSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.body = value;
  next();
};

export const validateUpdateBmiLog = (req, _res, next) => {
  const { error, value } = bmiUpdateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const details = error.details.map((d) => d.message).join('; ');
    return next(new ApiError(httpStatus.BAD_REQUEST, details));
  }
  req.body = value;
  next();
};

export const validateBmiQuery = (req, _res, next) => {
  const { termPeriod, studentId, includeOverwritten } = req.query;
  if (termPeriod !== undefined && !TERM_PERIOD_REGEX.test(String(termPeriod))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'termPeriod phải có định dạng YYYY-MM'));
  }
  if (studentId !== undefined && (isNaN(parseInt(studentId)) || parseInt(studentId) <= 0)) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'studentId phải là số nguyên dương'));
  }
  if (includeOverwritten !== undefined && !['true', 'false', '1', '0'].includes(String(includeOverwritten))) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'includeOverwritten chỉ chấp nhận true/false'));
  }
  if (includeOverwritten !== undefined) {
    req.query.includeOverwritten = String(includeOverwritten) === 'true' || String(includeOverwritten) === '1';
  }
  next();
};

export {
  SEVERITY_VALUES,
  LOG_SEVERITY_VALUES,
  LOG_TYPE_VALUES,
  MED_STATUS_VALUES,
  bmiMeasurementSchema,
  bmiBatchSchema,
  bmiUpdateSchema
};