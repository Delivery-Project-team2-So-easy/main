const jwt = require('jsonwebtoken');
const { User } = require('../models');
const errorHandler = require('../errorHandler');
require('dotenv').config();
const env = process.env;

module.exports = async (req, res, next) => {
  try {
    const { authorization } = await req.cookies;
    const [tokenType, token] = (authorization ?? '').split(' ');

    if (tokenType !== 'Bearer' || !token) {
      next(errorHandler.notCookie);
    }

    const decodedToken = jwt.verify(token, env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      res.clearCookie('authorization');
      next(errorHandler.notExistUser);
    }

    res.locals.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.clearCookie('authorization');
      next(errorHandler.expireToken);
    }
    res.clearCookie('authorization');
    next(errorHandler.errorCookie);
  }
};
