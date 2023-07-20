const { Order, Order_detail } = require('../models');
const { Op } = require('sequelize');

class OrderRepository {
  getOrders = async (storeId) => {
    const orders = await Order.findAll({
      order: [['create_at', 'DESC']],
      where: { store_id: storeId },
    });
    return orders;
  };

  order = async (userId, storeId, menuId, quantity, option, totalPrice, t) => {
    const isOption = option ? option : null;
    await Order.create(
      {
        user_id: userId,
        store_id: storeId,
        menu_id: menuId,
        quantity: quantity,
        option: isOption,
        total_price: totalPrice,
      },
      t
    );
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

  updateDeliveryStatus = async (orderId, t) => {
    await Order.update({ order_status: 'delivered' }, { where: { id: orderId }, transaction: t });
    return;
  };

  refundRequest = async (orderId) => {
    await Order.update({ order_status: 'refundRequest' }, { where: { id: orderId } });
    return;
  };

  cancelOrder = async (orderId, t) => {
    await Order.update({ order_status: 'cancelled' }, { where: { id: orderId }, transaction: t });
    return;
  };

  // 여러 음식 주문
  createOrder = async (userId, storeId, address) => {
    return await Order.create({
      user_id: userId,
      store_id: storeId,
      address,
    });
  };
  createOrderDetail = async (orderId, menuId, quantity, price, option) => {
    await Order_detail.create({
      order_id: orderId,
      menu_id: menuId,
      quantity,
      price,
      option,
    });
  };

  updateOrder = async (orderId, totalPrice) => {
    return Order.update({ total_price: totalPrice }, { where: { id: orderId } });
  };
}

module.exports = OrderRepository;
