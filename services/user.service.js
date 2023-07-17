const UserRepository = require("../repositories/user.repository");

class UserService {
  userRepository = new UserRepository();
}

module.exports = UserService;
