import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import pool from './config/db.js';
import { errorConverter, errorHandler } from './middlewares/error.middleware.js';
import ApiError from './utils/ApiError.js';
import httpStatus from 'http-status';
import logger from './config/logger.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';

dotenv.config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

app.use('/api/v1', routes);

app.get('/', (_req, res) => {
    res.status(httpStatus.OK).json({
        success: true,
        message: 'KinderCare Backend is running. Use /api/v1/teacher/classes/{classId}/students/detailed',
        apiBase: '/api/v1',
    });
});

if (process.env.NODE_ENV !== 'production') {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
}

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

const startServer = async () => {
    try {
        const [rows] = await pool.query('SELECT 1');
        console.log('✅ MySQL connected:', rows);
    } catch (err) {
        console.error('❌ MySQL connection error:', err.message);
    }

    app.listen(PORT, () => {
        logger.info(`=============================================`);
        logger.info(`🚀 Server is running on http://localhost:${PORT}`);
        logger.info(`=============================================`);
    });
};

startServer();

export default app;
