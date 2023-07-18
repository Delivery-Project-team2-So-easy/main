const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/store.controller');
const storeController = new StoreController();

// router.post('/store/registration', storeController.postStore);
// router.patch('/store/registration', storeController.updateStore);
// router.delete('/store/registration', storeController.deleteStore);
// router.post('/store/registration', storeController.postMenu);
// router.patch('/store/menu/:menuId', storeController.updateMenu);
// router.delete('/store/menu/:menuId', storeController.deleteMenu);

// router.get('/store', storeController.getAllStores);
// router.get('/store/:storeId', storeController.getDetailStore);
// router.get('/store/search', storeController.searchStore);

module.exports = router;
