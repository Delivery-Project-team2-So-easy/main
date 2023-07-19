const { Order } = require('../models');
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
    await Order.update({ is_delivered: true }, { where: { id: orderId } });
    return;
  };
}

module.exports = OrderRepository;
