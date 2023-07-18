const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userController = new UserController();

router.post('/users/signup', userController.signUp);
router.post('/users/login', userController.login);
router.post('/users/checkEmail', userController.checkEmail);
module.exports = router;
