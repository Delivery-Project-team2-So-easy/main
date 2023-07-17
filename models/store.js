'use strict';
const { Model } = require('sequelize');
const Sequelize = require('sequelize');

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
      store_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      store_address: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      store_img: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      opening_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      company_resistration_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
    {
      sequelize,
      timestamps: false,
      underscored: true,
      modelName: 'Store',
    }
  );
  return Store;
};
