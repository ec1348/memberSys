const dbConfig = require('../config/db.config')
const fs = require('fs')
console.log('global env => ' + global.env)
const Sequelize = require('sequelize')
const sequelize = new Sequelize(
  dbConfig.DB, 
  dbConfig.USER, 
  dbConfig.PASSWORD, 
  {
      host: dbConfig.HOST,
      dialect: dbConfig.dialect,
      pool: dbConfig.pool,
      timezone: '+08:00',
      logging: (query) => {
        fs.appendFileSync('queries.log', query + '\n')
      }
  },
  )
const db = {}
db.Member = require('./member.model')(sequelize)

if(global.env === 'dev'){
  ( async () => {
    //資料庫結構與ORM模型同步
    await sequelize.sync({force: false})
    .then(() => {
      console.log('Table created')
    })
    .catch((err) => {
      console.error('Unable to create table', err)
    })
    //判斷資料表有無資料 無則新增
    //User table
    db.Member.findOne({where: {firstName: 'testFirstName: Eric'}})
      .then(member => {
        if(!member){
          db.Member.create({
            userName: 'testUserName: userName',
            password: '$2b$12$ziu2WZT.7ZuasduiBv7zT.jwFpV6AnLbH9AXv6Ug37WcZlz21Tyje',
            email: 'ec1348@gmail.com',
            firstName: 'testFirstName: Eric',
            lastName: 'testLastName: Chen',
            DOB: '1996-06-11 00:00:00'
          })
            .then( member => {
              console.log('First member created')
            })
            .catch( err => {
              console.log('Unable to create first member', err)
            })
        }else {
          console.log('First member already exists: ')
        }
      })
      .catch((err) => {
        console.log('Unable to check for exists members: ', err)
      })
  })()
}
module.exports = db