const socketIo = require('socket.io');
const http = require('./app.js');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const errorHandler = require('./errorHandler.js');
require('dotenv').config();
const env = process.env;
let loginList = {};

const io = socketIo(http, {
  cors: {
    origin: '*',
    method: ['GET', 'POST'],
  },
});

io.use((socket, next) => {
  cookieParser()(socket.request, socket.response || {}, next);
}).on('connection', async (sock) => {
  try {
    console.log('소켓 연결');
    const { authorization } = await sock.request.cookies;
    const token = authorization.split(' ')[1];
    if (!token) return;

    const decode = jwt.verify(token, env.JWT_SECRET_KEY);
    loginList[sock.id] = decode.userId;

    const {
      watchOrder,
      watchDelivered,
      watchRefundRequest,
      watchRefundComplete,
      watchRefundRefuse,
    } = initSocket(sock);

    console.log(loginList);

    watchOrder();
    watchDelivered();
    watchRefundRequest();
    watchRefundComplete();
    watchRefundRefuse();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return errorHandler.expireToken;
    console.log('토큰 만료');
    return errorHandler.socketError;
  }

  sock.on('disconnect', () => {
    delete loginList[sock.id];
  });
});

function initSocket(socket) {
  function watchEvent(event, func) {
    socket.on(event, func);
  }

  function notifyToUser(socketId, event, data) {
    let user = [];
    for (let key in loginList) {
      if (loginList[key] === socketId) user.push(key);
    }
    user.forEach((sock) => {
      io.to(sock).emit(event, { data });
    });
  }

  return {
    //고객이 주문(사장한테 전달)
    watchOrder: () => {
      watchEvent('ORDER', (data) => {
        const payload = {
          ownerId: data.userId,
          address: data.address,
          totalPrice: data.totalPrice,
          date: new Date().toISOString(),
        };

        console.log('클라이언트가 주문한 데이터 ', data);
        notifyToUser(data.userId, 'STORE_OWNER', payload);
      });
    },

    //사장이 배달완료를 누름(고객한테 전달)
    watchDelivered: () => {
      watchEvent('DELIVERED', (data) => {
        const payload = {
          date: new Date().toISOString(),
        };

        console.log('사장이 배달 완료를 누른 데이터 ', data);
        notifyToUser(data.userId, 'CUSTOMER', payload);
      });
    },

    //고객이 주문을 취소 신청 했을 때(사장한테 전달)
    watchRefundRequest: () => {
      watchEvent('REFUND_REQUEST', (data) => {
        const payload = {
          ownerId: data.userId,
          status: data.status,
          orderId: data.orderId,
          date: new Date().toISOString(),
        };
        console.log('고객의 환불 요청에 대한 데이터', data);
        notifyToUser(data.userId, 'REFUND_REQUEST_OWNER', payload);
      });
    },

    //사장이 환불 요청에 대한 승인을 했을 때(고객한테 전달)
    watchRefundComplete: () => {
      watchEvent('REFUND_COMPLETE', (data) => {
        const payload = {
          point: data.point,
          date: new Date().toISOString(),
        };
        console.log('환불 요청 승인에 대한 응답 데이터', data);
        notifyToUser(data.userId, 'REFUND_COMPLETE_CUSTOMER', payload);
      });
    },

    //사장이 환불 요청에 대한 거절을 했을 때(고객한테 전달)
    watchRefundRefuse: () => {
      watchEvent('REFUND_REFUSE', (data) => {
        const payload = {
          date: new Date().toISOString(),
        };
        console.log('환불 요청 거절에 대한 응답 데이터', data);
        notifyToUser(data.userId, 'REFUND_REFUSE_CUSTOMER', payload);
      });
    },
  };
}
