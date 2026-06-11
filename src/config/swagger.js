const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path')

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API E-commerce REST',
      version: '1.0.0',
      description: 'Documentação e ambiente de testes para a API do E-commerce',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
   
    security: [{ bearerAuth: [] }],
  },
 
  apis: [path.join(__dirname, '../routes/*.js')],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };