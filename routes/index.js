const express = require('express');
const userRouter = require('./user.route');
const storeRouter = require('./store.route');
const router = express.Router();

router.use('/users', userRouter);
router.use('/store', storeRouter);

module.exports = router;
