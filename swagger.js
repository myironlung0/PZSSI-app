const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'BOOKS REST API',
    description: 'REST API do zarządzania książkami w bibliotece',
    version: '1.0.0'
  },
  host: 'localhost:8000',
  basePath: '/api'
};

const outputFile = './swagger.json';
const routes = ['./app.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);