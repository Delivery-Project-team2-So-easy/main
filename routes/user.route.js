const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userController = new UserController();

const authMiddleware = require('../middlewares/auth-middleware');

router.post('/users/signup', userController.signUp);
router.post('/users/login', userController.login);
router.post('/users/logout', authMiddleware, userController.logout);
router.post('/users/checkEmail', userController.checkEmail);
router.post('/user/store/:storeId/like', authMiddleware, userController.storeLike);

module.exports = router;
