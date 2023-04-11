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
db.sequelize = sequelize
db.Member = require('./member.model')(sequelize);
db.LoginHistory = require('./login-history.model')(sequelize)
db.JwtTokens = require('./jwt-tokens.model')(sequelize)
db.Permission = require('./permission.model')(sequelize)

// set foreignKey 
// one to many (Member <-> LoginHistory)
db.Member.hasMany(db.LoginHistory, { foreignKey: 'member_id' });
db.LoginHistory.belongsTo(db.Member, { foreignKey: 'member_id' });

// one to many (Member <-> JwtToken)
db.Member.hasMany(db.JwtTokens, { foreignKey: 'member_id' });
db.JwtTokens.belongsTo(db.Member, { foreignKey: 'member_id' });

// one to many (Permission <-> Member)
db.Permission.hasMany(db.Member, { foreignKey: 'permission_id' });
db.Member.belongsTo(db.Permission, { foreignKey: 'permission_id' });

sequelize.sync({ force: false})

module.exports = db