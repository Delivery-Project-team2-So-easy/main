const errorHandler = require('../errorHandler.js');
const OrderService = require('../services/order.service.js');

class OrderController {
  orderService = new OrderService();
  getOrders = async (_, res, next) => {
    try {
      const { is_seller } = res.locals.user;

      if (is_seller === false) throw errorHandler.noSeller;

      const result = await this.orderService.getOrders(id);
      return res.status(result.code).json({ orders: result.orders });
    } catch (err) {
      next(err);
    }
  };

  getClientOrders = async (_, res, next) => {
    try {
      const result = await this.orderService.getClientOrders(res);
      return res.status(result.code).json({ orders: result.orders });
    } catch (err) {
      next(err);
    }
  };

  order = async (req, res, next) => {
    try {
      const { storeId, menuId } = req.params;
      const { price, quantity, option } = req.body;

      if (!price || !quantity || quantity < 1) throw errorHandler.emptyContent;

      const result = await this.orderService.orderMenu(
        storeId,
        menuId,
        price,
        quantity,
        option,
        res
      );

      res.status(result.code).json({ message: result.message });
    } catch (err) {
      next(err);
    }
  };

  isDelivered = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { is_seller } = res.locals.user;
      if (is_seller === false) throw errorHandler.noSeller;
      if (is_seller === false) throw errorHandler.noSeller;

      const result = await this.orderService.isDelivered(orderId, res);
      return res.status(result.code).json({ message: result.message, data: result.data });
    } catch (err) {
      next(err);
    }
  };

  refundRequestOrder = async (req, res, next) => {
    try {
      const { orderId } = req.params;

      const result = await this.orderService.refundRequest(orderId, res);

      return res.status(result.code).json({ message: result.message, data: result.data });
    } catch (err) {
      next(err);
    }
  };

  refundComplete = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { is_seller } = res.locals.user;

      if (is_seller === false) throw errorHandler.noSeller;

      const result = await this.orderService.refundComplete(orderId, res);

      res.status(result.code).json({ message: result.message, data: result.data });
    } catch (err) {
      next(err);
    }
    next();
  };

  refundRefuse = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { is_seller } = res.locals.user;

      if (is_seller === false) throw errorHandler.noSeller;

      const result = await this.orderService.refundRefuse(orderId, res);

      return res.status(result.code).json({ message: result.message, data: result.data });
    } catch (err) {
      next(err);
    }
  };

  // 여러 음식 주문
  orderMany = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const { user } = res.locals;
      const orderDetail = req.body;

      if (orderDetail.length === 0) throw errorHandler.nonList;

      const { code, message } = await this.orderService.orderMany(orderDetail, user, storeId);

      return res.status(code).json({ message });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = OrderController;
