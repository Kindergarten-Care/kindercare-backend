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
// BMI Measurements (Height/Weight → BE tự tính BMI)
//   GET    /classes/:classId/student-health/bmi              (danh sách BMI theo kỳ)
//   POST   /classes/:classId/student-health/bmi              (tạo 1 bản ghi)
//   PUT    /classes/:classId/student-health/bmi              (batch upsert theo kỳ)
//   PATCH  /classes/:classId/student-health/bmi/item/:logId  (sửa 1 bản ghi)
//   DELETE /classes/:classId/student-health/bmi/item/:logId  (xóa 1 bản ghi)
// -----------------------------------------------------------------------------
router.get(
  '/classes/:classId/student-health/bmi',
  healthValidation.validateClassIdParam,
  healthValidation.validateBmiQuery,
  healthController.listClassBmiLogs
);

router.post(
  '/classes/:classId/student-health/bmi',
  healthValidation.validateClassIdParam,
  healthValidation.validateCreateBmiLog,
  healthController.createBmiLog
);

router.put(
  '/classes/:classId/student-health/bmi',
  healthValidation.validateClassIdParam,
  healthValidation.validateBatchUpsertBmi,
  healthController.batchUpsertBmiLogs
);

router.patch(
  '/classes/:classId/student-health/bmi/item/:logId',
  healthValidation.validateClassIdParam,
  healthValidation.validateLogIdParam,
  healthValidation.validateUpdateBmiLog,
  healthController.updateBmiLog
);

router.delete(
  '/classes/:classId/student-health/bmi/item/:logId',
  healthValidation.validateClassIdParam,
  healthValidation.validateLogIdParam,
  healthController.deleteBmiLog
);

// -----------------------------------------------------------------------------
// Health Records (legacy - alias of BMI routes for backward compatibility)
//   Vẫn map sang BMI service. Đường dẫn /logs được giữ để tương thích FE cũ.
// -----------------------------------------------------------------------------
router.get(
  '/classes/:classId/student-health/logs',
  healthValidation.validateClassIdParam,
  healthValidation.validateBmiQuery,
  healthController.listClassBmiLogs
);

router.put(
  '/classes/:classId/student-health/logs',
  healthValidation.validateClassIdParam,
  healthValidation.validateBatchUpsertBmi,
  healthController.batchUpsertBmiLogs
);

router.post(
  '/classes/:classId/student-health/logs',
  healthValidation.validateClassIdParam,
  healthValidation.validateCreateBmiLog,
  healthController.createBmiLog
);

router.patch(
  '/classes/:classId/student-health/logs/item/:logId',
  healthValidation.validateClassIdParam,
  healthValidation.validateLogIdParam,
  healthValidation.validateUpdateBmiLog,
  healthController.updateBmiLog
);

router.delete(
  '/classes/:classId/student-health/logs/item/:logId',
  healthValidation.validateClassIdParam,
  healthValidation.validateLogIdParam,
  healthController.deleteBmiLog
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
