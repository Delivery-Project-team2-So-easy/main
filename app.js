const express = require('express');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/user.route.js');
const storeRouter = require('./routes/store.route.js');
const reviewRouter = require('./routes/review.route.js');
const orderRouter = require('./routes/order.route.js');

const app = express();
const PORT = 3000;
const db = require('./models');

app.set('port', PORT);

db.sequelize.sync({});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('assets')); //정적파일 사용하기 위해, assets의 html, css, js, 이미지 등
app.use('/', [userRouter, storeRouter, reviewRouter, orderRouter]);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('알 수 없는 에러가 발생했습니다.');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트로 서버 실행');
});
