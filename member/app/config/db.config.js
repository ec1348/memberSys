createDBconfig = () => {
  if (process.env.NODE_ENV === 'test') {
    return({
      HOST: "localhost",
      USER: "root",
      PASSWORD: "123456",
      DB: "memberTest",
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
      USER: "root",
      PASSWORD: "123456",
      DB: "memberDev",
      dialect: "mysql",
      port: 3306,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  } else if(process.env.NODE_ENV === 'qa') {
    return({
      HOST: "localhost",
      USER: "root",
      PASSWORD: "123456",
      DB: "member",
      dialect: "mysql",
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    })
  } else {
    return({
      HOST: "localhost",
      USER: "root",
      PASSWORD: "123456",
      DB: "member",
      dialect: "mysql",
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