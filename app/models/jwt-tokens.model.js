const { DataTypes, Model } = require('sequelize');
module.exports = (sequelize) => {
  class JwtToken extends Model {}
  JwtToken.init({
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
    token: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    expired_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
    }, {
      sequelize, 
      modelName: 'JwtToken',
      tableName: 'jwt-tokens',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )
  return JwtToken
}