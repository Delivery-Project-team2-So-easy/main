const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const orderController = new OrderController();

router.post('/order/store/:storeId/menu/:menuId', orderController.order);
router.get('/order', orderController.getOrders);
router.post('/order/:orderId', orderController.isDelivered);

module.exports = router;
