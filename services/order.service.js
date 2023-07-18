const { sequelize } = require('../models');
const { Transaction } = require('sequelize');

const OrderRepository = require('../repositories/order.repository.js');
const UserRepository = require('../repositories/user.repository.js');

class OrderService {
  orderRepository = new OrderRepository();
  userRepository = new UserRepository();

  //   - “고객님”은 메뉴를 주문할 수 있어야 합니다.
  // - 단, 잔여 포인트가 메뉴 가격보다 비싸면 주문을 할 수 없어야 합니다.
  // - 주문 시 포인트 차감을 할 때는 반드시 트랜잭션을 이용해주세요.
  orderMenu = async (storeId, menuId, price, quantity, option, res) => {
    try {
      const { userId } = res.locals.user;
      const userPoints = await this.userRepository.getPoints(userId);

      if (price * quantity > userPoints)
        return { code: 400, errorMessage: '잔여포인트가 부족해 주문 할 수 없습니다.' };
      if (!storeId) return { code: 404, errorMessage: '주문하려 하는 매장이 없습니다.' };
      if (!menuId) return { code: 404, errorMessage: '해당 메뉴가 없습니다.' };
      if (!quantity) return { code: 400, errorMessage: '수량이 입력되지 않았습니다.' };

      const t = await sequelize.transaction({
        isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED,
      });
      try {
        await this.orderRepository.order(userId, storeId, menuId, quantity, option);
      } catch (transactionError) {
        console.error(transactionError);
        await t.rollback();
        throw transactionError;
      }
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '메뉴 주문에 실패했습니다.' };
    }
  };

  getOrders = async (res) => {
    try {
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '주문 확인에 실패했습니다.' };
    }
  };

  isDelivered = async (orderId, res) => {
    try {
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '배달 완료 처리에 실패했습니다.' };
    }
  };
}

module.exports = OrderService;
