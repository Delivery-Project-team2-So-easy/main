const express = require('express');
const router = express.Router();
const reviewRouter = require('./review.route');
const StoreController = require('../controllers/store.controller');
const storeController = new StoreController();

//auth 미들웨어 추가 필요
router.post('/registration', storeController.registerStore);
//auth 미들웨어 추가 필요
router.patch('/registration', storeController.updateStore);
//auth 미들웨어 추가 필요
router.delete('/registration', storeController.deleteStore);
//auth 미들웨어 추가 필요
router.post('/menu', storeController.registerMenu);
//auth 미들웨어 추가 필요
router.patch('/menu/:menuId', storeController.updateMenu);
//auth 미들웨어 추가 필요
router.delete('/menu/:menuId', storeController.deleteMenu);

module.exports = router;
