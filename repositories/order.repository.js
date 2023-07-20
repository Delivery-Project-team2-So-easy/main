const { Order, Order_detail, User } = require('../models');
const { Op } = require('sequelize');

class OrderRepository {
  getOrders = async (storeId) => {
    const orders = await Order.findAll({
      order: [['create_at', 'DESC']],
      where: { store_id: storeId },
    });
    return orders;
  };

  order = async (userId, storeId, menuId, quantity, option, totalPrice) => {
    const isOption = option ? option : null;
    await Order.create({
      user_id: userId,
      store_id: storeId,
      menu_id: menuId,
      quantity: quantity,
      option: isOption,
      total_price: totalPrice,
    });
    return;
  };

  findOrder = async (orderId) => {
    const order = await Order.findOne({ where: { id: orderId } });
    return order;
  };

  // postReview에서 사용
  existOrder = async (userId, storeId) => {
    const existOrder = await Order.findOne({
      where: {
        [Op.and]: [{ user_id: userId }, { store_id: storeId }],
      },
    });
    return existOrder;
  };

  updateDeliveryStatus = async (orderId) => {
    await Order.update({ order_status: 'delivered' }, { where: { id: orderId } });
    return;
  };

  refundApply = async (orderId) => {
    await Order.update({ order_status: 'refundApply' }, { where: { id: orderId } });
    return;
  };

  cancelOrder = async (orderId, refundReason) => {
    await Order.update({ order_status: 'cancelled' }, { where: { id: orderId } });
    return;
  };

  // 여러 음식 주문
  createOrder = async (userId, storeId, address, t) => {
    return await Order.create(
      {
        user_id: userId,
        store_id: storeId,
        address,
      },
      t
    );
  };
  createOrderDetail = async (order_id, menu_id, quantity, price, option, t) => {
    await Order_detail.create(
      {
        order_id,
        menu_id,
        quantity,
        price,
        option,
      },
      t
    );
  };

  updateOrder = async (orderId, totalPrice, t) => {
    console.log(orderId, totalPrice);
    return Order.update({ total_price: totalPrice }, { where: { id: orderId }, transaction: t });
  };
}

module.exports = OrderRepository;
