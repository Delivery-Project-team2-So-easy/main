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
}
module.exports = UserRepository;
