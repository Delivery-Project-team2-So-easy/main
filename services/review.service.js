const ReviewRepository = require('../repositories/review.repository');

class ReviewService {
  reviewRepository = new ReviewRepository();

  getReviews = async (store_id) => {
    const getReviews = await this.reviewRepository.getReviews(store_id);

    try {
      if (!store_id) {
        return { code: 404, errorMessage: '해당 매장이 존재하지 않습니다.' };
      }
      return getReviews;
    } catch {
      return { code: 500, errorMessage: '리뷰 조회에 실패하였습니다.' };
    }
  };

  postReview = async (user_id, store_id, order_id, review, rating, review_img) => {
    try {
      if (!review || !rating) {
        return { code: 400, errorMessage: '리뷰와 평점을 모두 입력해주세요.' };
      } else if (!order_id) {
        return { code: 400, errorMessage: '주문 내역이 없어 리뷰를 작성 할 수 없습니다.' };
      } else if (!store_id) {
        return { code: 404, errorMessage: '해당 매장이 존재하지 않습니다.' };
      }
      await this.reviewRepository.postReview(
        user_id,
        store_id,
        order_id,
        review,
        rating,
        review_img
      );
      return true;
    } catch (err) {
      console.error(err);
      return { code: 500, errorMessage: '리뷰 등록에 실패했습니다.' };
    }
  };

  updateReview = async (review, rating, review_img, user_id, store_id, review_id) => {
    const getReviewDetail = await this.reviewRepository.getReviewDetail(store_id, review_id);

    try {
      if (!getReviewDetail) {
        return { code: 404, errorMessage: '해당 리뷰가 존재하지 않습니다.' };
      } else if (!store_id) {
        return { code: 404, errorMessage: '해당 매장이 존재하지 않습니다.' };
      } else if (!review || !rating) {
        return { code: 400, errorMessage: '리뷰와 평점을 모두 입력해주세요' };
      } else if (getReviewDetail.user_id != user_id) {
        return { code: 401, errorMessage: '리뷰수정 권한이 없습니다.' };
      } else if (getReviewDetail.review === review && getReviewDetail.rating === rating) {
        return { code: 400, errorMessage: '수정하려는 정보가 없습니다' };
      }
      await this.reviewRepository.updateReview(review, rating, review_img, review_id);
      return true;
    } catch {
      return { code: 500, errorMessage: '리뷰 수정에 실패하였습니다.' };
    }
  };

  deleteReview = async (user_id, store_id, review_id) => {
    const getReviewDetail = await this.reviewRepository.getReviewDetail(store_id, review_id);

    try {
      if (!getReviewDetail) {
        return { code: 404, errorMessage: '해당 리뷰가 존재하지 않습니다.' };
      } else if (!store_id) {
        return { code: 404, errorMessage: '해당 매장이 존재하지 않습니다.' };
      } else if (getReviewDetail.user_id != user_id) {
        return { code: 401, errorMessage: '리뷰삭제 권한이 없습니다.' };
      }
      await this.reviewRepository.deleteReview(review_id);
      return true;
    } catch {
      return { code: 500, errorMessage: '리뷰 삭제에 실패하였습니다.' };
    }
  };

  likeReview = async (user_id, review_id) => {
    try {
      if (!review_id) {
        return { code: 404, errorMessage: '해당 리뷰가 존재하지 않습니다.' };
      }
      const likeReview = await this.reviewRepository.likeReview(user_id, review_id);
      return { code: 200, message: likeReview.message, likeCount: likeReview.likeCount };
    } catch {
      return { code: 500, errorMessage: '리뷰 좋아요에 실패하였습니다.' };
    }
  };
}

module.exports = ReviewService;
