const express = require('express')
const app = express()

// 設定swagger
const swaggerUI = require('swagger-ui-express')
const swaggerConfig = require("./app/config/swagger.config");
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig.createSwaggerDocs()))

app.get('/', function (req, res) {
    res.send('Welcome to the backend service of member api management ! ! !')
})

require('./app/routes/member.routes')(app);

app.listen(3000, function () {
    console.log('Example app listening on port 3000 ! ')
})