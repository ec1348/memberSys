createDBconfig = () => {
  if (process.env.NODE_ENV === 'test') {
    return({
      HOST: "localhost",
      USER: process.env.TEST_MYSQL_USER,
      PASSWORD: process.env.TEST_MYSQL_PASSWORD,
      DB: process.env.TEST_MYSQL_DATABASE,
      dialect: "mysql",
      port: 3307,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  } else if(process.env.NODE_ENV === 'dev') {
    return({
      HOST: "localhost",
      USER: process.env.DEV_MYSQL_USER,
      PASSWORD: process.env.DEV_MYSQL_PASSWORD,
      DB: process.env.DEV_MYSQL_DATABASE,
      dialect: "mysql",
      port: 3305,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  } else if(process.env.NODE_ENV === 'prod') {
    return({
      HOST: process.env.DB_HOST,
      USER: process.env.PROD_EC2_MYSQL_USER,
      PASSWORD: process.env.PROD_EC2_MYSQL_PASSWORD,
      DB: process.env.PROD_EC2_MYSQL_DATABASE,
      dialect: "mysql",
      port: 3306,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  } 
}
module.exports = createDBconfig()