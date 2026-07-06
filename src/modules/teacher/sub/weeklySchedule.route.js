import express from 'express';
import multer from 'multer';
import * as weeklyScheduleController from './weeklySchedule.controller.js';
import * as weeklyScheduleValidation from './weeklySchedule.validation.js';

const router = express.Router();

// Configure multer for file uploads (memory storage for CSV processing)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get weekly schedule templates for a class and month
router.get(
  '/classes/:classId/weekly-schedule/:year/:month',
  weeklyScheduleValidation.validateGetTemplates,
  weeklyScheduleController.getWeeklyScheduleTemplates
);

// Get single template by ID
router.get(
  '/classes/:classId/weekly-schedule/template/:templateId',
  weeklyScheduleValidation.validateTemplateId,
  weeklyScheduleController.getTemplateById
);

// Create or update weekly schedule template
router.post(
  '/classes/:classId/weekly-schedule/template',
  weeklyScheduleValidation.validateUpsertTemplate,
  weeklyScheduleController.upsertTemplate
);

// Preview CSV file (parse without saving)
router.post(
  '/classes/:classId/weekly-schedule/preview-csv',
  upload.single('file'),
  weeklyScheduleValidation.validatePreviewCSV,
  weeklyScheduleController.previewCSV
);

// Import from CSV
router.post(
  '/classes/:classId/weekly-schedule/import',
  upload.single('file'),
  weeklyScheduleValidation.validateImportCSV,
  weeklyScheduleController.importFromCSV
);

// Submit template for approval
router.post(
  '/classes/:classId/weekly-schedule/template/:templateId/submit',
  weeklyScheduleValidation.validateTemplateId,
  weeklyScheduleController.submitForApproval
);

// Withdraw submitted template
router.post(
  '/classes/:classId/weekly-schedule/template/:templateId/withdraw',
  weeklyScheduleValidation.validateTemplateId,
  weeklyScheduleController.withdrawTemplate
);

// Delete template
router.delete(
  '/classes/:classId/weekly-schedule/template/:templateId',
  weeklyScheduleValidation.validateTemplateId,
  weeklyScheduleController.deleteTemplate
);

export default router;
