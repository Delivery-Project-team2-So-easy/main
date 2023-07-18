const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();
const env = process.env;
module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.cookies;
    const [tokenType, token] = authorization.split(' ');
    if (tokenType !== 'Bearer' || !token) {
      return res.status(401).json({ errorMessage: '로그인 후에 이용할 수 있는 기능입니다.' });
    }
    
    const decodedToken = jwt.verify(token, env.JWT_SECRET_KEY);
    const userId = decodedToken.userId;
    const user = await User.findOne({ where: { id: userId } });
    
    if (!user) {
      res.clearCookie('authorization');
      return res.status(401).json({ errorMessage: '토큰 사용자가 존재하지 않습니다.' });
    }
    res.locals.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      res.clearCookie('authorization');
      return res.status(401).json({
        errorMessage: '토큰이 만료된 아이디입니다. 다시 로그인 해주세요.',
      });
    }
    console.error(error);
    res.clearCookie('authorization');
    return res.status(401).json({
      errorMessage: '전달된 쿠키에서 오류가 발생하였습니다.',
    });
  }
};
