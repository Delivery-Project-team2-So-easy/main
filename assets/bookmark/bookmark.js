const registerAddressBtn = document.querySelector('#registerAddressBtn');
const addressInput = document.querySelector('#userAddress');
let currentUserId = 0;

$(document).ready(async () => {
  await getUserInfo();
  getBookmarks();
});

async function getUserInfo() {
  await $.ajax({
    type: 'GET',
    url: '/userInfo',
    success: (data) => {
      currentUserId = data.userId;
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

const printStores = document.querySelector('.store-section');

// 좋아요한 매장 불러오기
async function getBookmarks() {
  await $.ajax({
    method: 'GET',
    url: `/user/store/likeStores`,
    success: (data) => {
      let stores = data.stores;
      let result = [];

      stores.forEach((store) => {
        let Img = '';
        store.storeImg
          ? (Img = `<img src="${store.storeImg}" class="post-image" alt="../images/store.png" />`)
          : (Img = '<img src="../images/store.png" id="preview" class="store-image" />');

        result += ` <div class="store-card">
                      <div class="store-container" >
                      <h4 id="store-name">${store.storeName}</h4>
                        ${Img}
                      <span id="like-btn" storeId="${store.store_id}" onclick="confirmDelete(this)">❤</span>
                      </div>
                    </div>
                     `;
      });
      printStores.innerHTML = result;
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.responseJSON.errorMessage,
      });
    },
  });
}

// 좋아요 취소 함수
async function deleteLike(storeId) {
  try {
    await $.ajax({
      method: 'POST',
      url: `/user/store/${storeId}/like`,
      success: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message,
        }).then(() => {
          window.location.href = `/bookmark/bookmark.html`;
        });
      },
      error: () => {},
    });
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.responseJSON.errorMessage,
    });
  }
}

// 좋아요 삭제 버튼을 눌렀을 때 호출되는 함수
async function confirmDelete(span) {
  const storeId = span.getAttribute('storeId');

  const result = await Swal.fire({
    icon: 'warning',
    title: '정말로 좋아요를 취소하시겠습니까?',
    showCancelButton: true,
    confirmButtonText: '예',
    cancelButtonText: '아니오',
  });

  if (result.isConfirmed) {
    try {
      await deleteLike(storeId);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.responseJSON.errorMessage,
      });
    }
  } else {
    // 사용자가 '아니오'를 눌렀을 경우
    // 아무 작업 없음
  }
}

function openKakaoAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.querySelector('#userAddress').value = data.address;
    },
  }).open();
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

function openMypage() {
  window.open(`../mypage/mypage-customer.html?userId=${currentUserId}`, '_self');
}

function openMyorder() {
  window.open(`../order/order.html`, '_self');
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
