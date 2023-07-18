const express = require('express');
const router = express.Router();
const reviewRouter = require('./review.route');
const StoreController = require('../controllers/store.controller');
const storeController = new StoreController();

router.use('/:storeId/reviews', reviewRouter);
router.use('/', storeController.getStore);
router.use('/:storeId', storeController.getStoreDetail);

module.exports = router;
