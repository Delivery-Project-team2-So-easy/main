const { sequelize } = require('../models');
const { Transaction } = require('sequelize');

const OrderRepository = require('../repositories/order.repository.js');
const UserRepository = require('../repositories/user.repository.js');
const StoreRepository = require('../repositories/store.repository.js');

const t = await sequelize.transaction({
  isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
});

class OrderService {
  orderRepository = new OrderRepository();
  userRepository = new UserRepository();
  storeRepository = new StoreRepository();

  getOrders = async (res) => {
    try {
      const user = res.locals.user;
      const orders = await this.orderRepository.getOrders(user.id);
      if (!orders) return { code: 404, errorMessage: '등록한 사업장이 없습니다.' };

      return { code: 200, orders };
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '주문 확인에 실패했습니다.' };
    }
  };

  orderMenu = async (storeId, menuId, price, quantity, option, res) => {
    try {
      const user = res.locals.user;
      const userPoint = await this.userRepository.getPoint(user.id);
      const totalPrice = price * quantity;
      const remainingPoint = userPoint - totalPrice;
      if (remainingPoint < 0)
        return { code: 400, errorMessage: '잔여포인트가 부족해 주문 할 수 없습니다.' };

      const storeInfo = await this.storeRepository.getStoreInfo(user.id, storeId, menuId);
      if (!storeInfo) return { code: 404, errorMessage: '주문하려 하는 매장이나 메뉴가 없습니다.' };

      try {
        await this.orderRepository.order(user.id, storeId, menuId, quantity, option, {
          transaction: t,
        });
        await this.userRepository.pointDeduction(user.id, remainingPoint, { transaction: t });
        await t.commit();
        return {
          code: 201,
          message: `${storeInfo.store_name}가게의 ${storeInfo.menu}가 정상적으로 주문 되었습니다. ${user.name}고객님의 잔여 포인트는 ${remainingPoint}포인트 입니다.`,
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
      const order = await this.orderRepository.findOne(orderId);
      if (!order)
        if (order.is_delivered)
          return { code: 400, errorMessage: '이미 배달이 완료된 주문입니다.' };

      const orders = await this.orderRepository.getOrders(user.id);
      if (!orders) return { code: 404, errorMessage: '등록한 사업장이 없습니다.' };
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '배달 완료 처리에 실패했습니다.' };
    }
  };
}

module.exports = OrderService;
