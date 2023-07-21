require('dotenv').config();

const UserRepository = require('../repositories/user.repository');
const StoreRepository = require('../repositories/store.repository');
const LikeRepository = require('../repositories/like.repository');
const ReviewRepository = require('../repositories/review.repository');
const OrderRepository = require('../repositories/order.repository');
const errorHandler = require('../errorHandler');
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
  reviewRepository = new ReviewRepository();
  orderRepository = new OrderRepository();

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
        throw errorHandler.existEmail;
      }
    } catch (err) {
      throw err;
    }
  };

  login = async (email, password) => {
    try {
      const checkUser = await this.userRepository.existUser(email);
      if (!checkUser) throw errorHandler.checkUser;

      const match = await bcrypt.compare(password, checkUser.password);
      if (!match) throw errorHandler.checkUser;

      const token = jwt.sign(
        {
          userId: checkUser.id,
        },
        env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      return { token, code: 200, message: '로그인 성공하였습니다.' };
    } catch (err) {
      throw err;
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
      return { code: 200, message: '인증 메시지를 발송했습니다.', data: authNumber };
    } catch (err) {
      throw err;
    }
  };

  storeLike = async (storeId, res) => {
    try {
      const user = res.locals.user;
      const existStore = await this.storeRepository.findStoreById(storeId);
      if (!existStore) throw errorHandler.nonExistStore;

      const existLike = await this.likeRepository.existUserLike(user.id, storeId);
      if (!existLike) {
        await this.likeRepository.createUserLike(user.id, storeId);
        return { code: 200, message: '매장을 내 즐겨 찾기에 추가 하였습니다.' };
      }
      await this.likeRepository.deleteUserLike(user.id, storeId);
      return { code: 200, message: '매장을 내 즐겨 찾기에서 취소 하였습니다.' };
    } catch (error) {
      throw err;
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
      throw err;
    }
  };

  getUserDetails = async (userId) => {
    try {
      const userDetail = await this.userRepository.findUser(userId);
      return { code: 200, data: userDetail };
    } catch (err) {
      throw err;
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
        throw errorHandler.existEmail;
      }
    } catch (err) {
      throw err;
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
    } catch (err) {
      throw err;
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
        console.error(userRequest);
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
        throw errorHandler.nonToken;
      }
    } catch (err) {
      throw err;
    }
  };

  getMyReviews = async (userId) => {
    try {
      const myReviews = await this.reviewRepository.getMyReviews(userId);

      if (!myReviews) throw errorHandler.nonExistReview;

      return myReviews;
    } catch (err) {
      throw err;
    }
  };

  getMyOrders = async (userId) => {
    try {
      const myOrders = await this.orderRepository.getMyOrders(userId);

      if (!myOrders) throw errorHandler.noOrder;

      return myOrders;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = UserService;
