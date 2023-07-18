const express = require('express');
const cookieParser = require('cookie-parser');
// const userRouter = require('./routes/user.route.js');
// const storeRouter = require('./routes/store.route.js');
const reviewRouter = require('./routes/review.route.js');
// const orderRouter = require('./routes/order.route.js');

const app = express();
const PORT = 3000;
const db = require('./models');

app.set('port', PORT);

db.sequelize.sync({});
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', [reviewRouter]);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('알 수 없는 에러가 발생했습니다.');
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트로 서버 실행');
});
