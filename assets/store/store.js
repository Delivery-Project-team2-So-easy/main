const registerAddressBtn = document.querySelector('#registerAddressBtn');
const addressInput = document.querySelector('#userAddress');
const params = new URLSearchParams(window.location.search);
let storeId = params.get('storeId');
let userId;
//매장정보 불러오기
window.addEventListener('DOMContentLoaded', async () => {
  fetch(`/store/${storeId}`)
    .then((response) => response.json())
    .then((data) => {
      const store_name = data.data.store_name;
      const store_img = data.data.store_img;
      const store_likes = data.data.likes;
      const temp_html = `<img class="store-img" src="${store_img}"
      />
      <div class="store-name">${store_name}</div>
      <div class="info"><i class="fa fa-heart" aria-hidden="true"></i> ${store_likes}</div>
      <i id="heart" class="mylike fa fa-heart-o fa-2x" aria-hidden="true"></i> `;
      const store_overview = document.querySelector('.store-overview');
      store_overview.insertAdjacentHTML('beforeend', temp_html);
    });
  await getUserInfo();
  viewBtn();
});

window.addEventListener('DOMContentLoaded', async () => {
  fetch(`/user/store/${storeId}/isliked`)
    .then((res) => res.json())
    .then(async (data) => {
      const heart = document.querySelector('#heart');
      if (data.result) {
        heart.classList.remove('fa-heart-o');
        heart.classList.add('fa-heart');
      }
      heart.addEventListener('click', function () {
        fetch(`/user/store/${storeId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            body: JSON.stringify({}),
          },
        }).then((res) => res.json());
        if (this.classList.contains('fa-heart-o')) {
          heart.classList.remove('fa-heart-o');
          heart.classList.add('fa-heart');
          window.location.reload();
        } else {
          heart.classList.add('fa-heart-o');
          heart.classList.remove('fa-heart');
          window.location.reload();
        }
      });
    });
});

//메뉴 불러오기
window.addEventListener('DOMContentLoaded', async () => {
  fetch(`/store/${storeId}/menus`, {})
    .then((response) => response.json())
    .then((data) => {
      if (data.menus.length === 0) {
        const menu_list = document.querySelector('.menu-list');
        menu_list.innerHTML = `<a class="goOrder" onclick="goToOrder()"><div>주문하러 가기</div></a>
                               <h2 class="noMenu">메뉴 정보가 없습니다! </h2>`;
      } else {
        const menu_list = document.querySelector('.menu-list');
        const menus = data.menus;
        menus.forEach((menu) => {
          let menu_id = menu.id;
          let menu_name = menu.menu;
          let menu_img = menu.menu_img;
          let menu_price = menu.price;
          let temp_html = `
        <div class="menu-box">
          <img
            src="${menu_img}"
          />
          <div class="menu-details">
            <div class="menu-name">${menu_name}</div>
            <div class="menu-price">${menu_price} 원</div>
          </div>
        </div>
        `;
          menu_list.insertAdjacentHTML('beforeend', temp_html);
        });
      }
    });
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

function openMyorder() {
  window.open(`../order/order.html`, '_self');
}

function openMypage() {
  window.open(`../mypage/mypage-customer.html?userId=${userId}`, '_self');
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

function goToOrder() {
  window.open(`../menu/menu.html?storeId=${storeId}`, '_self');
}

addressInput.addEventListener('click', openKakaoAddress);
registerAddressBtn.addEventListener('click', registerAddress);
