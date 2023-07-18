const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.js');
const userController = new UserController();

// router.post('/users/signup', userController.signup);
// router.post('/users/login', userController.login);

// router.post('/user/store/:storeId/like', storeController.likeStore);
// router.get('/user/store/likeStores', storeController.getLikeStores);
module.exports = router;
