const errorHandler = require('../errorHandler');
const UserService = require('../services/user.service');
const querystring = require('querystring');
const Joi = require('joi');
class UserController {
  userService = new UserService();

  signUp = async (req, res, next) => {
    try {
      const profileImg = req.file ? req.file.location : null;

      const { email, name, password, confirmPassword, isSeller, address } = req.body;
      let { businessRegistrationNumber } = req.body;
      // if (!email || !name || !password || !confirmPassword || !address)
      //   throw errorHandler.emptyContent;

      // const emailName = email.split('@')[0];
      // if (password.length < 4 || emailName.includes(password)) throw errorHandler.passwordFormat;

      // if (password !== confirmPassword) throw errorHandler.checkPassword;

      if (Boolean(isSeller) === true) {
        if (!businessRegistrationNumber) throw errorHandler.emptyContent;

        if (businessRegistrationNumber.includes('-')) {
          businessRegistrationNumber = businessRegistrationNumber.split('-').join('') / 1;
        } else {
          businessRegistrationNumber = businessRegistrationNumber / 1;
        }
        if (!businessRegistrationNumber) throw errorHandler.businessRegistrationNumber;
      }

      const result = await this.userService.signUp(
        email,
        name,
        password,
        isSeller,
        profileImg,
        address,
        businessRegistrationNumber
      );

      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      next(err);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw errorHandler.emptyContent;

      const result = await this.userService.login(email, password);

      res.cookie('authorization', `Bearer ${result.token}`);

      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      next(err);
    }
  };

  logout = async (_, res, next) => {
    try {
      const user = res.locals.user;

      res.clearCookie('authorization');
      return res.status(200).json({ message: `${user.name}님이 로그아웃 했습니다.` });
    } catch (err) {
      next(err);
    }
  };

  checkEmail = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await this.userService.checkEmail(email);

      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      next(err);
    }
  };

  isStoreLiked = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const userId = res.locals.user.id;
      const { code, result } = await this.userService.isStoreLiked(userId, storeId);
      res.status(code).json({ result });
    } catch (err) {
      next(err);
    }
  };

  userDetails = async (req, res, next) => {
    try {
      const user = res.locals.user;
      const { code, data } = await this.userService.getUserDetails(user.id);

      return res.status(code).json({ data });
    } catch (err) {
      next(err);
    }
  };
  storeLike = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const result = await this.userService.storeLike(storeId, res);

      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      next(err);
    }
  };

  getMyLike = async (_, res, next) => {
    try {
      const user = res.locals.user;
      const getMyLike = await this.userService.getMyLike(user.id);

      return res.status(200).json({ stores: getMyLike });
    } catch (err) {
      next(err);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const userId = res.locals.user.id;
      const profileImg = req.file ? req.file.location : null;

      const {
        name,
        password,
        afterPassword,
        afterConfirmPassword,
        isSeller,
        address,
        businessRegistrationNumber,
      } = req.body;

      if (!password) throw errorHandler.notEnteredPassword;

      const result = await this.userService.updateUser(
        userId,
        name,
        password,
        afterPassword,
        afterConfirmPassword,
        isSeller,
        profileImg,
        address,
        businessRegistrationNumber
      );

      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      next(err);
    }
  };

  updateAddress = async (req, res, next) => {
    try {
      const { address } = req.body;
      const userId = res.locals.user.id;
      if (!address) {
        throw errorHandler.notEnteredAddress;
      }

      const result = await this.userService.updateAddress(address, userId);

      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      next(err);
    }
  };
  kakaoAuth = async (req, res, next) => {
    try {
      const code = req.query.code;
      const result = await this.userService.kakaoAuth(code);
      if (result.token) {
        res.cookie('authorization', `Bearer ${result.token}`);
        return res.redirect('http://127.0.0.1:3000');
      }

      //session에 저장후 리다이렉션
      req.session.email = result.data.email;
      req.session.name = result.data.name;
      req.session.profileImg = result.data.profileImg;
      return res.redirect('http://127.0.0.1:3000/auth/addInfo.html');

      //쿼리스트링으로 리다이렉션하기(개인정보가 uri에 담기기 때문에 안전하지 않다 생각함)
      // const query = querystring.stringify(result.data);
      // return res.redirect('http://127.0.0.1:3000/auth/addInfo.html?' + query);
    } catch (err) {
      next(err);
    }
  };

  googleAuth = async (req, res, next) => {
    try {
      const code = req.query.code;
      const result = await this.userService.googleAuth(code);
      if (result.token) {
        res.cookie('authorization', `Bearer ${result.token}`);
        return res.redirect('http://127.0.0.1:3000');
      }

      //session에 저장후 리다이렉션
      req.session.email = result.data.email;
      req.session.name = result.data.name;
      req.session.profileImg = result.data.profileImg;
      return res.redirect('http://127.0.0.1:3000/auth/addInfo.html');
    } catch (err) {
      next(err);
    }
  };

  socialSignUp = async (req, res, next) => {
    try {
      const email = req.session.email;
      const name = req.session.name;
      const profileImg = req.session.profileImg;

      if (!email || !name || !profileImg) throw errorHandler.notExistSession;
      const { address } = req.body;
      let { isSeller, businessRegistrationNumber } = req.body;
      isSeller = Boolean(isSeller / 1);

      if (!address) throw errorHandler.notInfo;
      if (isSeller) {
        if (!businessRegistrationNumber) throw errorHandler.checkBusinessRegistrationNumber;

        if (businessRegistrationNumber.includes('-')) {
          businessRegistrationNumber = businessRegistrationNumber.split('-').join('') / 1;
        } else {
          businessRegistrationNumber = businessRegistrationNumber / 1;
        }
        if (!businessRegistrationNumber) throw errorHandler.businessRegistrationNumber;
      } else businessRegistrationNumber = null;

      const result = await this.userService.socialSignUp(
        email,
        name,
        address,
        isSeller,
        businessRegistrationNumber,
        profileImg
      );

      res.cookie('authorization', `Bearer ${result.token}`);
      res.clearCookie('social-session');
      return res.status(result.code).json({ message: result.message });
    } catch (err) {
      next(err);
    }
  };

  // kakaoLogin = async (req, res, next) => {
  //   // 카카오 로그인 페이지 동작
  //   try {
  //     const result = await this.userService.kakaoLogin();

  //     return res.redirect(result.data);
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  // kakaoCallBack = async (req, res, next) => {
  //   try {
  //     const code = req.query.code;
  //     const result = await this.userService.kakaoCallBack(code);
  //     if (result.token) {
  //       // 토큰이 있을때
  //       res.cookie('authorization', `Bearer ${result.token}`);
  //       return res.status(result.code).json({ message: result.message });
  //     } else if (result.data) {
  //       // 데이터가 있을 때
  //       return res.status(result.code).json({ message: result.message, data: result.data });
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  // kakaoSignUp = async (req, res, next) => {
  //   try {
  //     const profileImg = req.file ? req.file.location : null;
  //     const email = req.params.kakaoEmail; // 프론트측에서 kakaoCallBack 의 data를 가져와야 한다.

  //     const { name, password, confirmPassword, isSeller, address, businessRegistrationNumber } =
  //       req.body;

  //     if (!name || !password || !confirmPassword || !address) throw errorHandler.emptyContent;

  //     const emailName = email.split('@')[0];
  //     if (password.length < 4 || emailName.includes(password)) throw errorHandler.passwordFormat;

  //     if (password !== confirmPassword) throw errorHandler.checkPassword;

  //     const result = await this.userService.signUp(
  //       email,
  //       name,
  //       password,
  //       isSeller,
  //       profileImg,
  //       address,
  //       businessRegistrationNumber
  //     );

  //     return res.status(result.code).json({ message: result.message });
  //   } catch (err) {
  //     next(err);
  //   }
  // };

  getMyReviews = async (_, res, next) => {
    try {
      const user = res.locals.user;

      const getMyReviews = await this.userService.getMyReviews(user.id);

      return res.status(200).json({ myReviews: getMyReviews });
    } catch (err) {
      next(err);
    }
  };

  getMyOrders = async (_, res, next) => {
    try {
      const user = res.locals.user;

      const getMyOrders = await this.userService.getMyOrders(user.id);

      return res.status(200).json({ myOrders: getMyOrders });
    } catch (err) {
      next(err);
    }
  };

  checkUserInfo = async (_, res, next) => {
    try {
      const result = await this.userService.checkUserInfo(res);
      return res.status(200).json({ userId: result.userId, isSeller: result.isSeller });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserController;
