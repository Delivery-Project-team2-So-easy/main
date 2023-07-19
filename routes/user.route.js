const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userController = new UserController();

const authMiddleware = require('../middlewares/auth-middleware');
const uploadMiddleware = require('../middlewares/upload-middleware');

router.post('/users/signup', uploadMiddleware, userController.signUp);
router.post('/users/login', userController.login);
router.post('/users/logout', authMiddleware, userController.logout);
router.patch('/users', authMiddleware, userController.updateUser);
router.post('/users/checkEmail', userController.checkEmail);
router.post('/user/store/:storeId/like', authMiddleware, userController.storeLike);

module.exports = router;
