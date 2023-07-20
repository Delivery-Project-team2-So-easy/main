const socketIo = require('socket.io');
const http = require('./app.js');

const io = socketIo(http);
const socketIdMap = {};

function initSocket(socket) {
  socketIdMap[socket.id] = null;
  console.log('새로운 소켓이 연결됨');

  function watchEvent(event, func) {
    socket.on(event, func);
  }

  function notifyToStoreOwner(socketId, event, data) {
    io.to(socketId).emit(event, data);
  }

  function notifyToCustomer(socketId, event, data) {
    io.to(socketId).emit(event, data);
  }
  //소켓아이디, store_id가 user_id가 같은것만
  return {
    //고객이 주문(사장한테 전달)
    watchOrder: () => {
      watchEvent('ORDER', (data) => {
        const payload = {
          storeId: data.storeId,
          menuId: data.menuId,
          totalPrice: data.total_price,
          quantity: data.quantity,
          address: data.address,
          option: data.option,
          date: new Date().toISOString(),
        };

        console.log('클라이언트가 주문한 데이터 ', data);
        notifyToStoreOwner('STORE_OWNER', payload);
      });
    },

    //사장이 배달완료를 누름(고객한테 전달)
    watchDelivered: () => {
      watchEvent('DELIVERED', (data) => {
        const payload = {
          storeId: data.storeId,
          menuId: data.menuId,
          date: new Date().toISOString(),
        };

        console.log('사장이 배달 완료를 누른 데이터 ', data);
        notifyToCustomer('CUSTOMER', payload);
      });
    },

    //고객이 주문을 취소 신청 했을 때(사장한테 전달)
    watchRefundRequest: () => {
      watchEvent('REFUND_REQUEST', (data) => {
        const payload = {
          orderId: data.id,
          date: new Date().toISOString(),
        };
        console.log('고객의 환불 요청에 대한 데이터', data);
        notifyToStoreOwner('STORE_OWNER', payload);
      });
    },

    //사장이 환불 요청에 대한 응답을 했을 때(고객한테 전달)
    watchRefundResponse: () => {
      watchEvent('REFUND_RESPONSE', (data) => {
        const payload = {
          orderId: data.id,
          date: new Date().toISOString(),
        };
        console.log('환불 요청에 대한 응답 데이터', data);
        notifyToCustomer('CUSTOMER', payload);
      });
    },
  };
}
io.on('connection', (sock) => {
  const { watchOrder, watchDelivered, watchRefundRequest, watchRefundResponse } = initSocket(sock);

  watchOrder();
  watchDelivered();
  watchRefundRequest();
  watchRefundResponse();
});
