import express from 'express';
import multer from 'multer';
import * as weeklyScheduleController from './weeklySchedule.controller.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// ── Monthly Schedule ──────────────────────────────────────────────────────────

// GET full monthly schedule with all weeks + details
router.get(
  '/classes/:classId/monthly-schedule/:year/:month',
  weeklyScheduleController.getMonthlySchedule
);

// POST upsert monthly schedule
router.post(
  '/classes/:classId/monthly-schedule',
  weeklyScheduleController.upsertMonthlySchedule
);

// ── Weekly Schedule ──────────────────────────────────────────────────────────

// GET single weekly schedule by ID
router.get(
  '/classes/:classId/weekly-schedule/:wsId',
  weeklyScheduleController.getWeeklyScheduleById
);

// POST upsert weekly schedule + details
router.post(
  '/classes/:classId/weekly-schedule',
  weeklyScheduleController.saveWeeklySchedule
);

// DELETE weekly schedule (cascade)
router.delete(
  '/classes/:classId/weekly-schedule/:wsId',
  weeklyScheduleController.deleteWeeklySchedule
);

// POST submit weekly schedule for approval
router.post(
  '/classes/:classId/weekly-schedule/:wsId/submit',
  weeklyScheduleController.submitForApproval
);

// POST withdraw submitted weekly schedule
router.post(
  '/classes/:classId/weekly-schedule/:wsId/withdraw',
  weeklyScheduleController.withdrawTemplate
);

// POST preview CSV (parse without saving)
router.post(
  '/classes/:classId/weekly-schedule/:wsId/preview-csv',
  upload.single('file'),
  weeklyScheduleController.previewCSV
);

// POST import CSV
router.post(
  '/classes/:classId/weekly-schedule/:wsId/import-csv',
  upload.single('file'),
  weeklyScheduleController.importCSV
);

export default router;
