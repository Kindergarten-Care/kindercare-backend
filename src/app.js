import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index.js';
import { errorConverter, errorHandler } from './middlewares/error.middleware.js';
import ApiError from './utils/ApiError.js';
import httpStatus from 'http-status';
import logger from './config/logger.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpecs from './config/swagger.js';

dotenv.config();

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

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`=============================================`);
    logger.info(`🚀 Server is running on http://localhost:${PORT}`);
    logger.info(`=============================================`);
});

export default app;
