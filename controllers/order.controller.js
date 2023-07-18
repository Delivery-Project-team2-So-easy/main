const OrderService = require('../services/order.service.js');

class OrderController {
  orderService = new OrderService();
}

module.exports = OrderController;
