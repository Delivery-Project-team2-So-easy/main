// 데이터 렌더링
const reviewContainer = document.querySelector('.review-container');
const shopContainer = document.querySelector('.shop-container');
const seller = document.querySelector('#seller');
const noSeller = document.querySelector('#noSeller');
window.addEventListener('DOMContentLoaded', () => {
  getProfile();
});
reviewContainer.addEventListener('click', (e) => {
  reviewModify(e);
});

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
    location.href = '/';
  }
  if (e.target.className == 'order-button') {
    location.href = '/';
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
    .then((data) => {
      if (data.errorMessage) {
        alert(data.errorMessage);
      }
      const profile = document.querySelector('.profile');
      const myProfile = data.data;
      if (myProfile.profileImg == null) {
        myProfile.profileImg = `https://i.namu.wiki/i/Ln7MiLrZm65kiItiQWdvJQpIaRJ5NZpvg9XZ08hFBTai0imKv6UaRRFCYUefmKOP8rdCwdBiwOm_aFTYo6Ib7A.webp`;
      }
      if (myProfile.is_seller) {
        myProfile.is_seller = '판매자';
      } else {
        myProfile.is_seller = '소비자';
      }
      let temp_html = `
    <img
      src="${myProfile.profileImg}"
    />
    <div>
    <h2>이름 : ${myProfile.name}</h2>
    <p>이메일 : ${myProfile.email}</p>
    <p>가입 유형 : ${myProfile.is_seller}</p>
    <p>주소 : ${myProfile.address}</p>
    <p>내 포인트 : ${myProfile.point}</p>
  </div>
  `;
      profile.innerHTML = temp_html;

      if (myProfile.is_seller == '소비자') {
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
            console.log(data);
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
      if (myProfile.is_seller == '판매자') {
        noSeller.style.display = 'none';
        const storeProfile = document.querySelector('.shop-container');
        const myStoreProfile = data.data.Store;
        if (myStoreProfile.store_img == null) {
          myStoreProfile.store_img = `https://d2u3dcdbebyaiu.cloudfront.net/uploads/atch_img/309/59932b0eb046f9fa3e063b8875032edd_crop.jpeg`;
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
