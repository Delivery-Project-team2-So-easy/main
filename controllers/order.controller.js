const OrderService = require('../services/order.service.js');

class OrderController {
  orderService = new OrderService();

  order = async (req, res) => {
    const { storeId, menuId } = req.params;
    const { price, quantity, option } = req.body;
    const result = await this.orderService.orderMenu(storeId, menuId, price, quantity, option, res);

    if (result.errorMessage) res.status(result.code).json({ errorMessage: result.errorMessage });
    else res.status(result.code).json({ message: result.message });
  };

  getOrders = async (_, res) => {
    const result = await this.orderService.getOrders(res);

    if (result.errorMessage) res.status(result.code).json({ errorMessage: result.errorMessage });
    else res.status(result.code).json({ orders: result.orders });
  };

  isDelivered = async (req, res) => {
    const { orderId } = req.params;
    const result = await this.orderService.isDelivered(orderId, res);

    if (result.errorMessage) res.status(result.code).json({ errorMessage: result.errorMessage });
    else res.status(result.code).json({ message: result.message });
  };
}

module.exports = OrderController;
