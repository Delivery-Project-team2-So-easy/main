const express = require("express");
const router = express.router();
const UserController = require("../controllers/UserController");
const userController = new UserController();

router.route("/");
module.exports = router;
