const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config();

app.use(bodyParser.json())
// 設定swagger
const swaggerUI = require('swagger-ui-express')
const swaggerConfig = require("./app/config/swagger.config");
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig.createSwaggerDocs()))

app.get('/', function (req, res) {
    res.send('Welcome to the backend service of member api management ! ! !')
})

require('./app/routes/member.routes')(app);

module.exports = app;