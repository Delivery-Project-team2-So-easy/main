const registerAddressBtn = document.querySelector('#registerAddressBtn');
const addressInput = document.querySelector('#userAddress');
const searchBtn = document.querySelector('#searchBtn');
const storeCard = document.querySelector('#storeCard');
let userId;

//로그인 전 후 구분해서 해야 함(메인페이지는 userId쿼리스트링이 없고 로그인하고 메인으로 왔을 때는 쿼리스트링 값이 있음)
$(document).ready(async () => {
  await getStoreInfo();
  await getUserInfo();
  viewBtn();
});

async function getUserInfo() {
  await $.ajax({
    type: 'GET',
    url: '/userInfo',
    error: () => {
      userId = 0;
    },
    success: (data) => {
      userId = data.userId;
    },
  });
}

function viewBtn() {
  if (userId > 0) {
    document.querySelector('#mypage').style.display = 'block';
    document.querySelector('#bookmark').style.display = 'block';
    document.querySelector('#myorder').style.display = 'block';
    document.querySelector('#logout').style.display = 'block';
    document.querySelector('#signUp').style.display = 'none';
    document.querySelector('#login').style.display = 'none';
  }
}

async function getStoreInfo() {
  await $.ajax({
    type: 'GET',
    url: '/stores/reorderRanking',
    success: (result) => {
      const results = result.reorderRanking;
      let stores = [];
      results.forEach((store) => {
        let Img = '';
        store.storeImg
          ? (Img = `<img src="${store.storeImg}" class="storeImage" alt="../images/store.png" />`)
          : (Img = '<img src="../images/store.png" id="preview" class="storeImage" />');

        stores += `
                  <div class="store" >
                    <h4 class="storeName">${store.storeName}</h4>
                    <div storeDetailId=${store.storeId} onclick="storeDetail(this)">
                      ${Img} 
                    </div>
                    <label class="storeAddress">주소 : ${store.storeAddress}</label> </br>
                    <label class="storeReorder">재주문율 : ${store.reorderCount}명이 재주문 했어요!</label>
                  </div>`;
      });
      storeCard.innerHTML = stores;
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

function openKakaoAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.querySelector('#userAddress').value = data.address;
    },
  }).open();
}

function openMypage() {
  window.open(`../mypage/mypage-customer.html?userId=${userId}`, '_self');
}

function openMyorder() {
  window.open(`../order/order.html`, '_self');
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

function openSignup() {
  window.open('../auth/signup.html', '_self');
}

function openLogin() {
  window.open('../auth/login.html', '_self');
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

function searchStore() {
  const searchKeyword = document.querySelector('#searchInput').value;
  $.ajax({
    type: 'POST',
    url: '/store/search',
    data: { searchKeyword },
    success: (result) => {
      const results = result.data;
      let stores = [];

      results.forEach((store) => {
        let Img = '';
        store.store_img
          ? (Img = `<img src="${store.store_img}" class="storeImage" alt="../images/store.png" />`)
          : (Img = '<img src="../images/store.png" id="priview" class="storeImage" />');

        stores += `
                  <div class="store" >
                    <h4 class="storeName">${store.store_name}</h4>
                    <div storeDetailId=${store.id} onclick="storeDetail(this)">
                      ${Img} 
                    </div>
                    <label class="storeAddress">주소 : ${store.store_address}</label>
                    <label class="like" countStoreLike=${store.id} onclick="countLike(this)">👍 ${store.likes}</label>
                  </div>`;
      });
      storeCard.innerHTML = stores;
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

function storeDetail(id) {
  const storeId = id.getAttribute('storeDetailId');
  window.open(`../store/store.html?storeId=${storeId}`, '_self');
}

addressInput.addEventListener('click', openKakaoAddress);
registerAddressBtn.addEventListener('click', registerAddress);
searchBtn.addEventListener('click', searchStore);
