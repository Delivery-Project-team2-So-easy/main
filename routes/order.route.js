const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const orderController = new OrderController();
const auth = require('../middlewares/auth-middleware');

router.post('/order/store/:storeId/menu/:menuId', auth, orderController.order);
router.get('/order', auth, orderController.getOrders);
router.post('/order/:orderId', auth, orderController.isDelivered);

module.exports = router;
