---
trigger: always_on
---

# KinderCare Backend - Ultimate Coding Standards & Rules

This document defines the high-level architecture and coding standards for the KinderCare Backend project to ensure enterprise-grade quality.

## 1. Directory Structure & Responsibilities

The project follows a **Modular Layered Architecture**. All source code resides in the `src/` directory.

- `src/config/`: Configuration files (Database, Environment variables, Cloud services).
- `src/modules/`: The core of the application. All business logic is grouped here by feature (e.g., `src/modules/user/`).
  - `[module].controller.js`: Handle HTTP requests.
  - `[module].service.js`: Business logic and Database interactions.
  - `[module].route.js`: Module-specific route definitions.
  - `[module].validation.js`: Module-specific request validation.
  - `[module].model.js`: Database schemas for the module.
- `src/routes/`: Global route registry (e.g., `src/routes/index.js`).
- `src/middlewares/`: Shared request filters (Auth, Logging, Global Error Handling).
- `src/utils/`: Shared helper functions (Date formatters, encryption, etc.).

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
- **Async Handling**: We use **Express 5**, which natively handles rejected promises from async route handlers and middleware. You can write `async` functions without `try-catch` blocks; errors will automatically reach the global handler.
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
- **Commenting**:
  - **Avoid Redundant Comments**: Do not comment on obvious things (e.g., `// Send response`).
  - **Logic Focus**: Only add comments for complex business logic, non-obvious calculations, or critical warnings that need attention.
  - **Documentation**: Use JSDoc for functions only when parameters or return types are complex and need clarification.
- **Logging Standards**:
  - **System Events**: Use `logger.info()` from `src/config/logger.js` to log system startup, module initialization, or successful major actions.
  - **Error Logging**: All internal server errors (Status 500+) must be logged using `logger.error(err)` in the global error handler.
  - **Development Logging**: Use `logger.debug()` for information only needed during development.
  - **No Console**: Strictly forbid the use of `console.log`, `console.error`, etc. Everything must go through the centralized `logger`.
- **API Documentation Standards**:
  - **Separate Files**: All Swagger/OpenAPI documentation must be placed in a separate file named `[module].docs.js` within the same module directory.
  - **English Only**: All summaries, descriptions, and tag names in the documentation must be written in **100% English**.
  - **Mandatory for New Endpoints**: Every new endpoint created must have its corresponding documentation updated or created immediately.
  - **Accuracy**: Descriptions must be precise and reflect the actual business logic of the endpoint.
