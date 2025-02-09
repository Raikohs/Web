const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    definition: { // ✅ исправлено с `swaggerDefinition` на `definition`
        openapi: '3.0.0',
        info: {
            title: 'Book Management API',
            version: '1.0.0',
            description: 'API for managing books',
        },
        servers: [{
            url: 'http://localhost:3000',
        }, ],
    },
    apis: [__dirname + '/server.js'], // ✅ исправлен путь
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};