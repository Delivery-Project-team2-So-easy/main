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

  order = async (userId, storeId, menuId, quantity, address, option, totalPrice, t) => {
    const isOption = option ? option : null;
    await Order.create(
      {
        user_id: userId,
        store_id: storeId,
        menu_id: menuId,
        quantity: quantity,
        address,
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

  // 주문 건수 계산 메서드
  countTotalOrders = async (storeId, daysAgo) => {
    /* 랭킹 기준
    1. 주문수가 많은 순서로 랭킹을 집계 (매장별 객단가가 다르기 때문)
    2. 기간(일별 주문수, 주간 주문수, 월간 주문수)을 설정하여 2가지의 랭킹을 계산
    3. 배달이 완료된 주문만 집계
    */
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setDate(currentDate.getDate() - daysAgo);

    const orderCount = await Order.count({
      where: {
        store_id: storeId,
        order_status: 'delivered',
        create_at: {
          [Op.between]: [startDate, currentDate],
        },
      },
    });

    return orderCount;
  };

  // 재주문 건수 및 재주문율 계산 메서드
  countTotalReorders = async (storeId) => {
    const orders = await Order.findAll({
      where: {
        store_id: storeId,
        order_status: 'delivered',
      },
      attributes: ['store_id', 'user_id'],
    });
    // set을 사용하여 user_id가 userIds에 존재하는지 확인
    // 없으면 추가해주고 있다면 reorderCount를 올려줌
    const userIds = new Set();
    let reorderCount = 0;

    for (const order of orders) {
      if (!userIds.has(order.user_id)) {
        userIds.add(order.user_id);
      } else {
        reorderCount++;
      }
    }
    const total = orders.length;
    const averageRate = total > 0 ? (reorderCount / total).toFixed(2) : 0;

    return { reorderCount, averageRate };
  };

  getMyOrders = async (userId) => {
    const myOrders = await Order.findAll({
      where: { user_id: userId },
      attributes: ['id', 'store_id', 'order_status', 'total_price', 'create_at'],
    });
    return myOrders;
  };
}
module.exports = OrderRepository;
