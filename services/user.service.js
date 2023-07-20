require('dotenv').config();

const UserRepository = require('../repositories/user.repository');
const StoreRepository = require('../repositories/store.repository');
const LikeRepository = require('../repositories/like.repository');
const jwt = require('jsonwebtoken');
const env = process.env;
const bcrypt = require('bcrypt');
const salt = 12;
const nodemailer = require('nodemailer');
const { User } = require('../models');

class UserService {
  userRepository = new UserRepository();
  storeRepository = new StoreRepository();
  likeRepository = new LikeRepository();

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
      const hashPassword = await bcrypt.hash(password, salt);
      const existUserData = await this.userRepository.existUser(email);
      if (existUserData == null) {
        await this.userRepository.signUp(
          email,
          name,
          hashPassword,
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
      if (!checkUser)
        return { code: 412, errorMessage: '회원가입되지 않은 이메일이거나 비밀번호가 다릅니다.' };

      const match = await bcrypt.compare(password, checkUser.password);
      if (!match)
        return { code: 412, errorMessage: '회원가입되지 않은 이메일이거나 비밀번호가 다릅니다.' };

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

  storeLike = async (storeId, res) => {
    try {
      const user = res.locals.user;
      const existStore = await this.storeRepository.findStoreById(storeId);
      if (!existStore) return { code: 404, errorMessage: '해당 매장이 없습니다.' };

      const existLike = await this.likeRepository.existUserLike(user.id, storeId);
      if (!existLike) {
        await this.likeRepository.createUserLike(user.id, storeId);
        return { code: 200, message: '매장을 내 즐겨 찾기에 추가 하였습니다.' };
      }
      await this.likeRepository.deleteUserLike(user.id, storeId);
      return { code: 200, message: '매장을 내 즐겨 찾기에서 취소 하였습니다.' };
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: '매장 즐겨찾기에 실패 했습니다.' };
    }
  };


  getMyLike = async (userId) => {
    try {
      const getMyLike = await this.likeRepository.getMyLike(userId);

      if (!getMyLike) {
        return { code: 404, errorMessage: '즐겨찾기에 추가된 매장이 없습니다.' };
      }
      return getMyLike;
    } catch (err) {
      console.error(err);
      return { code: 500, errorMessage: '즐겨찾기 조회에 실패했습니다.' };
    }
  };

  updateUser = async (
    userId,
    email,
    name,
    password,
    isSeller,
    profileImg,
    address,
    businessRegistrationNumber
  ) => {
    try {
      const hashPassword = await bcrypt.hash(password, salt);
      const existUserData = await this.userRepository.existUser(email);
      if (existUserData == null) {
        await this.userRepository.updateUser(
          userId,
          email,
          name,
          hashPassword,
          isSeller,
          profileImg,
          address,
          businessRegistrationNumber
        );
        return { code: 201, message: '데이터가 수정되었습니다.' };
      } else {
        return { code: 409, errorMessage: '이미 존재하는 이메일입니다.' };
      }
    } catch (err) {
      console.log(err);
      return { code: 500, errorMessage: '요청한 데이터 형식이 올바르지 않습니다.' };
    }
  };

  kakaoLogin = async () => {
    try {
      const baseUrl = 'https://kauth.kakao.com/oauth/authorize';
      const config = {
        client_id: env.KAKAO_CLIENT_ID,
        redirect_uri: env.KAKAO_REDIRECT_URI,
        response_type: 'code',
      };
      const params = new URLSearchParams(config).toString();
      const finalUrl = `${baseUrl}?${params}`;
      return { code: 200, data: finalUrl };
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: 'kakao 로그인에 접근할 수 없습니다' };
    }
  };

  kakaoCallBack = async (code) => {
    try {
      const baseUrl = 'https://kauth.kakao.com/oauth/token';
      const config = {
        client_id: env.KAKAO_CLIENT_ID,
        client_secret: env.KAKAO_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: env.KAKAO_REDIRECT_URI,
        code,
      };
      const params = new URLSearchParams(config).toString(); //URL 형식으로 변환
      const finalUrl = `${baseUrl}?${params}`;
      const kakaoTokenRequest = await (
        await fetch(finalUrl, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json', // 이 부분을 명시하지않으면 text로 응답을 받게됨
          },
        })
      ).json();
      // 토큰 받기
      if ('access_token' in kakaoTokenRequest) {
        // 엑세스 토큰이 있는 경우 API에 접근
        const { access_token } = kakaoTokenRequest;
        const userRequest = await (
          await fetch('https://kapi.kakao.com/v2/user/me', {
            headers: {
              Authorization: `Bearer ${access_token}`,
              'Content-type': 'application/json',
            },
          })
        ).json();
        console.log(userRequest);
        const kakaoEmail = userRequest.kakao_account.email + '/kakao';
        const exUser = await User.findOne({
          where: { email: kakaoEmail },
        });
        if (exUser) {
          const token = jwt.sign(
            {
              userId: exUser.id,
            },
            env.JWT_SECRET_KEY,
            { expiresIn: '1h' }
          );
          return { token, code: 200, message: '로그인 성공하였습니다.' };
        } else {
          return { data: kakaoEmail, code: 200, message: '신규회원가입을 진행합니다.' };
        }
      } else {
        return { code: 409, errorMessage: '토큰이 존재하지 않습니다' };
      }
    } catch (error) {
      console.error(error);
      return { code: 500, errorMessage: 'kakao 로그인에 접근할 수 없습니다' };
    }
  };
}

module.exports = UserService;
