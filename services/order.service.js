const { sequelize } = require('../models');
const { Transaction } = require('sequelize');

const OrderRepository = require('../repositories/order.repository.js');
const UserRepository = require('../repositories/user.repository.js');
const StoreRepository = require('../repositories/store.repository.js');

class OrderService {
  orderRepository = new OrderRepository();
  userRepository = new UserRepository();
  storeRepository = new StoreRepository();

  getOrders = async (res) => {
    try {
      const user = res.locals.user;
      const existStore = await this.storeRepository.getStoreInfo(user.id);
      if (!existStore) return { code: 404, errorMessage: '등록한 사업장이 없습니다.' };

      const orders = await this.orderRepository.getOrders(existStore.id);

      return { code: 200, orders };
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '주문 확인에 실패했습니다.' };
    }
  };

  orderMenu = async (storeId, menuId, price, quantity, option, res) => {
    try {
      const user = res.locals.user;
      const { userPoint } = await this.userRepository.getPoint(user.id);
      const totalPrice = price * quantity;
      const remainingPoint = userPoint - totalPrice;
      if (remainingPoint < 0)
        return { code: 400, errorMessage: '잔여포인트가 부족해 주문 할 수 없습니다.' };

      const storeInfo = await this.storeRepository.getStoreInfo('', storeId);
      if (!storeInfo) return { code: 404, errorMessage: '주문하려 하는 매장이 없습니다.' };

      const menuInfo = await this.storeRepository.getMenuInfo(storeId, menuId);
      if (!menuInfo) return { code: 404, errorMessage: '주문하려 하는 메뉴가 없습니다.' };

      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });
      try {
        await this.orderRepository.order(user.id, storeId, menuId, quantity, option, totalPrice, {
          transaction: t,
        });
        await this.userRepository.pointDeduction(user.id, remainingPoint, { transaction: t });
        await t.commit();
        return {
          code: 201,
          message: `${storeInfo.store_name}가게 주문: ${menuInfo.menu}, ${user.name}고객님의 잔여 포인트: ${remainingPoint}포인트`,
        };
      } catch (transactionError) {
        await t.rollback();
        throw transactionError;
      }
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '메뉴 주문에 실패했습니다.' };
    }
  };

  isDelivered = async (orderId, res) => {
    try {
      const user = res.locals.user;
      const existStore = await this.storeRepository.getStoreInfo(user.id);
      if (!existStore) return { code: 404, errorMessage: '등록한 사업장이 없습니다.' };

      const order = await this.orderRepository.findOrder(orderId);
      if (!order) return { code: 404, errorMessage: '해당 주문이 없습니다.' };

      if (order.order_status === 'delivered')
        return { code: 400, errorMessage: '이미 배달이 완료된 주문입니다.' };
      else if (order.order_status === 'refundApply')
        return { code: 400, errorMessage: '고객님이 취소 신청한 주문입니다.' };
      else if (order.order_status === 'cancelled')
        return { code: 400, errorMessage: '이미 환불된 주문입니다.' };

      const total_sales = existStore.total_sales + order.total_price;
      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });
      try {
        await this.orderRepository.updateDeliveryStatus(orderId, { transaction: t });
        await this.storeRepository.updateStoreInSales(user.id, total_sales, { transaction: t });
        await t.commit();
        return {
          code: 201,
          message: `배달이 완료되었습니다. ${order.total_price}포인트가 입금 되었습니다.`,
        };
      } catch (transactionError) {
        await t.rollback();
        throw transactionError;
      }
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '배달 완료 처리에 실패했습니다.' };
    }
  };

  refundApply = async (orderId, res) => {
    try {
      const user = res.locals.user;
      const existOrder = await this.orderRepository.findOrder(orderId);

      if (!existOrder) return { code: 404, errorMessage: '해당 주문을 찾을 수 없습니다.' };
      if (existOrder.user_id !== user.id)
        return { code: 401, errorMessage: '주문 취소 권한이 없습니다.' };

      if (existOrder.order_status === 'cancelled')
        //case 1) 주문이 이미 취소 되었을 때, (환불 신청이 완료된 걸 또 신청했을 때)
        return { code: 400, errorMessage: '이미 환불된 주문입니다.' };
      else if (existOrder.order_status === 'refundApply')
        //case 2) 주문 상태가 현재 주문 취소 신청 상태일 때, (사장에게 환불 신청) - 오류만 반환
        return { code: 400, errorMessage: '이미 취소 신청 중인 주문입니다.' };
      else if (existOrder.order_status === 'delivered') {
        //case 3) 주문이 완료 되었을 때, (사장한테 돈이 들어갔을 때) - 해당 가게한테 환불 신청
        await this.orderRepository.refundApply(orderId);
        return { code: 200, message: '주문 취소가 신청 되었습니다.' };
      }
      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });
      try {
        const userPoint = user.point + existOrder.total_price;
        //case 4) 주문 접수 상태일 때, (사장이 배달완료를 안눌렀을 때) - 바로 환불
        await this.orderRepository.cancelOrder(orderId, { transaction: t });
        await this.userRepository.refundPoint(user.id, userPoint, {
          transaction: t,
        });
        await t.commit();
        return {
          code: 200,
          message: `주문 취소가 완료 되었습니다. ${existOrder.total_price}포인트가 입금 되어 고객님의 잔여포인트는 ${userPoint}포인트 입니다.`,
        };
      } catch (transactionError) {
        await t.rollback();
        throw transactionError;
      }
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '주문 환불 중 오류가 발생했습니다.' };
    }
  };

  refundComplete = async (orderId, res) => {
    try {
      const user = res.locals.user;

      const existOrder = await this.orderRepository.findOrder(orderId);
      if (!existOrder) return { code: 404, errorMessage: '해당 주문을 찾을 수 없습니다.' };
      if (existOrder.user_id !== user.id)
        return { code: 401, errorMessage: '주문 취소건에 대한 승인 권한이 없습니다.' };

      const myStore = await this.storeRepository.findMyStore(user.id);
      const totalSales = myStore.total_sales - existOrder.total_price;
      const userPoint = user.point + existOrder.total_price;

      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });

      try {
        if (existOrder.order_status === 'refundApply') {
          await this.storeRepository.updateStoreInSales(user.id, totalSales, { transaction: t });
          await this.userRepository.refundPoint(existOrder.user_id, userPoint, { transaction: t });
          await this.orderRepository.cancelOrder(orderId, { transaction: t });
          await t.commit();
          return {
            code: 200,
            message: `주문 취소 승인이 완료 되었습니다. 해당 주문 금액의 ${existOrder.total_price}포인트만큼 차감 되었습니다.`,
          };
        }
      } catch (transactionError) {
        await t.rollback();
        throw transactionError;
      }

      return { code: 400, errorMessage: '주문 취소 신청이 들어온 주문이 아닙니다.' };
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '주문 취소 승인 중 오류가 발생했습니다.' };
    }
  };

  refundRefuse = async (orderId, res) => {
    try {
      const user = res.locals.user;
      const existOrder = await this.orderRepository.findOrder(orderId);
      if (!existOrder) return { code: 404, errorMessage: '해당 주문을 찾을 수 없습니다.' };

      if (existOrder.user_id !== user.id)
        return { code: 401, errorMessage: '주문 취소건에 대한 승인 권한이 없습니다.' };

      if (existOrder.order_status === 'refundApply') {
        await this.orderRepository.updateDeliveryStatus(orderId);
        return { code: 200, message: '주문 취소 신청을 거절하였습니다.' };
      }
      const result = await this.isDelivered(orderId, res);
      if (result.errorMessage) return { code: result.code, errorMessage: result.errorMessage };

      return { code: result.code, message: result.message };
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '주문 취소 거절 중 오류가 발생했습니다.' };
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
        totalPrice += orderDetail[i].price * orderDetail[i].quantity;
        const order_id = orderId;
        const menu_id = orderDetail[i].menuId;
        const quantity = orderDetail[i].quantity;
        const price = orderDetail[i].price;
        const option = orderDetail[i].option;
        await this.orderRepository.createOrderDetail(order_id, menu_id, quantity, price, option, {
          transaction: t,
        }); //(처음에 forEach를 썼었는데)array내장함수는 await이 안됨
        // 반복작업에 await이 필요한 경우는 일반for문을 사용할 것
      }
      if (userPoint < totalPrice) {
        throw new Error('주문할 금액이 모자릅니다.');
      }
      const remainedPoint = userPoint - totalPrice;
      await this.orderRepository.updateOrder(orderId, totalPrice, t);
      await this.userRepository.updatePoint(userId, remainedPoint, t);

      await t.commit();
      return { code: 200, message: '정상적으로 주문되었습니다.' };
    } catch (transactionError) {
      console.error(transactionError);
      await t.rollback();
      return { code: 500, errorMessage: '주문 중 오류가 발생했습니다.' };
    }
  };
  test = async () => {
    try {
      await this.orderRepository.updateOrder(7, 1);
      return { code: 200, message: '테스트 성공' };
    } catch (err) {
      return { code: 500, message: '테스트 실패' };
    }
  };
}

module.exports = OrderService;
