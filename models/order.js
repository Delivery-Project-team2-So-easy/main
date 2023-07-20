'use strict';
const { Model } = require('sequelize');
const Sequelize = require('sequelize');
module.exports = (sequelize) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ User, Store, Menu, Review }) {
      this.belongsTo(User, {
        targetKey: 'id',
        foreignKey: 'user_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.belongsTo(Store, {
        targetKey: 'id',
        foreignKey: 'store_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.belongsTo(Menu, {
        targetKey: 'id',
        foreignKey: 'menu_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasOne(Review, {
        sourceKey: 'id',
        foreignKey: 'order_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
    }
  }
  Order.init(
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
      store_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      menu_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // order 상태가 4가지 여서 4가지를 표현하기 위해 string으로 변경
      // 1. 배달이 되지 않은 상태(not_delivered) 2. 배달이 완료된 상태(delivered)
      // 3. 주문이 취소 중인 상태(refundApply) 4. 주문 취소가 완료된 상태(cancelled)
      order_status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'not_delivered',
      },
      quantity: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
      },
      option: {
        type: Sequelize.STRING,
      },
      total_price: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      timestamps: false,
      sequelize,
      tableName: 'orders',
      modelName: 'Order',
    }
  );
  return Order;
};
