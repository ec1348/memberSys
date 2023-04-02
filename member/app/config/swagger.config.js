const swaggerJSDoc = require('swagger-jsdoc');

createSwaggerDocs = () => {
  var servers = [];
  if (process.env.NODE_ENV === 'production-aws') {
    servers.push({
      url: 'https://production.abc/',
      description: 'production environment'
    });
  } else if (process.env.NODE_ENV === 'production') {
    servers.push({
      url: 'https://production.abc/api',
      description: 'production environment'
    });
  } else if (process.env.NODE_ENV === 'qa') {
    servers.push({
      url: 'https://qa.abc/',
      description: 'test environment'
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