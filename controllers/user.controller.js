const UserService = require("../services/user.service");

class UserController {
  userService = new UserService();
}

module.exports = UserController;
