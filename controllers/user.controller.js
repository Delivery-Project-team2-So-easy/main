const UserService = require('../services/user.service');
const env = process.env;
const nodemailer = require('nodemailer');

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
    const { email, password, confirmPassword } = req.body;

    const { token, code, message } = await this.userService.login(email, password, confirmPassword);
    res.cookie('authorization', `Bearer ${token}`);
    res.status(code).json({ message });
  };

  checkEmail = async (req, res) => {
    const { email } = req.body;
    const authNumber = Math.floor(100000 + Math.random() * 900000);

    try {
      // 인증메일 발송
      const transporter = nodemailer.createTransport({
        service: 'gmail', // 이메일
        auth: {
          user: env.EMAIL_USER, // 발송자 이메일
          pass: env.EMAIL_PWD, // 발송자 비밀번호
        },
      });
      // send mail with defined transport object
      const info = await transporter.sendMail({
        from: env.EMAIL_USER, // sender address
        to: email, // list of receivers
        subject: '회원가입 인증 메일', // Subject line
        text: `인증 번호: ${authNumber}`, // plain text body
        html: `<b>인증 번호: ${authNumber}</b>`, // html body
      });
      res.status(200).json({ message: '성공?' });
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = UserController;
