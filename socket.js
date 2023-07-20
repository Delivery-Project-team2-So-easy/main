const socketIo = require('socket.io');
const http = require('./app.js');

const io = socketIo(http);
const socketIdMap = {};

function initSocket(socket) {
  socketIdMap[socket.id] = null;
  console.log('새로운 소켓이 연결됨');

  function event(event, func) {
    socket.on(event, func);
  }

  return {
    watchChangePage: () => {
      event('HOME', (data) => {
        console.log('실행쓰?', data);
        socketIdMap[socket.id] = data;
      });
    },
  };
}
io.on('connection', (sock) => {
  const { watchChangePage, watchOrder, watchRefundApply } = initSocket(sock);

  watchChangePage();
  //   watchOrder();
  //   watchRefundApply();
});

//소켓을 써야 하는 부분
// 고객이 주문 했었을 때 (사장한테 전달) / 사장이 배달완료 눌렀을 떄 (고객에게 전달)
// 고객이 환불 신청했었을 떄 (사장에게 전달) / 사장이 환불 신청을 처리했을 때(고객에게 전달),
