const express = require('express');
const db = require('./models');
const app = express();
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.route');
const storeRouter = require('./routes/store.route');
const reviewRouter = require('./routes/review.route.js');

app.set('port', process.env.PORT || 3000);

db.sequelize.sync({});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', [userRouter, storeRouter]);
// app.use('/', indexRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('알 수 없는 에러가 발생했습니다.');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트로 서버 실행');
});
