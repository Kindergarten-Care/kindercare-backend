import Joi from 'joi';
import httpStatus from 'http-status';
import ApiError from '../../../utils/ApiError.js';

const SEVERITY_VALUES = ['Mild', 'Moderate', 'Severe'];
const LOG_SEVERITY_VALUES = ['Normal', 'Mild', 'Moderate', 'Severe'];
const LOG_TYPE_VALUES = ['Temperature', 'Incident', 'Observation', 'Mood', 'Meal', 'Nap'];
const MED_STATUS_VALUES = ['Pending', 'Done', 'Skipped'];

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
  physicalScore: Joi.number().integer().min(0).max(5).allow(null).optional(),
  emotionalScore: Joi.number().integer().min(0).max(5).allow(null).optional(),
  socialScore: Joi.number().integer().min(0).max(5).allow(null).optional(),
  languageScore: Joi.number().integer().min(0).max(5).allow(null).optional(),
  cognitiveScore: Joi.number().integer().min(0).max(5).allow(null).optional(),
  overallNote: Joi.string().trim().allow('', null).max(1000).optional()
});

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

export {
  SEVERITY_VALUES,
  LOG_SEVERITY_VALUES,
  LOG_TYPE_VALUES,
  MED_STATUS_VALUES
};