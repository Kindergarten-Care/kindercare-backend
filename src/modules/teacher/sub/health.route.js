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

// -----------------------------------------------------------------------------
// Medications
// -----------------------------------------------------------------------------
router.get(
  '/classes/:classId/student-health/medications',
  healthValidation.validateClassIdParam,
  healthController.listClassMedications
);

router.patch(
  '/classes/:classId/student-health/medications/item/:medicationId/status',
  healthValidation.validateClassIdParam,
  healthValidation.validateMedicationIdParam,
  healthValidation.validateUpdateMedicationStatus,
  healthController.updateMedicationStatus
);

// -----------------------------------------------------------------------------
// Health Records (Mapped to /logs endpoint for easy integration with frontend)
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

export default router;