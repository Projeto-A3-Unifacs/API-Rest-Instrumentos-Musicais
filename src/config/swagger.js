const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
    // Aplica o cadeado de segurança como padrão para todas as rotas
    security: [{ bearerAuth: [] }],
  },
  // Diz ao Swagger para procurar a documentação dentro de todos os arquivos na pasta routes
  apis: ['./routes/*.js'], 
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };