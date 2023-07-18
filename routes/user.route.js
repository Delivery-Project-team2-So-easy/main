const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userController = new UserController();

router.post('/signup', userController.signUp);
router.post('/login', userController.login);
router.post('/checkEmail', userController.checkEmail);
module.exports = router;
