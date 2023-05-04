const { DataTypes, Model } = require('sequelize');
module.exports = (sequelize) => {
  class Member extends Model {}
  Member.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    permission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    }, {
      sequelize, 
      modelName: 'Member',
      tableName: 'member',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  )
  return Member
}