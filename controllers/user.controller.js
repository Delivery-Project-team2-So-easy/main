const UserService = require('../services/user.service');

class UserController {
  userService = new UserService();

  signUp = async (req, res) => {
    const profileImg = req.file ? req.file.location : null;

    const { email, name, password, confirmPassword, isSeller, address } = req.body;

    const emailReg = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w)*(\.\w{2,3})+$/);

    if (!email || !name || !password || !confirmPassword)
      return res.status(400).json({
        errorMessage: '이메일, 이름, 비밀번호, 비밀번호 확인을 전부 입력해주세요.',
      });

    if (!emailReg.test(email))
      return res.status(400).json({
        errorMessage: '이메일 형식이 올바르지 않습니다. 다시 입력해 주세요.',
      });

    const emailName = email.split('@')[0];
    if (password.length < 4 || emailName.includes(password))
      return res.status(400).json({
        errorMessage: '패스워드는 4자리이상이고 이메일과 같은 값이 포함이 되면 안됩니다.',
      });

    if (password !== confirmPassword)
      return res.status(412).json({ errorMessage: '패스워드와 패스워드확인이 다릅니다.' });

    const result = await this.userService.signUp(
      email,
      name,
      password,
      isSeller,
      profileImg,
      address
    );

    if (result.errorMessage)
      return res.status(result.code).json({ errorMessage: result.errorMessage });
    return res.status(result.code).json({ message: result.message });
  };

  login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ errorMessage: '이메일 또는 패스워드를 입력해주세요.' });

    const result = await this.userService.login(email, password);
    res.clearCookie('authorization');
    res.cookie('authorization', `Bearer ${result.token}`);

    if (result.errorMessage)
      return res.status(result.code).json({ errorMessage: result.errorMessage });
    return res.status(result.code).json({ message: result.message });
  };

  checkEmail = async (req, res) => {
    const { email } = req.body;
    const result = await this.userService.checkEmail(email);

    if (result.errorMessage)
      return res.status(result.code).json({ errorMessage: result.errorMessage });
    return res.status(result.code).json({ message: result.message });
  };
}

module.exports = UserController;
