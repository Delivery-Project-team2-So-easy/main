"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Store.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      storeName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      storeAddress: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      storeImg: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      openingDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      companyResistrationNumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
    {
      sequelize,
      modelName: "Store",
    }
  );
  return Store;
};
