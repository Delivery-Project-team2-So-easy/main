const { sequelize } = require('../models');
const { Transaction } = require('sequelize');

const OrderRepository = require('../repositories/order.repository.js');
const UserRepository = require('../repositories/user.repository.js');
const StoreRepository = require('../repositories/store.repository.js');
const errorHandler = require('../errorHandler');

class OrderService {
  orderRepository = new OrderRepository();
  userRepository = new UserRepository();
  storeRepository = new StoreRepository();

  getOrders = async (id) => {
    try {
      const existStore = await this.storeRepository.getStoreInfo(id);
      if (!existStore) throw errorHandler.notRegistered;

      const { orders } = await this.orderRepository.getOrders(existStore.id);

      return { code: 200, orders };
    } catch (err) {
      throw err;
    }
  };

  getClientOrders = async (res) => {
    try {
      const user = res.locals.user;
      const { orders } = await this.orderRepository.getClientOrders(user.id);
      return { code: 200, orders };
    } catch (err) {
      throw err;
    }
  };

  orderMenu = async (storeId, menuId, price, quantity, option, res) => {
    try {
      const user = res.locals.user;
      const { userPoint } = await this.userRepository.getPoint(user.id);
      const totalPrice = price * quantity;
      const remainingPoint = userPoint - totalPrice;
      if (remainingPoint < 0) throw errorHandler.pointLess;

      const storeInfo = await this.storeRepository.getStoreInfo('', storeId);
      if (!storeInfo) throw errorHandler.nonExistStore;

      const menuInfo = await this.storeRepository.getMenuInfo(storeId, menuId);
      if (!menuInfo) throw errorHandler.nonExistMenu;

      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });
      try {
        await this.orderRepository.order(
          user.id,
          storeId,
          menuId,
          quantity,
          user.address,
          option,
          totalPrice,
          {
            transaction: t,
          }
        );
        await this.userRepository.updatePoint(user.id, remainingPoint, t);
        await t.commit();
        return {
          code: 201,
          message: `${storeInfo.store_name}가게 주문: ${menuInfo.menu}, ${user.name}고객님의 잔여 포인트: ${remainingPoint}포인트`,
          data: { address: user.address, totalPrice },
        };
      } catch (transactionError) {
        await t.rollback();
        throw transactionError;
      }
    } catch (err) {
      throw err;
    }
  };

  isDelivered = async (orderId, res) => {
    try {
      const user = res.locals.user;
      const existStore = await this.storeRepository.getStoreInfo(user.id);
      if (!existStore) throw errorHandler.notRegistered;

      const order = await this.orderRepository.findOrder(orderId);
      if (!order) throw errorHandler.noOrder;

      if (order.order_status === 'delivered') throw errorHandler.completedOrder;
      else if (order.order_status === 'refundRequest') throw errorHandler.refundOrder;
      else if (order.order_status === 'cancelled') throw errorHandler.cancelledOrder;

      const total_sales = existStore.total_sales + order.total_price;
      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });
      try {
        await this.orderRepository.updateDeliveryStatus(orderId, t);
        await this.storeRepository.updateStoreInSales(user.id, total_sales, t);
        await t.commit();
        return {
          code: 201,
          message: `배달이 완료되었습니다. ${order.total_price}포인트가 입금 되었습니다.`,
          data: { userId: order.user_id },
        };
      } catch (transactionError) {
        await t.rollback();
        throw transactionError;
      }
    } catch (err) {
      throw err;
    }
  };

  refundRequest = async (orderId, res) => {
    try {
      const user = res.locals.user;
      const existOrder = await this.orderRepository.findOrder(orderId);

      if (!existOrder) throw errorHandler.orderNotFound;
      if (existOrder.user_id !== user.id) throw errorHandler.noPermissions;

      //case 1) 주문이 이미 취소 되었을 때, (환불 신청이 완료된 걸 또 신청했을 때)
      if (existOrder.order_status === 'cancelled') throw errorHandler.completedRefund;
      //case 2) 주문 상태가 현재 주문 취소 신청 상태일 때, (사장에게 환불 신청) - 오류만 반환
      else if (existOrder.order_status === 'refundRequest') throw errorHandler.requestingRefund;
      //case 3) 주문이 완료 되었을 때, (사장한테 돈이 들어갔을 때) - 해당 가게한테 환불 신청
      else if (existOrder.order_status === 'delivered') {
        await this.orderRepository.refundRequest(orderId);
        return {
          code: 200,
          message: '이미 배달이 완료된 주문이므로 환불 요청이 이루어 졌습니다.',
          data: {
            status: existOrder.order_status,
            orderId: existOrder.id,
          },
        };
      }

      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });

      try {
        const userPoint = user.point + existOrder.total_price;
        //case 4) 주문 접수 상태일 때, (사장이 배달완료를 안눌렀을 때) - 바로 환불
        await this.orderRepository.cancelOrder(orderId, t);
        await this.userRepository.updatePoint(user.id, userPoint, t);
        await t.commit();
        return {
          code: 200,
          message: `주문 취소가 완료 되었습니다. ${existOrder.total_price}포인트가 입금 되어 고객님의 잔여포인트는 ${userPoint}포인트 입니다.`,
          data: {
            status: existOrder.order_status,
            orderId: existOrder.id,
          },
        };
      } catch (transactionError) {
        await t.rollback();
        throw transactionError;
      }
    } catch (err) {
      throw err;
    }
  };

  refundComplete = async (orderId, res) => {
    try {
      const user = res.locals.user;

      const existOrder = await this.orderRepository.findOrder(orderId);
      if (!existOrder) throw errorHandler.orderNotFound;

      const myStore = await this.storeRepository.findByStoreId(existOrder.store_id);
      if (myStore.user_id !== user.id) throw errorHandler.noPermissions;

      const totalSales = myStore.total_sales - existOrder.total_price;
      const userPoint = user.point + existOrder.total_price;

      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });

      try {
        if (existOrder.order_status === 'refundRequest') {
          await this.storeRepository.updateStoreInSales(user.id, totalSales, t);
          await this.userRepository.updatePoint(existOrder.user_id, userPoint, t);
          await this.orderRepository.cancelOrder(orderId, t);
          await t.commit();
          return {
            code: 200,
            message: `주문 환불이 완료 되었습니다. 해당 주문 금액의 ${existOrder.total_price}포인트만큼 차감 되었습니다.`,
            data: { userId: existOrder.user_id, point: existOrder.total_price },
          };
        }
      } catch (transactionError) {
        await t.rollback();
        throw transactionError;
      }
      throw errorHandler.notRequestRefund;
    } catch (err) {
      throw err;
    }
  };

  refundRefuse = async (orderId, res) => {
    try {
      const user = res.locals.user;
      const existOrder = await this.orderRepository.findOrder(orderId);
      if (!existOrder) throw errorHandler.orderNotFound;

      const myStore = await this.storeRepository.findByStoreId(existOrder.store_id);
      if (myStore.user_id !== user.id) throw errorHandler.noPermissions;

      if (existOrder.order_status === 'refundRequest') {
        await this.orderRepository.updateDeliveryStatus(orderId);
        return {
          code: 200,
          message: '주문 환불 요청을 거부하였습니다.',
          data: { userId: existOrder.user_id },
        };
      }
      throw errorHandler.notRequestRefund;
    } catch (err) {
      throw err;
    }
  };
  // 여러 음식 주문
  orderMany = async (orderDetail, user, storeId) => {
    const t = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED, // 트랜잭션 격리 수준을 설정합니다.
    });
    try {
      const address = user.address;
      const userId = user.id;
      const userPoint = user.point;
      const order = await this.orderRepository.createOrder(userId, storeId, address, {
        transaction: t,
      });
      const orderId = order.id;
      let totalPrice = 0;
      for (let i = 0; i < orderDetail.length; i++) {
        const order_id = orderId;
        const menu_id = orderDetail[i].menuId;
        const quantity = orderDetail[i].quantity;
        const option = orderDetail[i].option;
        const menu = await this.storeRepository.findMenuById(storeId, menu_id, t);
        const price = menu.price;
        totalPrice += price * orderDetail[i].quantity;
        await this.orderRepository.createOrderDetail(order_id, menu_id, quantity, price, option, {
          transaction: t,
        });
      }
      if (userPoint < totalPrice) throw errorHandler.pointLess;

      const remainedPoint = userPoint - totalPrice;
      await this.orderRepository.updateOrder(orderId, totalPrice, t);
      await this.userRepository.updatePoint(userId, remainedPoint, t);

      await t.commit();
      return { code: 200, message: '정상적으로 주문되었습니다.' };
    } catch (err) {
      await t.rollback();
      throw err;
    }
  };
}

module.exports = OrderService;
