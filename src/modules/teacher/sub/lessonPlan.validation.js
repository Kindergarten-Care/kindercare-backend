import Joi from 'joi';

export const upsertLessonPlan = {
  body: Joi.object().keys({
    // teacherId is intentionally excluded: BE derives it from the JWT token for security
    classId: Joi.number().integer().required(),
    yearId: Joi.number().integer().required(),
    weekNumber: Joi.number().integer().required(),
    year: Joi.number().integer().required(),
    weekStartDate: Joi.number().required(), // seconds
    weekEndDate: Joi.number().required(), // seconds
    weekTheme: Joi.string().allow('', null).optional(),
    monthTheme: Joi.string().allow('', null).optional(),
    weeklyGoal: Joi.string().allow('', null).optional(),
    note: Joi.string().allow('', null).optional(),
    items: Joi.array().items(
      Joi.object().keys({
        dayOfWeek: Joi.string().valid('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday').required(),
        subject: Joi.string().valid('lang', 'math', 'art', 'music', 'world', 'phys', 'other').required(),
        startTime: Joi.string().allow('', null).optional(),
        endTime: Joi.string().allow('', null).optional(),
        title: Joi.string().required(),
        objective: Joi.string().allow('', null).optional(),
        activityDetails: Joi.string().allow('', null).optional(),
        materials: Joi.string().allow('', null).optional(),
        teacherNote: Joi.string().allow('', null).optional(),
        orderIndex: Joi.number().integer().required()
      })
    ).required()
  })
};
