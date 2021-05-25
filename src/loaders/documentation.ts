import swaggerJSDoc from 'swagger-jsdoc';

const definition = {
  openapi: '3.0.1',
  info: {
    title: 'Webapp API',
    version: '0.0.1',
    description: 'Webapp API for all sites',
    // termsOfService: 'http://api_url/terms/',
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
    },
    contact: {
      name: 'Claudiney Calixto da Silva',
      url: 'https://effetivo.com.br',
      email: 'clau.li.erd@gmail.com',
    },
    basePath: '/',
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
  servers: [
    {
      url: 'http://xxx.heroku.com/',
      description: 'Production Server',
    },
    {
      url: 'http://localhost:3000/',
      description: 'Local server',
    },
  ],
};

const swaggerJSOptions = {
  definition,
  apis: ['**/controllers/*.ts'],
};

export const swaggerDocs = swaggerJSDoc(swaggerJSOptions);

export const swaggerUIOtions = {
  explorer: false,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Website App - API documentation',
  //customfavIcon: "/assets/favicon.ico",
};
