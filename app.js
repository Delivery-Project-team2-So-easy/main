const express = require('express');
const cookieParser = require('cookie-parser');
const { Server } = require('http');
const userRouter = require('./routes/user.route.js');
const storeRouter = require('./routes/store.route.js');
const reviewRouter = require('./routes/review.route.js');
const orderRouter = require('./routes/order.route.js');
const errorHandler = require('./errorHandler.js');
const db = require('./models');

const app = express();
const http = Server(app);

db.sequelize.sync({ force: false });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('assets')); //정적파일 사용하기 위해, assets의 html, css, js, 이미지 등
app.use('/', [userRouter, storeRouter, reviewRouter, orderRouter]);

app.use(async (err, req, res, next) => {
  const { status, errorMessage } = await err;
  console.error(errorMessage);

  res.status(status || 500).json({ errorMessage: errorMessage || '서버 오류가 발생했습니다.' });
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = http;
