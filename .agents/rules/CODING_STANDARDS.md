---
trigger: always_on
---

# KinderCare Backend - Ultimate Coding Standards & Rules

This document defines the high-level architecture and coding standards for the KinderCare Backend project to ensure enterprise-grade quality.

## 1. Directory Structure & Responsibilities

The project follows a **Modular Layered Architecture**. All source code resides in the `src/` directory.

- `src/config/`: Configuration files (Database, Environment variables, Cloud services).
- `src/routes/`: Route definitions. Only responsible for mapping URLs to controllers.
- `src/middlewares/`: Request filters (Auth, Logging, Global Error Handling).
- `src/controllers/`: Handle HTTP requests. Responsible for extracting data and sending responses. **No business logic here.**
- `src/services/`: The **Heart** of the application. Contains all business logic, calculations, and Database interactions (Queries).
- `src/models/`: Database schemas or data structure definitions.
- `src/validations/`: Request body/params validation logic (e.g., Joi or Zod schemas).
- `src/utils/`: Generic helper functions (Date formatters, encryption, etc.).

## 2. File Naming Convention
Files should be named using `camelCase` with a suffix indicating their layer:
- **Routes**: `[module].route.js` (e.g., `user.route.js`)
- **Controllers**: `[module].controller.js` (e.g., `user.controller.js`)
- **Services**: `[module].service.js` (e.g., `user.service.js`)
- **Middlewares**: `[purpose].middleware.js` (e.g., `auth.middleware.js`)

## 3. The Professional Request Flow (5-Layer Flow)
Every request must follow this sequence:
1. **Route**: Receives the request.
2. **Middleware**: Validates Token or Input Data (Validation Layer).
3. **Controller**: Calls the necessary Service function.
4. **Service**: Executes business logic and communicates with the Database.
5. **Response**: Controller sends the final result using the `ApiResponse` class.

## 4. Error Handling Standards
- **Never crash the process**: Use `ApiError` for known operational errors.
- **Async Handling**: We use `express-async-errors`, so you can write `async` functions without `try-catch` blocks. The error will automatically reach the global handler.
- **Status Codes**: Always use the `http-status` library constants (e.g., `httpStatus.INTERNAL_SERVER_ERROR`).

## 5. API Response Standard
Every single response must be wrapped in the `ApiResponse` class:
```javascript
res.status(httpStatus.OK).send(new ApiResponse(httpStatus.OK, data, 'Success message'));
```

## 6. Business Logic vs. Controller logic
- **Bad (In Controller):**
  ```javascript
  const users = await pool.query('SELECT * FROM Users WHERE age > 18');
  const processed = users.map(...);
  res.send(processed);
  ```
- **Good (In Service):**
  ```javascript
  // controller.js
  const adultUsers = await userService.getAdultUsers();
  res.status(httpStatus.OK).send(new ApiResponse(httpStatus.OK, adultUsers));

  // service.js
  export const getAdultUsers = async () => {
      const [rows] = await pool.query('SELECT * FROM Users WHERE age > 18');
      return rows.map(...);
  };
  ```

## 7. Security Best Practices
- **Environment**: Secrets must reside in `.env`. Never commit `.env` to Git.
- **Sanitization**: Never use raw strings in SQL queries. Use parameterized queries `(?)` provided by `mysql2` to prevent SQL Injection.
- **Headers**: `helmet` must be enabled to protect the app from web vulnerabilities.

## 8. Code Style
- **ES Modules**: Use `import/export`.
- **Formatting**: Use 2 spaces for indentation.
- **Strictness**: Avoid `any` types or vague variable names.
