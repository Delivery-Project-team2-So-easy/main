const express = require('express');
const cookieParser = require('cookie-parser');
const { Server } = require('http');
const userRouter = require('./routes/user.route.js');
const storeRouter = require('./routes/store.route.js');
const reviewRouter = require('./routes/review.route.js');
const orderRouter = require('./routes/order.route.js');
const errorHandler = require('./error.js');
const db = require('./models');

const app = express();
const http = Server(app);

db.sequelize.sync({ force: false });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('assets'));
app.use('/', [userRouter, storeRouter, reviewRouter, orderRouter]);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('알 수 없는 에러가 발생했습니다.');
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

module.exports = http;
