const dbConfig = require('../config/db.config')
const fs = require('fs')
console.log('process.env.NODE_ENV => ' + process.env.NODE_ENV)
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
db.Member = require('./member.model')(sequelize);
db.LoginHistory = require('./login-history.model')(sequelize)

// set foreignKey
db.Member.hasMany(db.LoginHistory, { foreignKey: 'member_id' });
db.LoginHistory.belongsTo(db.Member, { foreignKey: 'member_id' });

(async () => {
  try{
    //資料庫結構與ORM模型同步
    await sequelize.sync({ force: process.env.NODE_ENV === 'test'})
    // 判斷資料表有無資料，無則新增
    if(process.env.NODE_ENV === 'dev'){
      await sequelize.sync({force: false})
      console.log('Table created')
      const member = await db.Member.findOne({where: {firstName: 'testFirstName: Eric'}})
      if(!member) {
        await db.Member.create({
          userName: 'testUserName: userName',
          password: '$2b$12$ziu2WZT.7ZuasduiBv7zT.jwFpV6AnLbH9AXv6Ug37WcZlz21Tyje',
          email: 'ec1348@gmail.com',
          firstName: 'testFirstName: Eric',
          lastName: 'testLastName: Chen',
          DOB: '1996-06-11 00:00:00'
        })
        console.log('First member created')
      } else {
        console.log('First member already exists')
      }
    }
  } catch(err){
    console.error('Unable to create table or check for existing members:', err);
  }
})()

module.exports = db