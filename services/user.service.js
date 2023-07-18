require('dotenv').config(); // process.env 쓰려면 필요한건가 ?? 옙 저는 이거 쓰고 사용합니다

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
    isSeller,
    profileImg,
    address,
    businessRegistrationNumber
  ) => {
    try {
      const existUserData = await this.userRepository.existUser(email);
      if (existUserData == null) {
        await this.userRepository.signUp(
          email,
          name,
          password,
          isSeller,
          profileImg,
          address,
          businessRegistrationNumber
        );
        return { code: 201, message: '회원 가입을 축하합니다.' };
      } else {
        return { code: 409, errorMessage: '이미 존재하는 이메일입니다.' };
      }
    } catch (err) {
      console.log(err);
      return { code: 500, errorMessage: '요청한 데이터 형식이 올바르지 않습니다.' };
    }
  };

  login = async (email, password) => {
    try {
      const checkUser = await this.userRepository.existUser(email);
      if (!checkUser || checkUser.password !== password) {
        return { code: 404, errorMessage: '이메일 또는 패스워드를 입력해주세요.' };
      }
      const token = jwt.sign(
        {
          userId: checkUser.id,
        },
        env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      return { token, code: 200, message: '로그인 성공하였습니다.' };
    } catch (err) {
      console.log(err);
      return { code: 500, errorMessage: '로그인에 실패했습니다.' };
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
      await transporter.sendMail({
        from: env.EMAIL_USER, // sender address
        to: email, // list of receivers
        subject: '회원가입 인증 메일', // Subject line
        text: `인증 번호: ${authNumber}`, // plain text body
        html: `<b>인증 번호: ${authNumber}</b>`, // html body
      });
      return { code: 200, message: '인증 메시지를 발송했습니다.' };
    } catch (err) {
      console.log(err);
      return { code: 500, errorMessage: err };
    }
  };
}

module.exports = UserService;
