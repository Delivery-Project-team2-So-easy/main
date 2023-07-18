const UserRepository = require('../repositories/user.repository');
const jwt = require('jsonwebtoken');

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
    }
  };
}

module.exports = UserService;
