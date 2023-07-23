// const params = new URLSearchParams(window.location.search);
// const storeId = params.get('storeId');

let currentUserId = 0;

$(document).ready(async () => {
  getBookmarks();

  await $.ajax({
    method: 'GET',
    url: '/userInfo',
    success: (data) => {
      currentUserId = data.userId;
    },
  });
});

const printStores = document.querySelector('.store-section');

// 좋아요한 매장 불러오기
async function getBookmarks(userId) {
  currentUserId = userId;
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
