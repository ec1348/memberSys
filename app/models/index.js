const dbConfig = require('../config/db.config')
const fs = require('fs')
console.log('process.env.NODE_ENV => ' + process.env.NODE_ENV)
const Sequelize = require('sequelize')
const seed = require('./seed')
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
db.PasswordResetRequest = require('./password-reset-request.model')(sequelize)

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

// one to many (PasswordResetRequest <-> Member)
db.PasswordResetRequest.belongsTo(db.Member, { foreignKey: 'member_id' });
db.Member.hasMany(db.PasswordResetRequest, { foreignKey: 'member_id' });

const isTest = process.env.NODE_ENV === 'test'
sequelize.sync({ force: isTest })
  .then(() => seed(db))
  .then(() => {
    console.log('Database synced and seeded.');
  })
  .catch((error) => {
    console.error('Error syncing or seeding database:', error);
  });

module.exports = db