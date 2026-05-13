import swaggerJsdoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'KinderCare API Documentation',
      version: '1.0.0',
      description: 'KinderCare Kindergarten Management System API',
    },
    servers: [
      {
        url: process.env.API_URL || `http://localhost:${process.env.PORT || 5000}/api/v1`,
        description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server',
      },
    ],
  },
  apis: ['./src/modules/**/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;
