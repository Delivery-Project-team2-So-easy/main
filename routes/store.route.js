const express = require('express');
const router = express.Router();
const StoreController = require('../controllers/store.controller');
const storeController = new StoreController();

router.route('/');

module.exports = router;
