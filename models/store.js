'use strict';
const { Model } = require('sequelize');
const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Menu, Order, Review, Store_like }) {
      this.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasOne(Order, {
        sourceKey: 'id',
        foreignKey: 'store_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(Menu, {
        sourceKey: 'id',
        foreignKey: 'store_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(Review, {
        sourceKey: 'id',
        foreignKey: 'store_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(Store_like, {
        sourceKey: 'id',
        foreignKey: 'store_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
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
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      },
      store_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      opening_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      create_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
      update_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now'),
      },
    },
    {
      sequelize,
      timestamps: false,
      tableName: 'stores',
      modelName: 'Store',
    }
  );
  return Store;
};
