import swaggerJsdoc from 'swagger-jsdoc';

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
        url: 'http://localhost:5000/api/v1',
        description: 'Development Server',
      },
    ],
  },
  apis: ['./src/modules/**/*.js'],
};

const specs = swaggerJsdoc(options);

export default specs;
