const http = require('./app.js');
require('./socket.js');
const Port = 3000;

http.listen(Port, () => {
  console.log(Port, '번 포트로 서버 실행');
});
