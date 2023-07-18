const express = require('express');
const router = express.Router();
const userRouter = require('./user.route.js');
const storeRouter = require('./store.route.js');

router.use('/users', userRouter);
router.use('/store', storeRouter);

module.exports = router;
