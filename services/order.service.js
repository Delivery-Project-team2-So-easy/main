const OrderRepository = require('../repositories/order.repository.js');

class OrderService {
  orderRepository = new OrderRepository();
}

module.exports = OrderService;
