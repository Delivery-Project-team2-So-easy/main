const registerAddressBtn = document.querySelector('#registerAddressBtn');
const addressInput = document.querySelector('#userAddress');
// 데이터 렌더링
const reviewContainer = document.querySelector('.review-container');
const shopContainer = document.querySelector('#storeProfile');
const seller = document.querySelector('#seller');
const noSeller = document.querySelector('#noSeller');
let userId;
let isSeller = false;
window.addEventListener('DOMContentLoaded', async () => {
  await getUserInfo();
  if (isSeller) {
    await getStoreInfo();
  }
  getProfile();
});
window.addEventListener('DOMContentLoaded', () => {
  modify();
});
reviewContainer.addEventListener('click', (e) => {
  reviewModify(e);
});

async function getUserInfo() {
  await $.ajax({
    type: 'GET',
    url: '/userInfo',
    success: (data) => {
      userId = data.userId;
      isSeller = data.isSeller;
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

async function getStoreInfo() {
  await $.ajax({
    type: 'GET',
    url: '/myStore',
    success: (result) => {
      const { data } = result;
      if (!data) {
        seller.innerHTML = `<div class="noStore">
                              <h2 >등록된 매장 정보가 없습니다! </h2>
                              <button type="button" class="btn btn-outline-primary" onclick="registrationStore()">매장 등록하기</button>
                            </div>`;
      } else {
        let Img = '';
        data.store_img
          ? (Img = `<img src="${data.store_img}" class="storeImage" alt="../images/store.png" />`)
          : (Img = '<img src="../images/store.png" id="priview" class="storeImage" />');
        seller.innerHTML = `   <div class="card">
                                <div class="card-header">매장이름 : ${data.store_name}</div>
                                      <div class="card-body">
                                        <p><label class='orderStatus'>주소 :</label> ${data.store_address}</p>
                                        <p><label class='orderStatus'>개업 일자 :</label> ${data.opening_date}<p>
                                          <button type="button" onclick="deleteStore(this)" class="btn btn-outline-danger" storeId="${data.id}" id="refundBtn">매장 삭제</button>
                                          <button type="button" onclick="updateStore(this)" class="btn btn-outline-warning"  storeId="${data.id}" id="reviewBtn">매장 정보 수정</button>
                                      </div>
                                    </div>
  `;
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

function registrationStore() {
  window.open('../store-management/store-management.html', '_self');
}

shopContainer.addEventListener('click', (e) => {
  const registerButton = document.querySelector('.register-button');
  const editButton = document.querySelector('.edit-button');
  const menuButton = document.querySelector('.menu-button');
  const orderButton = document.querySelector('.order-button');
  // 페이지 이동
  if (e.target.className == 'register-button') {
    location.href = '/';
  }
  if (e.target.className == 'edit-button') {
    location.href = '/';
  }
  if (e.target.className == 'menu-button') {
    location.href = '../menu/menu.html';
  }
  if (e.target.className == 'order-button') {
    location.href = '../order/order.html';
  }
});

const getProfile = () => {
  fetch('/userDetails', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then(async (data) => {
      if (data.errorMessage) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.responseJSON.errorMessage,
        }).then(() => {
          window.location.href = '/';
        });
      }
      const profile = document.querySelector('.profile');
      const myProfile = await data.data;
      console.log(myProfile);
      if (!myProfile.profile_img) {
        myProfile.profile_img = `https://i.namu.wiki/i/Ln7MiLrZm65kiItiQWdvJQpIaRJ5NZpvg9XZ08hFBTai0imKv6UaRRFCYUefmKOP8rdCwdBiwOm_aFTYo6Ib7A.webp`;
      }
      if (myProfile.is_seller) {
        myProfile.is_seller = 'Owner';
      } else {
        myProfile.is_seller = 'Client';
      }
      let temp_html = `
    <img
      src="${myProfile.profile_img}"
    />
    <div>
    <h2>이름 : ${myProfile.name}</h2>
    <p>이메일 : ${myProfile.email}</p>
    <p>가입 유형 : ${myProfile.is_seller}</p>
    <p>주소 : ${myProfile.address}</p>
    <p>내 포인트 : ${myProfile.point}</p>
    <button type="button" onclick="updateUserInfo(this)" class="btn btn-outline-secondary"  userId="${userId}" id="userUpdateBtn">내 정보 수정</button>
  </div>
  `;
      profile.innerHTML = temp_html;

      if (myProfile.is_seller == 'Client') {
        seller.style.display = 'none';
        fetch('/myReviews', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const reviewContainer = document.querySelector('.review-container');
            const myReviews = data.reviews;
            let temp = '';
            myReviews.map((review) => {
              let temp_html = `
        <div class="review" id="${review.id}">
          <img src="${review.Store.store_img}"/>
          <h3 id=${review.store_id}>${review.Store.store_name}</h3>
          <p>내 리뷰 : ${review.review}</p>
          <p>${review.rating} 점 </p>
          <div class="button-container">
            <button class="edit-button">수정</button>
            <button class="delete-button">삭제</button>
          </div>
        </div>
      `;
              temp = temp + temp_html;
            });
            reviewContainer.innerHTML = temp;
          });
      }
      if (myProfile.is_seller == 'Owner') {
        noSeller.style.display = 'none';
        const storeProfile = document.querySelector('.shop-container');
        const myStoreProfile = data.data.Store;
        if (myStoreProfile.profile_img == null) {
          myStoreProfile.profile_img = `https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg`;
        }
        let temp_html_v2 = `
    <img
      class="shop-image"
      src="${myStoreProfile.store_img}"
      alt="${myStoreProfile.store_img}"
    />
    <div class="shop-name">${myStoreProfile.store_name}</div>
    <button class="register-button">상점 등록</button>
    <button class="edit-button">상점 수정</button>
    <button class="menu-button">메뉴 관리</button>
  <button class="order-button">주문 조회</button>
      `;
        storeProfile.innerHTML = temp_html_v2;

        fetch('/order', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const orderContainer = document.querySelector('.order-Container');

            const orders = data.orders;
            let temp = '';
            orders.map((order) => {
              let temp_html = `
              <div class="order">
                <div>
                  <span class="order-label">배달 메뉴:</span>
                  <span>${order.id}</span>
                </div>
                <div>
                  <span class="order-label">주소:</span>
                  <span>${order.address}</span>
                </div>
                <div>
                  <span class="order-label">가격:</span>
                  <span>${order.total_price}</span>
                </div>
                <div class="order"><span>${order.order_status}</span></div>
              </div>`;
              temp = temp + temp_html;
            });
            orderContainer.innerHTML = temp;
          });
      }
    });
};
function deleteStore(id) {
  const storeId = id.getAttribute('storeId');

  $.ajax({
    method: 'DELETE',
    url: '/store/registration',
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

const reviewModify = (e) => {
  const storeId = e.target.parentElement.parentElement.querySelector('h3').id;
  const reviewId = e.target.parentElement.parentElement.id;

  if (e.target.className == 'edit-button') {
    // 수정 버튼 누를 시
    const editModalContainer = document.getElementById('editModalContainer');
    const saveBtn = document.getElementById('saveBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const reviewInput = document.getElementById('reviewInput');
    const ratingInput = document.getElementById('ratingInput');

    editModalContainer.style.display = 'flex';

    saveBtn.addEventListener('click', () => {
      // 수정-확인
      // 수정 api
      fetch(`/store/${storeId}/review/${reviewId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          review: reviewInput.value,
          rating: ratingInput.value,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.errorMessage) {
            alert(data.errorMessage);
          }
          alert(data.message);
          window.location.reload();
        });
    });
    cancelBtn.addEventListener('click', () => {
      // 수정-취소
      editModalContainer.style.display = 'none';
    });
  }
  if (e.target.className == 'delete-button') {
    // 삭제 버튼 누를 시
    const deleteModalContainer = document.getElementById('deleteModalContainer');
    const checkBtn = document.getElementById('checkBtn');
    const deleteCancelBtn = document.getElementById('deleteCancelBtn');

    deleteModalContainer.style.display = 'flex';
    checkBtn.addEventListener('click', () => {
      // 삭제 - 확인
      fetch(`/store/${storeId}/review/${reviewId}`, {
        method: 'DELETE',
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.errorMessage) {
            alert(data.errorMessage);
          }
          alert(data.message);
          window.location.reload();
        });
    });
    deleteCancelBtn.addEventListener('click', () => {
      // 삭제-취소
      deleteModalContainer.style.display = 'none';
    });
  }
};

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

addressInput.addEventListener('click', openKakaoAddress);
registerAddressBtn.addEventListener('click', registerAddress);
