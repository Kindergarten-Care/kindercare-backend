import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import http from 'http';
import routes from './routes/index.js';
import { errorConverter, errorHandler } from './middlewares/error.middleware.js';
import { serverTimeout } from './middlewares/timeout.middleware.js';
import ApiError from './utils/ApiError.js';
import httpStatus from 'http-status';
import logger from './config/logger.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';
import { initSocket } from './config/socket.js';
import { startMonthlyBillingCron } from './jobs/monthlyBilling.cron.js';
import { startPaymentReminderCron } from './jobs/paymentReminder.cron.js';
import { startExtracurricularExpiryCron } from './jobs/extracurricularExpiry.cron.js';
import { startPaymentReconciliationCron } from './jobs/paymentReconciliation.cron.js';
import './jobs/attendanceCron.js';
import './jobs/leaveRequestAttendanceCron.js';
import './socket.js';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(
  helmet({
    // Cho phép FE gọi cross-origin API mà không bị browser block ở CORP layer.
    crossOriginResourcePolicy: false,
  })
);
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:3005',
    'https://web-test.kindercare.app',
    'https://web.kindercare.app',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(serverTimeout());

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use('/api/v1', routes);

if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
    logger.info(`=============================================`);
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    logger.info(`🔌 Socket.IO is ready on ws://localhost:${PORT}`);
    logger.info(`=============================================`);
});

startMonthlyBillingCron();
startPaymentReminderCron();
startExtracurricularExpiryCron();
startPaymentReconciliationCron();

export default app;
