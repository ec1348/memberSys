const { DataTypes, Model } = require('sequelize');
module.exports = (sequelize) => {
  class LoginHistory extends Model {}
  LoginHistory.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    device_info: {
      type: DataTypes.STRING,
    },
    login_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    }, {
      sequelize, 
      modelName: 'LoginHistory',
      tableName: 'login-history',
      timestamps: false,
    }
  )
  return LoginHistory
}