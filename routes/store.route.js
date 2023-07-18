const express = require('express');
const router = express.Router();
const reviewRouter = require('./review.route');
const StoreController = require('../controllers/store.controller');
const storeController = new StoreController();

router.use('/:storeId/reviews', reviewRouter);
router.get('/', storeController.getStore);
router.get('/:storeId', storeController.getStoreDetail);
router.post('/search', storeController.search);

module.exports = router;
