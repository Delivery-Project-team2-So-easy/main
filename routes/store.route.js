const express = require('express');
const router = express.Router();
const reviewRouter = require('./review.route');
const StoreController = require('../controllers/store.controller');
const storeController = new StoreController();

//auth 미들웨어 추가 필요
router.post('/store/registration', storeController.registerStore);
//auth 미들웨어 추가 필요
router.patch('/store/registration', storeController.updateStore);
//auth 미들웨어 추가 필요
router.delete('/store/registration', storeController.deleteStore);
//auth 미들웨어 추가 필요
router.post('/store/menu', storeController.registerMenu);
//auth 미들웨어 추가 필요
router.patch('/store/menu/:menuId', storeController.updateMenu);
//auth 미들웨어 추가 필요
router.delete('/store/menu/:menuId', storeController.deleteMenu);

router.get('/store', storeController.getStore);
router.get('/store/:storeId', storeController.getStoreDetail);
// router.post('/store/search', storeController.search);

module.exports = router;
