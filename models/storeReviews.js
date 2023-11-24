'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StoreReviews extends Model {
    static associate(models) {
        StoreReviews.belongsTo(models.Stores, { foreignKey: 'storeId', as: 'store' });
        StoreReviews.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
    }
  }

  StoreReviews.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      storeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      image: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'StoreReviews', 
    }
  );

  return StoreReviews;
};
