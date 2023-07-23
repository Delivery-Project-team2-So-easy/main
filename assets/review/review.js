let currentUserId = 0;

$(document).ready(async () => {
  getReviews();

  await $.ajax({
    method: 'GET',
    url: '/userInfo',
    success: (data) => {
      currentUserId = data.userId;
    },
  });
});

const printReviews = document.querySelector('.review-section');
const storeId = 1;

//리뷰데이터 불러오기
async function getReviews() {
  await $.ajax({
    method: 'GET',
    url: `/store/${storeId}/reviews`,
    success: (data) => {
      let reviews = data.reviews;
      let result = [];

      reviews.forEach((review) => {
        let Img = '';
        review.review_img
          ? (Img = review.review_img)
          : (Img = '<img src="../images/noimage.png" id="default-img"/>');
        let rating = review.rating;
        let star = '⭐'.repeat(rating);

        result += `<div class="review-container" >
                    ${Img}
                    <div id="name-tag">${review.name}</div>
                    <div class="review-box" id="${review.id}" onclick="openReviewModal(this)">
                      <div id="review-tag">${review.review}</div>
                      <label id="created-review">${
                        '작성일자:' +
                        review.create_at.substring(0, 10).replace('-', '.').replace('-', '.')
                      }
                      <br>
                      <span class="rate-tag">${star}</span>
                    </div>
                    <span class="like-tag" id="${review.id}" onclick="likeReview(this)">
                    ♥좋아요${review.likes}개 </span>
                  </div>`;
      });
      printReviews.innerHTML = result;
    },
    error: (err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.responseJSON.errorMessage,
      });
    },
  });
}

async function likeReview(id) {
  const reviewId = id.getAttribute('id');
  try {
    await $.ajax({
      method: 'POST',
      url: `/store/${storeId}/review/${reviewId}/like`,
      success: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message,
        }).then(() => {
          window.location.reload();
        });
        // // updateLikeStatus(reviewId, data.likeCount);
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

// 선택된 레이팅 값을 저장할 변수 선언
let selectedRating = 0;
// 리뷰 생성시 레이팅값 설정
function setRating(rating) {
  selectedRating = rating;
  const stars = document.querySelectorAll('.star');
  stars.forEach((star, idx) => {
    if (idx < rating) {
      star.innerHTML = '★';
    } else {
      star.innerHTML = '☆';
    }
  });
}

// 리뷰수정시 레이팅값 수정
function updateRating(rating) {
  selectedRating = rating;
  const stars = document.querySelectorAll('.update-star');
  stars.forEach((star, idx) => {
    if (idx < rating) {
      star.innerHTML = '★';
    } else {
      star.innerHTML = '☆';
    }
  });
}

// 리뷰작성 모달창 열기
function openModal() {
  document.querySelector('.modal-bg-create').style.display = 'block';
  document.querySelector('#modal-wrap').style.display = 'block';
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleKeyDown);
}

// 리뷰작성 모달창 닫기
function closeModal() {
  document.querySelector('.modal-bg-create').style.display = 'none';
  document.querySelector('#modal-wrap').style.display = 'none';
  setRating(0);
  document.querySelector('#review').value = '';
  document.querySelector('#newFile').value = '';

  document.body.style.overflow = 'auto';
  document.removeEventListener('keydown', handleKeyDown);
}

// 리뷰생성
async function createReview() {
  const formData = new FormData();
  const review = document.querySelector('#review').value;
  const newFile = document.querySelector('#newFile').files[0];

  try {
    if (newFile) {
      formData.append('newFile', newFile);
    }
    formData.append('review', review);
    formData.append('rating', selectedRating);

    if (selectedRating == 0) {
      alert('별점은 최소 1점 이상 입력해주세요.');
      return;
    }

    await $.ajax({
      method: 'POST',
      url: `/store/${storeId}/review`,
      data: formData,
      processData: false,
      contentType: false,
      datatype: 'json',
      success: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message,
        }).then(() => {
          window.location.href = `/review/review.html`;
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

// 리뷰상세 모달창 열기
async function openReviewModal(id) {
  const reviewId = id.getAttribute('id');
  const modal = document.querySelector('#review-modal');

  await $.ajax({
    method: 'GET',
    url: `/store/${storeId}/review/${reviewId}`,
    success: (data) => {
      let Img = '';

      data.data.review_img
        ? (Img = data.data.review_img)
        : (Img = '<img src="../images/noimage.png" id="default-img"/>');

      const result = ` <div class="review-modal" id="modal">
                        <div class="modal-content">
                          <div class="review-content">
                            ${Img}
                            <input type="file" id="update-newFile" name="newFile" />
                            <textarea id="update-text" style="resize: none">${data.data.review}</textarea>
                            <div class="update-star-container">
                            <span class="update-star" data-rating="1" onclick="updateRating(1)">☆</span>
                            <span class="update-star" data-rating="2" onclick="updateRating(2)">☆</span>
                            <span class="update-star" data-rating="3" onclick="updateRating(3)">☆</span>
                            <span class="update-star" data-rating="4" onclick="updateRating(4)">☆</span>
                            <span class="update-star" data-rating="5" onclick="updateRating(5)">☆</span>
                            </div>
                          </div>
                          <div class="modal-buttons">
                            <button id="edit-button" reviewId="${data.data.id}" onclick="updateReview(this)">수정</button>
                            <button id="delete-button" reviewId="${data.data.id}" onclick="deleteReview(this)">삭제</button>
                            <button id="close-button" onclick="closeReviewModal()">닫기</button>
                          </div>
                        </div>
                      </div>`;
      modal.innerHTML = result;
      if (data.checkPermission === false) {
        hideButtons();
      }
      updateRating(data.data.rating);
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.responseJSON.errorMessage,
      });
    },
  });
  document.querySelector('.modal-bg-review').style.display = 'block';
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleKeyDown);
}

// 리뷰상세 모달창 닫기
function closeReviewModal() {
  const modal = document.querySelector('#review-modal');
  modal.style.display = 'none';
  document.removeEventListener('keydown', handleKeyDown);
  document.querySelector('.modal-bg-review').style.display = 'none';
  document.body.style.overflow = 'auto';
}

// 리뷰 수정
async function updateReview(button) {
  const formData = new FormData();
  const reviewId = button.getAttribute('reviewId');
  const review = document.querySelector('#update-text').value;
  const newFile = document.querySelector('#update-newFile').files[0];

  try {
    if (newFile) {
      formData.append('newFile', newFile);
    }
    formData.append('review', review);
    formData.append('rating', selectedRating);

    if (selectedRating == 0) {
      alert('별점은 최소 1점 이상 입력해주세요.');
      return;
    }

    await $.ajax({
      method: 'PATCH',
      url: `/store/${storeId}/review/${reviewId}`,
      data: formData,
      processData: false,
      contentType: false,
      datatype: 'json',
      success: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message,
        }).then(() => {
          window.location.href = `/review/review.html`;
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

// 리뷰삭제
async function deleteReview(button) {
  const reviewId = button.getAttribute('reviewId');

  try {
    await $.ajax({
      method: 'DELETE',
      url: `/store/${storeId}/review/${reviewId}`,
      success: (data) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: data.message,
        }).then(() => {
          window.location.href = `/review/review.html`;
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

function handleKeyDown(event) {
  if (event.key === 'Escape') closeModal(), closeReviewModal();
}

function hideButtons() {
  const editButton = document.querySelector('#edit-button');
  const deleteButton = document.querySelector('#delete-button');
  editButton.style.display = 'none';
  deleteButton.style.display = 'none';
}

// 여기부터는 다른거

function openKakaoAddress() {
  new daum.Postcode({
    oncomplete: function (data) {
      document.querySelector('#userAddress').value = data.address;
    },
  }).open();
}

function openMypage() {
  if (userId === 0) {
    alert('로그인 후 이용할 수 있습니다.');
  } else window.open(`../mypage/mypage-customer.html?userId=${userId}`, '_self');
}

function openBookmark() {
  if (userId === 0) {
    alert('로그인 후 이용할 수 있습니다.');
  } else window.open(`../bookmark/bookmark.html?userId=${userId}`, '_self');
}

function openSignup() {
  window.open('../auth/signup.html', '_self');
}

function openLogin() {
  window.open('../auth/login.html', '_self');
}
