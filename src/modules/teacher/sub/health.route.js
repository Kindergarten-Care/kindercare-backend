import express from 'express';
import * as healthController from './health.controller.js';
import * as healthValidation from './health.validation.js';

const router = express.Router();

// -----------------------------------------------------------------------------
// Allergies — /classes/:classId/student-health/allergies/...
// -----------------------------------------------------------------------------
router.get(
  '/classes/:classId/student-health/allergies/:studentId',
  healthValidation.validateClassIdParam,
  healthValidation.validateStudentIdParam,
  healthController.listAllergies
);

router.post(
  '/classes/:classId/student-health/allergies/:studentId',
  healthValidation.validateClassIdParam,
  healthValidation.validateStudentIdParam,
  healthValidation.validateCreateAllergy,
  healthController.createAllergy
);

router.put(
  '/classes/:classId/student-health/allergies/item/:allergyId',
  healthValidation.validateClassIdParam,
  healthValidation.validateAllergyIdParam,
  healthValidation.validateUpdateAllergy,
  healthController.updateAllergy
);

router.delete(
  '/classes/:classId/student-health/allergies/item/:allergyId',
  healthValidation.validateClassIdParam,
  healthValidation.validateAllergyIdParam,
  healthController.deleteAllergy
);

// -----------------------------------------------------------------------------
// Medications — /classes/:classId/student-health/medications/...
// -----------------------------------------------------------------------------
router.get(
  '/classes/:classId/student-health/medications/:studentId',
  healthValidation.validateClassIdParam,
  healthValidation.validateStudentIdParam,
  healthController.listMedications
);

router.post(
  '/classes/:classId/student-health/medications/:studentId',
  healthValidation.validateClassIdParam,
  healthValidation.validateStudentIdParam,
  healthValidation.validateCreateMedication,
  healthController.createMedication
);

router.patch(
  '/classes/:classId/student-health/medications/item/:medicationId/status',
  healthValidation.validateClassIdParam,
  healthValidation.validateMedicationIdParam,
  healthValidation.validateUpdateMedicationStatus,
  healthController.updateMedicationStatus
);

router.delete(
  '/classes/:classId/student-health/medications/item/:medicationId',
  healthValidation.validateClassIdParam,
  healthValidation.validateMedicationIdParam,
  healthController.deleteMedication
);

// -----------------------------------------------------------------------------
// Health Logs — /classes/:classId/student-health/logs/...
// -----------------------------------------------------------------------------
router.get(
  '/classes/:classId/student-health/logs/:studentId',
  healthValidation.validateClassIdParam,
  healthValidation.validateStudentIdParam,
  healthController.listHealthLogs
);

router.post(
  '/classes/:classId/student-health/logs/:studentId',
  healthValidation.validateClassIdParam,
  healthValidation.validateStudentIdParam,
  healthValidation.validateCreateHealthLog,
  healthController.createHealthLog
);

router.patch(
  '/classes/:classId/student-health/logs/item/:logId',
  healthValidation.validateClassIdParam,
  healthValidation.validateLogIdParam,
  healthValidation.validateUpdateHealthLog,
  healthController.updateHealthLog
);

router.delete(
  '/classes/:classId/student-health/logs/item/:logId',
  healthValidation.validateClassIdParam,
  healthValidation.validateLogIdParam,
  healthController.deleteHealthLog
);

export default router;