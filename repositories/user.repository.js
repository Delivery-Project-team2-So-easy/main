const { User } = require('../models');

class UserRepository {
  signUp = async (
    email,
    name,
    password,
    is_seller,
    profile_img,
    address,
    business_registration_number
  ) => {
    await User.create({
      email,
      name,
      password,
      is_seller,
      profile_img,
      address,
      business_registration_number,
    });
    return;
  };

  existUser = async (email) => {
    const getUser = await User.findOne({ where: { email } });
    return getUser;
  };

  findUser = async (userId) => {
    return await User.findOne({ where: { id: userId } });
  };

  getPoint = async (userId) => {
    const user = await User.findOne({ where: { id: userId } });
    return { userPoint: user.point };
  };

  pointDeduction = async (userId, point) => {
    await User.update({ point }, { where: { id: userId } });
    return;
  };

}

module.exports = UserRepository;
