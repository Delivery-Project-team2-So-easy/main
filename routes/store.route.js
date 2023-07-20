const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/store.controller');
const storeController = new StoreController();

const authMiddleware = require('../middlewares/auth-middleware');
const uploadMiddleware = require('../middlewares/upload-middleware');

router.post('/store/registration', authMiddleware, uploadMiddleware, storeController.registerStore);
router.patch('/store/registration', authMiddleware, uploadMiddleware, storeController.updateStore);
router.delete('/store/registration', authMiddleware, storeController.deleteStore);
router.post('/store/menu', authMiddleware, uploadMiddleware, storeController.registerMenu);
router.patch('/store/menu/:menuId', authMiddleware, uploadMiddleware, storeController.updateMenu);
router.delete('/store/menu/:menuId', authMiddleware, storeController.deleteMenu);
router.get('/store/:storeId/menus', authMiddleware, storeController.getAllMenuInfo);

router.get('/store/', storeController.getStore);
router.get('/store/:storeId', storeController.getStoreDetail);
router.post('/store/search', storeController.search);
router.get('/stores/ranking', storeController.getStoreRanking);
router.get('/stores/reorderRanking', storeController.getReorderRanking);

module.exports = router;
