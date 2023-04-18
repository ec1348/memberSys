const { DataTypes, Model } = require('sequelize');
module.exports = (sequelize) => {
  class PasswordResetRequest extends Model {}
  PasswordResetRequest.init({
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
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    revoked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    }, {
      sequelize, 
      modelName: 'PasswordResetRequest',
      tableName: 'password-reset-request',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )
  return PasswordResetRequest
}