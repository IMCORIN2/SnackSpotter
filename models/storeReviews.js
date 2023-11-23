'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class storeReviews extends Model {
    static associate(models) {
      storeReviews.belongsTo(models.Stores, { foreignKey: 'storeId', as: 'store' });
      storeReviews.belongsTo(models.Users, { foreignKey: 'userId', as: 'user' });
    }
  }

  storeReviews.init(
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
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
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
      modelName: 'storeReviews',
    }
  );

  return storeReviews;
};
