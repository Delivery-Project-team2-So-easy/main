const { User } = require('../models');

class UserRepository {
  signUp = async (
    email,
    name,
    hashPassword,
    isSeller,
    profileImg,
    address,
    businessRegistrationNumber
  ) => {
    await User.create({
      email,
      name,
      password: hashPassword,
      is_seller: isSeller,
      profile_img: profileImg,
      address,
      business_registration_number: businessRegistrationNumber,
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

  updateUser = async (
    userId,
    email,
    name,
    hashPassword,
    isSeller,
    profileImg,
    address,
    businessRegistrationNumber
  ) => {
    return await User.update(
      {
        email,
        name,
        password: hashPassword,
        is_seller: isSeller,
        profile_img: profileImg,
        address,
        business_registration_number: businessRegistrationNumber,
      },
      {
        where: { id: userId },
      }
    );
  };
}

module.exports = UserRepository;
