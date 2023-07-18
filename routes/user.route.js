const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const userController = new UserController();

router.post('/users/signup', userController.signup);
router.post('/users/login', userController.login);
module.exports = router;
