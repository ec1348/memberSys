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
      port: dbConfig.port,
      timezone: '+08:00',
      logging: (query) => {
        fs.appendFileSync('queries_' + process.env.NODE_ENV + '.log', query + '\n')
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
    }
  } catch(err){
    console.error('Unable to create table or check for existing members:', err);
  }
})()

module.exports = db