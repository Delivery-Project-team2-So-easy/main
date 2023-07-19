const OrderService = require('../services/order.service.js');

class OrderController {
  orderService = new OrderService();

  getOrders = async (_, res) => {
    const { is_seller } = res.locals.user;
    if (is_seller === false)
      return res
        .status(401)
        .json({ errorMessage: '사장으로 로그인한 계정만 이용할 수 있는 기능입니다.' });

    const result = await this.orderService.getOrders(res);
    if (result.errorMessage)
      return res.status(result.code).json({ errorMessage: result.errorMessage });
    return res.status(result.code).json({ orders: result.orders });
  };

  order = async (req, res) => {
    const { storeId, menuId } = req.params;
    const { price, quantity, option } = req.body;

    if (!price || !quantity || quantity < 1)
      return res.status(400).json({ errorMessage: '가격이 비어 있거나 수량이 1개 미만입니다.' });

    const result = await this.orderService.orderMenu(storeId, menuId, price, quantity, option, res);
    if (result.errorMessage)
      return res.status(result.code).json({ errorMessage: result.errorMessage });
    return res.status(result.code).json({ message: result.message });
  };

  isDelivered = async (req, res) => {
    const { orderId } = req.params;
    const { is_seller } = res.locals.user;
    if (is_seller === false)
      return res
        .status(401)
        .json({ errorMessage: '사장으로 로그인한 계정만 이용할 수 있는 기능입니다.' });

    const result = await this.orderService.isDelivered(orderId, res);
    if (result.errorMessage)
      return res.status(result.code).json({ errorMessage: result.errorMessage });
    return res.status(result.code).json({ message: result.message });
  };
}

module.exports = OrderController;
