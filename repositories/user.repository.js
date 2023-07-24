const { User, Store } = require('../models');
const errorHandler = require('../errorHandler');

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
    try {
      if (!userId) throw errorHandler.notExistUser;
      return await User.findOne({
        where: { id: userId },
        include: [
          {
            model: Store,
            attributes: [],
          },
        ],
      });
    } catch (err) {
      throw err;
    }
  };

  getPoint = async (userId) => {
    const user = await User.findOne({ where: { id: userId } });
    return { userPoint: user.point };
  };

  updatePoint = async (userId, point, t) => {
    await User.update({ point }, { where: { id: userId }, transaction: t });
    return;
  };

  updateUser = async (
    userId,
    name,
    password,
    isSeller,
    profileImg,
    address,
    businessRegistrationNumber
  ) => {
    if (isSeller) {
      return await User.update(
        {
          name,
          password,
          is_seller: true,
          profile_img: profileImg,
          address,
          business_registration_number: businessRegistrationNumber,
        },
        {
          where: { id: userId },
        }
      );
    } else {
      return await User.update(
        {
          name,
          password,
          is_seller: false,
          profile_img: profileImg,
          address,
          business_registration_number: null,
        },
        {
          where: { id: userId },
        }
      );
    }
  };

  updateAddress = async (address, userId) => {
    await User.update({ address }, { where: { id: userId } });
    return await User.findOne({ where: { id: userId } });
  };
}

module.exports = UserRepository;
