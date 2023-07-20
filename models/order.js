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
    static associate({ User, Store, Review, Order_detail }) {
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
      this.hasOne(Review, {
        sourceKey: 'id',
        foreignKey: 'order_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      });
      this.hasMany(Order_detail, {
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
      // 1. 배달이 되지 않은 상태(not_delivered) 2. 배달이 완료된 상태(delivered)
      // 3. 주문이 취소 중인 상태(refundRequest) 4. 주문 취소가 완료된 상태(cancelled)
      order_status: {
        type: Sequelize.STRING,

        allowNull: false,
        defaultValue: 'not_delivered',
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
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
