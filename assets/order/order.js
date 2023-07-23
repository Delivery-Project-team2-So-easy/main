const registerAddressBtn = document.querySelector('#registerAddressBtn');
const addressInput = document.querySelector('#userAddress');
const clientDiv = document.querySelector('#clientDiv');
const ownerDiv = document.querySelector('#ownerDiv');

let orderUserId;
let isSeller = false;

$(document).ready(async () => {
  await getUserInfo();
  await getClientOrderInfo();
  await getOwnerOrderInfo();
});

async function getUserInfo() {
  await $.ajax({
    type: 'GET',
    url: '/userInfo',
    success: (data) => {
      isSeller = data.isSeller;
      orderUserId = data.userId;
      if (isSeller === true) {
        document.querySelector('#ownerDiv').style.display = 'block';
        document.querySelector('#ownerDivHeader').style.display = 'block';
      }
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.errorMessage,
      }).then(() => {
        window.location.href = '/';
      });
    },
  });
}

async function getClientOrderInfo() {
  await $.ajax({
    type: 'GET',
    url: '/clientOrder',
    success: (data) => {
      let results = data.orders;
      let orders = [];
      results.forEach((order, idx) => {
        let time = order.create_at.split('.')[0].split('T');
        if (order.order_status === 'cancelled' || order.order_status === 'refundRequest') {
          orders += `   <div class="card">
                        <div class="card-header">No.${idx + 1} ${
            order.store_name
          }가게 주문 정보</div>
                        <div class="card-body">
                          <p><label class='orderStatus'>주문 상태 :</label> ${
                            order.order_status
                          }</p>
                          <p><label class='orderStatus'>주문 금액 :</label> ${
                            order.total_price
                          } 원<p>
                          <p><label class='orderStatus'>주소 :</label> ${order.address}</p>
                          <label class='orderStatus'>주문 일자 :</label> ${time[0]}  ${time[1]}
                        </div>
                      </div>
                  `;
        } else {
          orders += `   <div class="card">
                          <div class="card-header">No.${idx + 1} ${
            order.store_name
          }가게 주문 정보</div>
                          <div class="card-body">
                            <p><label class='orderStatus'>주문 상태 :</label> ${
                              order.order_status
                            }</p>
                            <p><label class='orderStatus'>주문 금액 :</label> ${
                              order.total_price
                            } 원<p>
                            <p><label class='orderStatus'>주소 :</label> ${order.address}</p>
                            <label class='orderStatus'>주문 일자 :</label> ${time[0]}  ${time[1]}
                              <button type="button" onclick="refundRequest(this)" class="btn btn-outline-danger" orderId="${
                                order.id
                              }" id="refundBtn">주문 취소</button>
                              <button type="button" onclick="goReview(this)" class="btn btn-outline-warning"  storeId="${
                                order.store_id
                              }" id="reviewBtn">리뷰 쓰기</button>
                          </div>
                        </div>
                    `;
        }
      });
      clientDiv.innerHTML = orders;

      if (results.length === 0) {
        clientDiv.innerHTML = '<h2 class="noOrder">주문 정보가 없습니다! </h2>';
      }
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.errorMessage,
      });
    },
  });
}

async function getOwnerOrderInfo() {
  if (isSeller === false) return;

  await $.ajax({
    type: 'GET',
    url: '/ownerOrder',
    success: (data) => {
      let results = data.orders;
      let orders = [];
      results.forEach((order, idx) => {
        let time = order.create_at.split('.')[0].split('T');
        if (order.order_status === 'not_delivered') {
          orders += `
                        <div class="card">
                        <div class="card-header">No.${idx + 1} ${
            order.store_name
          }가게 주문 정보</div>
                        <div class="card-body">
                            <p><label class='orderStatus'>주문 상태 :</label> ${
                              order.order_status
                            }</p>
                            <p><label class='orderStatus'>주문 금액 :</label> ${
                              order.total_price
                            } 원<p>
                            <p><label class='orderStatus'>주소 :</label> ${order.address}</p>
                            <label class='orderStatus'>주문 일자 :</label> ${time[0]}  ${time[1]}
                            <button type="button" onclick="orderDelivered(this)" class="btn btn-outline-success" orderId="${
                              order.id
                            }" id="Delivered">배달 완료</button>
                        </div>
                        </div>
                    `;
        } else if (order.order_status === 'refundRequest') {
          orders += `
                        <div class="card">
                        <div class="card-header">No.${idx + 1} ${
            order.store_name
          }가게 주문 정보</div>
                        <div class="card-body">
                            <p><label class='orderStatus'>주문 상태 :</label> ${
                              order.order_status
                            }</p>
                            <p><label class='orderStatus'>주문 금액 :</label> ${
                              order.total_price
                            } 원<p>
                            <p><label class='orderStatus'>주소 :</label> ${order.address}</p>
                            <label class='orderStatus'>주문 일자 :</label> ${time[0]}  ${time[1]}
                            <button type="button" onclick="refundRefuse(this)" class="btn btn-outline-danger" orderId="${
                              order.id
                            }" id="refundDeny">취소 거부</button>
                            <button type="button" onclick="refundComplete(this)" class="btn btn-outline-info" orderId="${
                              order.id
                            }" id="refundSuccess">취소 승인</button>
                        </div>
                        </div>
                    `;
        } else {
          orders += `
                      <div class="card">
                      <div class="card-header">No.${idx + 1} ${order.store_name}가게 주문 정보</div>
                      <div class="card-body">
                          <p><label class='orderStatus'>주문 상태 :</label> ${
                            order.order_status
                          }</p>
                          <p><label class='orderStatus'>주문 금액 :</label> ${
                            order.total_price
                          } 원<p>
                          <p><label class='orderStatus'>주소 :</label> ${order.address}</p>
                          <p><label class='orderStatus'>주문 일자 :</label> ${time[0]}  ${
            time[1]
          }</p>
                      </div>
                      </div>
                  `;
        }
      });
      ownerDiv.innerHTML = orders;
      if (results.length === 0) {
        ownerDiv.innerHTML =
          '<h2 class="noOrder">가게 정보가 없습니다. 매장부터 등록해 주세요. </h4>';
      }
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.errorMessage,
      });
    },
  });
}

function registerAddress(event) {
  event.preventDefault();
  const address = document.querySelector('#userAddress').value;
  $.ajax({
    type: 'POST',
    url: '/users/updateAddress',
    data: { address },
    success: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      });
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.errorMessage,
      });
    },
  });
}

function home() {
  window.location.href = '/';
}

function openKakaoAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.querySelector('#userAddress').value = data.address;
    },
  }).open();
}

function openMypage() {
  window.open(`../mypage/mypage-customer.html?userId=${orderUserId}`, '_self');
}

function openBookmark() {
  window.open(`../bookmark/bookmark.html`, '_self');
}

function logout() {
  $.ajax({
    type: 'POST',
    url: '/users/logout',
    success: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      }).then(() => {
        window.location.href = '/';
      });
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.errorMessage,
      });
    },
  });
}

function goReview(id) {
  const storeId = id.getAttribute('storeId');
  window.open(`../review/review.html?storeId=${storeId}`, '_self');
}

function refundRequest(id) {
  const orderId = id.getAttribute('orderId');

  $.ajax({
    type: 'GET',
    url: `/order/${orderId}/refundRequest`,
    success: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      }).then(() => {
        window.location.reload();
      });
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.errorMessage,
      });
    },
  });
}

function refundComplete(id) {
  const orderId = id.getAttribute('orderId');
  $.ajax({
    type: 'GET',
    url: `/order/${orderId}/refundComplete`,
    success: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      }).then(() => {
        window.location.reload();
      });
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.errorMessage,
      });
    },
  });
}

function refundRefuse(id) {
  const orderId = id.getAttribute('orderId');
  $.ajax({
    type: 'GET',
    url: `/order/${orderId}/refundRefuse`,
    success: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      }).then(() => {
        window.location.reload();
      });
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.errorMessage,
      });
    },
  });
}

function orderDelivered(id) {
  const orderId = id.getAttribute('orderId');
  $.ajax({
    type: 'GET',
    url: `/order/${orderId}`,
    success: (data) => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: data.message,
      }).then(() => {
        window.location.reload();
      });
    },
    error: (error) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.responseJSON.errorMessage,
      });
    },
  });
}

addressInput.addEventListener('click', openKakaoAddress);
registerAddressBtn.addEventListener('click', registerAddress);
