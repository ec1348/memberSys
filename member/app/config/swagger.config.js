const swaggerJSDoc = require('swagger-jsdoc');

createSwaggerDocs = () => {
  let servers = [];
  if (process.env.NODE_ENV === 'prod') {
    servers.push({
      url: `${process.env.PROD_URL}`,
      description: 'production environment'
    });
  } else {
    servers.push({
      url: 'http://localhost:3000/',
      description: 'dev environment'
    });
  }
  
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Member API',
        version: '1.0.0',
        description: 'API for managing members',
      },
      servers: servers,
    },
    apis: ['./app/swaggers/*.yaml'],
  };
  return swaggerJSDoc(swaggerOptions);
}

const swaggerConfig = {
  createSwaggerDocs: createSwaggerDocs
};
module.exports = swaggerConfig;