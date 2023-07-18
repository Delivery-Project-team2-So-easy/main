require('dotenv').config(); // process.env 쓰려면 필요한건가 ??

const UserRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');
const env = process.env;
const nodemailer = require('nodemailer');

class UserService {
  userRepository = new UserRepository();

  signUp = async (
    email,
    name,
    password,
    is_seller,
    profile_img,
    address,
    business_registration_number
  ) => {
    try {
      const existUserData = await this.userRepository.existUser(email);
      if (existUserData == null) {
        await this.userRepository.signUp(
          email,
          name,
          password,
          is_seller,
          profile_img,
          address,
          business_registration_number
        );
        return { code: 200, message: `가입을 축하합니다.` };
      } else {
        return { code: 409, message: '이미 존재하는 email 입니다.' };
      }
    } catch (err) {
      console.log(err);
      return { code: 500, message: err };
    }
  };

  login = async (email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        return { code: 400, message: '비밀번호와 확인비밀번호가 다릅니다.' };
      }
      const checkUser = await this.userRepository.existUser(email);
      if (!checkUser || checkUser.password !== password) {
        return { code: 404, message: 'email 또는 password를 확인해주세요' };
      }
      const token = jwt.sign(
        {
          userId: checkUser.userId,
        },
        'customized_secret_key'
      );

      return { token, code: 200, message: '로그인 성공하였습니다.' };
    } catch (err) {
      console.log(err);
      return { code: 500, message: err };
    }
  };

  checkEmail = async (email) => {
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
      return { code: 200, message: '인증 메시지를 발송했습니다.' };
    } catch (err) {
      console.log(err);
      return { code: 500, message: err };
    }
  };
}

module.exports = UserService;
