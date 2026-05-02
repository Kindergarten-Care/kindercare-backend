# KinderCare Backend - Ultimate MVC Coding Standards

This document defines the high-level architecture and coding standards for the KinderCare Backend project.

## 1. Directory Structure (MVC)
The project is organized into logical layers to ensure scalability and maintainability:

- `src/config/`: Environment and third-party service configurations.
- `src/models/`: Direct database interactions (SQL queries).
- `src/controllers/`: Business logic and HTTP response management.
- `src/routes/`: API endpoint definitions and routing logic.
- `src/middlewares/`: Global or route-specific middlewares (Auth, Logging).
- `src/utils/`: Shared utility classes and constants.
- `src/app.js`: Application configuration and server entry point.

## 2. File Naming Convention
Use `camelCase` with a suffix to identify the file's role:
- **Routes**: `[module].route.js`
- **Controllers**: `[module].controller.js`
- **Models**: `[module].model.js`

## 3. Centralized Routing
All routes must be registered in `src/routes/index.js` and then imported into `app.js` using a single `app.use('/api', routes)` call.

## 4. Professional Response Standard
Always use the `ApiResponse` class for consistent JSON responses:
```javascript
const ApiResponse = require('../utils/ApiResponse');
res.status(200).json(new ApiResponse(200, data, 'Success message'));
```

## 5. Constant Management
Do NOT use "Magic Numbers" for HTTP status codes. Use the `httpStatus` constant from `src/utils/constants.js`:
```javascript
const { httpStatus } = require('../utils/constants');
res.status(httpStatus.OK)...
```

## 6. Module System
- Use **CommonJS** (`require` and `module.exports`).
- Follow the asynchronous pattern using `async/await`.
- Wrap database operations in `try-catch` blocks within the Controller layer.

## 7. Security Best Practices
- Never hardcode credentials. Use `.env`.
- Use parameterized queries (`?`) in Models to prevent SQL Injection.
- Ensure `helmet` and `cors` are active in `app.js`.
