const express = require('express');
const cookieParser = require('cookie-parser');
const { Server } = require('http');
const userRouter = require('./routes/user.route.js');
const storeRouter = require('./routes/store.route.js');
const reviewRouter = require('./routes/review.route.js');
const orderRouter = require('./routes/order.route.js');
const session = require('express-session');

const db = require('./models');

const app = express();
const http = Server(app);

db.sequelize.sync({ force: false });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
//세션 관리
app.use(
  session({
    secure: true,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    // cookie: {
    //   httpOnly: true,
    //   Secure: true,
    // },
    name: 'social-session',
  })
);
app.use(express.static('./assets')); //정적파일 사용하기 위해, assets의 html, css, js, 이미지 등
app.use('/', [userRouter, storeRouter, reviewRouter, orderRouter]);

app.use(async (err, req, res, next) => {
  const { status, errorMessage } = await err;
  console.error(err);

  res.status(status || 500).json({ errorMessage: errorMessage || '서버 오류가 발생했습니다.' });
});

//메인 페이지로 랜더링
app.get('/', (_, res) => {
  res.sendFile(__dirname + '/assets/main/main.html');
});

module.exports = http;
