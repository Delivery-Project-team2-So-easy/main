const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const orderController = new OrderController();
const auth = require('../middlewares/auth-middleware');

router.get('/order', auth, orderController.getOrders);
router.post('/order/:orderId', auth, orderController.isDelivered);
router.post('/order/:orderId/refundRequest', auth, orderController.refundRequestOrder);
router.get('/order/:orderId/refundComplete', auth, orderController.refundComplete);
router.get('/order/:orderId/refundRefuse', auth, orderController.refundRefuse);

//여러개주문
router.post('/order/store/:storeId', auth, orderController.orderMany);
router.post('/order/store/:storeId/menu/:menuId', auth, orderController.order);

module.exports = router;
