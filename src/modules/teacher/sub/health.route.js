import express from 'express';
import * as healthController from './health.controller.js';
import * as healthValidation from './health.validation.js';

const router = express.Router();

// -----------------------------------------------------------------------------
// Allergies
// -----------------------------------------------------------------------------
router.get(
  '/classes/:classId/student-health/allergies',
  healthValidation.validateClassIdParam,
  healthController.listClassAllergies
);

router.post(
  '/classes/:classId/student-health/allergies',
  healthValidation.validateClassIdParam,
  healthValidation.validateCreateAllergy,
  healthController.createClassAllergy
);

router.patch(
  '/classes/:classId/student-health/allergies/item/:allergyId',
  healthValidation.validateClassIdParam,
  healthValidation.validateAllergyIdParam,
  healthValidation.validateUpdateAllergy,
  healthController.updateClassAllergy
);

router.delete(
  '/classes/:classId/student-health/allergies/item/:allergyId',
  healthValidation.validateClassIdParam,
  healthValidation.validateAllergyIdParam,
  healthController.deleteClassAllergy
);

// -----------------------------------------------------------------------------
// Medications
// -----------------------------------------------------------------------------
router.get(
  '/classes/:classId/student-health/medications',
  healthValidation.validateClassIdParam,
  healthController.listClassMedications
);

router.post(
  '/classes/:classId/student-health/medications',
  healthValidation.validateClassIdParam,
  healthValidation.validateCreateMedication,
  healthController.createClassMedication
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
  healthController.deleteClassMedication
);

// -----------------------------------------------------------------------------
// Health Records  (mapped to /logs endpoint for FE consistency)
// -----------------------------------------------------------------------------
router.get(
  '/classes/:classId/student-health/logs',
  healthValidation.validateClassIdParam,
  healthController.listClassHealthRecords
);

router.put(
  '/classes/:classId/student-health/logs',
  healthValidation.validateClassIdParam,
  healthController.batchUpdateClassHealthRecords
);

router.post(
  '/classes/:classId/student-health/logs',
  healthValidation.validateClassIdParam,
  healthController.createClassHealthLog
);

router.patch(
  '/classes/:classId/student-health/logs/item/:logId',
  healthValidation.validateClassIdParam,
  healthValidation.validateLogIdParam,
  healthController.updateClassHealthLog
);

router.delete(
  '/classes/:classId/student-health/logs/item/:logId',
  healthValidation.validateClassIdParam,
  healthValidation.validateLogIdParam,
  healthController.deleteClassHealthLog
);

// -----------------------------------------------------------------------------
// Development Assessments
// -----------------------------------------------------------------------------
router.get(
  '/classes/:classId/student-health/assessments',
  healthValidation.validateClassIdParam,
  healthController.listDevelopmentAssessments
);

router.put(
  '/classes/:classId/student-health/assessments',
  healthValidation.validateClassIdParam,
  healthValidation.validateDevelopmentAssessmentBatch,
  healthController.upsertClassDevelopmentAssessments
);

export default router;
