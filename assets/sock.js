const socket = io.connect('/');

async function order(event) {
  event.preventDefault();
  let ownerId = 0;
  //5번 가게에 대한 사장 id를 찾기 위함
  await $.ajax({
    type: 'GET',
    url: '/store/5',
    success: (result) => {
      const { user_id } = result.data;
      ownerId = user_id;
    },
    error: (error) => {
      alert(error.responseJSON.errorMessage);
    },
  });
  let header = {};
  const body = { price: 10000, quantity: 2 };
  await $.ajax({
    type: 'POST',
    url: '/order/store/5/menu/4',
    data: JSON.stringify(body),
    contentType: 'application/json',
    success: (result) => {
      const { message } = result;
      const { address, totalPrice } = result.data;
      header = { address, totalPrice, userId: ownerId };
      alert(message);
    },
    error: (error) => {
      alert(error.responseJSON.errorMessage);
    },
  });

  socket.emit('ORDER', header);
}

async function delivered(event) {
  event.preventDefault();
  //71~79
  let header = {};
  await $.ajax({
    type: 'GET',
    url: '/order/74',
    success: (result) => {
      const { message } = result;
      const { userId } = result.data;
      header.userId = userId;
      alert(message);
    },
    error: (error) => {
      alert(error.responseJSON.errorMessage);
    },
  });

  socket.emit('DELIVERED', header);
}

async function refundRequest(event) {
  event.preventDefault();
  let ownerId = 0;
  //5번 가게에 대한 사장 id를 찾기 위함
  await $.ajax({
    type: 'GET',
    url: '/store/5',
    success: (result) => {
      const { user_id } = result.data;
      ownerId = user_id;
    },
    error: (error) => {
      alert(error.responseJSON.errorMessage);
    },
  });
  let header = {};
  await $.ajax({
    type: 'GET',
    url: `/order/74/refundRequest`,
    success: (result) => {
      const { message } = result;
      const { status, orderId } = result.data;
      header = { status, orderId, userId: ownerId };
      alert(message);
    },
    error: (error) => {
      alert(error.responseJSON.errorMessage);
    },
  });

  socket.emit('REFUND_REQUEST', header);
}

async function refundComplete(event) {
  event.preventDefault();
  let header = {};
  await $.ajax({
    type: 'GET',
    url: '/order/72/refundComplete',
    success: (result) => {
      const { message } = result;
      const { userId, point } = result.data;
      header = { userId, point };
      alert(message);
    },
    error: (error) => {
      alert(error.responseJSON.errorMessage);
    },
  });

  socket.emit('REFUND_COMPLETE', header);
}

async function refundRefuse(event) {
  event.preventDefault();
  let header = {};
  await $.ajax({
    type: 'GET',
    url: '/order/74/refundRefuse',
    success: (result) => {
      const { message } = result;
      const { userId } = result.data;
      header = { userId };
      alert(message);
    },
    error: (error) => {
      alert(error.responseJSON.errorMessage);
    },
  });

  socket.emit('REFUND_REFUSE', header);
}

function makeOrderToOwner(customerAddress, orderTotalPrice, date, ownerId) {
  //여기서 링크는 배달 완료를 누를 수 있는 주문 페이지로 렌더링 시킨다.
  const messageHtml = `주문이 들어왔습니다! <br /> 주소 : ${customerAddress}, 주문 가격 : ${orderTotalPrice}입니다! <br />
      <a href="/mypage.html?${ownerId}" class="alert-link">주문 관리 페이지로 이동하기</a><br /> <small>(${date})</small>
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
  </button>`;
  const alt = $('#ownerAlert');
  if (alt.length) {
    alt.html(messageHtml);
  } else {
    const htmlTemp = `<div class="alert alert-sparta alert-dismissible show fade" role="alert" id="ownerAlert">${messageHtml}</div>`;
    $('body').append(htmlTemp);
  }
}

function deliveredCompleteToCustomer(date) {
  const messageHtml = `배달이 완료 되었어요! 맛있게 드세요! <br /> <small>(${date})</small>
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
  </button>`;
  const alt = $('#customerAlert');
  if (alt.length) {
    alt.html(messageHtml);
  } else {
    const htmlTemp = `<div class="alert alert-sparta alert-dismissible show fade" role="alert" id="customerAlert">${messageHtml}</div>`;
    $('body').append(htmlTemp);
  }
}

function refundRequestToOwner(status, ownerId, orderId, date) {
  if (status === 'delivered') {
    const messageHtml = `주문번호 ${orderId}번에 대한 취소 요청이 들어왔어요.  <br />
      <a href="/mypage.html?${ownerId}" class="alert-link">주문 관리 페이지로 이동하기</a><br /> <small>(${date})</small>
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
  </button>`;
    const alt = $('#ownerAlert');
    if (alt.length) {
      alt.html(messageHtml);
    } else {
      const htmlTemp = `<div class="alert alert-sparta alert-dismissible show fade" role="alert" id="ownerAlert">${messageHtml}</div>`;
      $('body').append(htmlTemp);
    }
  } else {
    //여기서 링크는 주문 취소 요청을 확인할 수 있는 주문 페이지로 렌더링 시킨다.
    const messageHtml = `주문번호 ${orderId}번 주문이 취소 되었습니다. <br /> 
      <a href="/mypage.html?${ownerId}" class="alert-link">주문 관리 페이지로 이동하기</a><br /> <small>(${date})</small>
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
  </button>`;
    const alt = $('#ownerAlert');
    if (alt.length) {
      alt.html(messageHtml);
    } else {
      const htmlTemp = `<div class="alert alert-sparta alert-dismissible show fade" role="alert" id="ownerAlert">${messageHtml}</div>`;
      $('body').append(htmlTemp);
    }
  }
}

function refundCompleteToCustomer(point, date) {
  const messageHtml = `환불 요청이 정상적으로 완료 되었습니다. 불편을 드려 죄송합니다. <br />
       ${point}포인트가 다시 입금 되었습니다. <br /> <small>(${date})</small>
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
  </button>`;
  const alt = $('#customerAlert');
  if (alt.length) {
    alt.html(messageHtml);
  } else {
    const htmlTemp = `<div class="alert alert-sparta alert-dismissible show fade" role="alert" id="customerAlert">${messageHtml}</div>`;
    $('body').append(htmlTemp);
  }
}

function refundCompleteToCustomer(date) {
  const messageHtml = `환불 요청이 거절 되었습니다. 불편을 드려 죄송합니다. <br /> <small>(${date})</small>
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
      <span aria-hidden="true">&times;</span>
  </button>`;
  const alt = $('#customerAlert');
  if (alt.length) {
    alt.html(messageHtml);
  } else {
    const htmlTemp = `<div class="alert alert-sparta alert-dismissible show fade" role="alert" id="customerAlert">${messageHtml}</div>`;
    $('body').append(htmlTemp);
  }
}

socket.on('STORE_OWNER', (result) => {
  const { ownerId, address, totalPrice, date } = result.data;
  makeOrderToOwner(address, totalPrice, date, ownerId);
});

socket.on('CUSTOMER', (result) => {
  const { date } = result.data;
  deliveredCompleteToCustomer(date);
});

socket.on('REFUND_REQUEST_OWNER', (result) => {
  const { status, ownerId, orderId, date } = result.data;
  refundRequestToOwner(status, ownerId, orderId, date);
});

socket.on('REFUND_COMPLETE_CUSTOMER', (result) => {
  const { point, date } = result.data;
  refundCompleteToCustomer(point, date);
});

socket.on('REFUND_REFUSE_CUSTOMER', (result) => {
  const { date } = result.data;
  refundCompleteToCustomer(date);
});
