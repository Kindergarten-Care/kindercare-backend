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

// Get schedule reminder
router.get(
  '/classes/:classId/weekly-schedule/reminder/:year/:month',
  weeklyScheduleValidation.validateGetTemplates,
  weeklyScheduleController.getScheduleReminder
);

// Get import lock status
router.get(
  '/classes/:classId/weekly-schedule/import-status/:year/:month',
  weeklyScheduleValidation.validateGetTemplates,
  weeklyScheduleController.getImportStatus
);

// Get import history
router.get(
  '/classes/:classId/weekly-schedule/history/:year/:month',
  weeklyScheduleValidation.validateGetTemplates,
  weeklyScheduleController.getImportHistory
);

// Copy items from one week to another
router.post(
  '/classes/:classId/weekly-schedule/template/:templateId/copy-week',
  weeklyScheduleController.copyWeekItems
);

// Copy items from one day to another
router.post(
  '/classes/:classId/weekly-schedule/template/:templateId/copy-day',
  weeklyScheduleController.copyDayItems
);

export default router;
