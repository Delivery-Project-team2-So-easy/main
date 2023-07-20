const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const orderController = new OrderController();
const auth = require('../middlewares/auth-middleware');

router.get('/order', auth, orderController.getOrders);
router.post('/order/:orderId', auth, orderController.isDelivered);
//여러개주문
router.post('/order/store/:storeId', auth, orderController.order2);
router.post('/order/store/:storeId/menu/:menuId', auth, orderController.order);

module.exports = router;
