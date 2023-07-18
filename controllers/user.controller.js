const UserService = require('../services/user.service');

class UserController {
  userService = new UserService();

  signUp = async (req, res) => {
    const { email, name, password, is_seller, profile_img, address, business_registration_number } =
      req.body;

    const { code, message } = await this.userService.signUp(
      email,
      name,
      password,
      is_seller,
      profile_img,
      address,
      business_registration_number
    );

    res.status(code).json({ message });
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    const { token, code, message } = await this.userService.login(email, password);
    res.cookie('authorization', `Bearer ${token}`);
    res.status(code).json({ message });
  };

  checkEmail = async (req, res) => {
    const { email } = req.body;
    const { code, message } = await this.userService.checkEmail(email);
    res.status(code).json({ message });
  };
}

module.exports = UserController;
