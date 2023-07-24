const registerAddressBtn = document.querySelector('#registerAddressBtn');
const addressInput = document.querySelector('#userAddress');
let userId;
const params = new URLSearchParams(window.location.search);
const storeId = params.get('storeId');
//메뉴 불러오기
window.addEventListener('DOMContentLoaded', async () => {
  fetch(`/store/${storeId}/menus`, {})
    .then((response) => response.json())
    .then((data) => {
      if (!storeId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: '비정상적인 접근입니다.',
        }).then(() => {
          window.location.href = '/';
        });
      }
      const menu_list = document.querySelector('.menu-list');
      const menus = data.menus;
      if (data.menus.length === 0) {
        const menuList = document.querySelector('.menuList');
        menuList.innerHTML = `<h2 class="noMenu">메뉴 정보가 없습니다! </h2>`;
      } else {
        menus.forEach((menu) => {
          let menu_id = menu.id;
          let menu_name = menu.menu;
          let menu_img = menu.menu_img;
          let menu_price = menu.price;
          let menu_option = menu.option;

          menu_img === null ? (menu_img = '../images/noimage.png') : menu_img;
          let temp_html = `
        <div class="menu-box" id="${menu_id}">
          <img
            src="${menu_img}"
          />
          <div class="menu-details">
            <div class="menu-name">${menu_name}</div>
            <div class="menu-price">${menu_price} 원</div>
            <label style="margin:0 10px 0 10px">수량 : </label><input style="width:50px" type=number min="0" value="0" class="quantity ${menu_id}"><br>
            <label style="margin:0 10px 0 10px">옵션 : </label><select>
            <option></option>
            <option value="${menu_option}">${menu_option}</option>
            </select>
          </div>
        </div>
        `;
          menu_list.insertAdjacentHTML('beforeend', temp_html);
        });
      }
    });
  await getUserInfo();
});

async function getUserInfo() {
  await $.ajax({
    type: 'GET',
    url: '/userInfo',
    success: (data) => {
      userId = data.userId;
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

function order_menu() {
  const orders = [];

  const menuBoxs = document.querySelectorAll('.menu-list .menu-box');
  menuBoxs.forEach((menu) => {
    const menuId = menu.id;
    const quantity = menu.getElementsByTagName('input')[0].value;
    const option = menu.getElementsByTagName('select')[0].value;

    if (quantity > 0) {
      orders.push({ menuId, quantity, option });
    }
  });
  if (orders.length === 0) {
    return Swal.fire({
      icon: 'error',
      title: 'Error',
      text: '주문할 메뉴가 없습니다!',
    });
  }

  fetch(`/order/store/${storeId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orders),
  })
    .then((res) => {
      console.log(res);
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (data.errorMessage) {
        return Swal.fire({
          icon: 'error',
          title: 'Error',
          text: err.responseJSON.errorMessage,
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message,
        }).then(() => {
          window.open(`../order/order.html`, '_self');
        });
      }
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
  window.open(`../mypage/mypage.html`, '_self');
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

addressInput.addEventListener('click', openKakaoAddress);
registerAddressBtn.addEventListener('click', registerAddress);
