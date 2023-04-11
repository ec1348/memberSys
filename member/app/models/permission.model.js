const { DataTypes, Model } = require('sequelize');
module.exports = (sequelize) => {
  class Permission extends Model {}
  Permission.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    }, {
      sequelize, 
      modelName: 'Permission',
      tableName: 'permission',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  )
  return Permission
}