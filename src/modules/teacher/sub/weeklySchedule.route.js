import express from 'express';
import multer from 'multer';
import * as weeklyScheduleController from './weeklySchedule.controller.js';
import {
  validateClassIdParam,
  validateGetMonthlySchedule,
  validateUpsertMonthlySchedule,
  validateGetWeeklySchedule,
  validateSaveWeeklySchedule,
  validateDeleteWeeklySchedule,
  validatePreviewCSV,
  validateImportCSV,
} from './weeklySchedule.validation.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ── Helpers (Month metadata) ───────────────────────────────────────────────────

// GET /teacher/classes/:classId/monthly-schedule/weeks/:year/:month
router.get(
  '/classes/:classId/monthly-schedule/weeks/:year/:month',
  validateClassIdParam,
  weeklyScheduleController.getWeeksInMonth
);

// ── MonthlySchedule (MS) ──────────────────────────────────────────────────────

// GET full monthly schedule with all weeks + details
router.get(
  '/classes/:classId/monthly-schedule/:year/:month',
  validateGetMonthlySchedule,
  weeklyScheduleController.getMonthlySchedule
);

// POST upsert monthly schedule
router.post(
  '/classes/:classId/monthly-schedule',
  validateClassIdParam,
  validateUpsertMonthlySchedule,
  weeklyScheduleController.upsertMonthlySchedule
);

// ── WeeklySchedule (WS) ───────────────────────────────────────────────────────

// POST upsert weekly schedule + details (replace mode)
router.post(
  '/classes/:classId/weekly-schedule',
  validateClassIdParam,
  validateSaveWeeklySchedule,
  weeklyScheduleController.saveWeeklySchedule
);

// GET single weekly schedule by ID
router.get(
  '/classes/:classId/weekly-schedule/:wsId',
  validateGetWeeklySchedule,
  weeklyScheduleController.getWeeklyScheduleById
);

// DELETE weekly schedule (cascade)
router.delete(
  '/classes/:classId/weekly-schedule/:wsId',
  validateDeleteWeeklySchedule,
  weeklyScheduleController.deleteWeeklySchedule
);

// ── CSV (preview + import) ────────────────────────────────────────────────────

// POST preview CSV (parse without saving)
router.post(
  '/classes/:classId/weekly-schedule/preview-csv',
  validateClassIdParam,
  upload.single('file'),
  validatePreviewCSV,
  weeklyScheduleController.previewCSV
);

// POST import CSV → writes WS/WSD per week
router.post(
  '/classes/:classId/weekly-schedule/import-csv',
  validateClassIdParam,
  upload.single('file'),
  validateImportCSV,
  weeklyScheduleController.importCSV
);

export default router;