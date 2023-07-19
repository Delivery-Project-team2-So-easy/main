const ReviewRepository = require('../repositories/review.repository');
const StoreRepository = require('../repositories/store.repository');
const OrderRepository = require('../repositories/order.repository');
const LikeRepository = require('../repositories/like.repository');

class ReviewService {
  reviewRepository = new ReviewRepository();
  storeRepository = new StoreRepository();
  orderRepository = new OrderRepository();
  likeRepository = new LikeRepository();

  getReviews = async (storeId) => {
    try {
      const findStore = await this.storeRepository.findStoreById(storeId);
      const getReviews = await this.reviewRepository.getReviews(storeId);

      if (!findStore) {
        return { code: 404, errorMessage: '해당 매장이 존재하지 않습니다.' };
      }
      return getReviews;
    } catch (err) {
      console.error(err);
      return { code: 500, errorMessage: '리뷰 조회에 실패하였습니다.' };
    }
  };

  postReview = async (userId, storeId, review, rating, review_img) => {
    try {
      const findStore = await this.storeRepository.findStoreById(storeId);
      const existOrder = await this.orderRepository.existOrder(userId, storeId);
      const existReview = await this.reviewRepository.findReviewById(storeId, userId);

      if (existReview) {
        return { code: 400, errorMessage: '해당 주문에 대한 리뷰를 이미 작성하셨습니다.' };
      } else if (!review || !rating) {
        return { code: 400, errorMessage: '리뷰와 평점을 모두 입력해주세요.' };
      } else if (!existOrder) {
        return { code: 400, errorMessage: '주문 내역이 없어 리뷰를 작성 할 수 없습니다.' };
      } else if (!findStore) {
        return { code: 404, errorMessage: '해당 매장이 존재하지 않습니다.' };
      }
      await this.reviewRepository.postReview(
        userId,
        storeId,
        existOrder.id,
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

  updateReview = async (review, rating, userId, storeId, reviewId, reviewImg) => {
    try {
      const findStore = await this.storeRepository.findStoreById(storeId);
      const getReviewDetail = await this.reviewRepository.getReviewDetail(storeId, reviewId);

      if (!findStore) {
        return { code: 404, errorMessage: '해당 매장이 존재하지 않습니다.' };
      } else if (!getReviewDetail) {
        return { code: 404, errorMessage: '해당 리뷰가 존재하지 않습니다.' };
      } else if (!review || !rating) {
        return { code: 400, errorMessage: '리뷰와 평점을 모두 입력해주세요' };
      } else if (getReviewDetail.user_id != userId) {
        return { code: 401, errorMessage: '리뷰수정 권한이 없습니다.' };
      } else if (getReviewDetail.review === review && getReviewDetail.rating === rating) {
        return { code: 400, errorMessage: '수정하려는 정보가 없습니다' };
      }
      await this.reviewRepository.updateReview(review, rating, reviewId, reviewImg);
      return true;
    } catch (err) {
      console.error(err);
      return { code: 500, errorMessage: '리뷰 수정에 실패하였습니다.' };
    }
  };

  deleteReview = async (userId, storeId, reviewId) => {
    try {
      const findStore = await this.storeRepository.findStoreById(storeId);
      const getReviewDetail = await this.reviewRepository.getReviewDetail(storeId, reviewId);

      if (!findStore) {
        return { code: 404, errorMessage: '해당 매장이 존재하지 않습니다.' };
      } else if (!getReviewDetail) {
        return { code: 404, errorMessage: '해당 리뷰가 존재하지 않습니다.' };
      } else if (getReviewDetail.user_id != userId) {
        return { code: 401, errorMessage: '리뷰삭제 권한이 없습니다.' };
      }
      await this.reviewRepository.deleteReview(reviewId);
      return { code: 200, message: '리뷰를 삭제하였습니다.' };
    } catch (err) {
      console.error(err);
      return { code: 500, errorMessage: '리뷰 삭제에 실패하였습니다.' };
    }
  };

  likeReview = async (userId, storeId, reviewId) => {
    try {
      const getReviewDetail = await this.reviewRepository.getReviewDetail(storeId, reviewId);

      if (!getReviewDetail) {
        return { code: 404, errorMessage: '해당 리뷰가 존재하지 않습니다.' };
      }
      const likeReview = await this.likeRepository.likeReview(userId, reviewId);
      return { code: 200, message: likeReview.message, likeCount: likeReview.likeCount };
    } catch (err) {
      console.error(err);
      return { code: 500, errorMessage: '리뷰 좋아요에 실패하였습니다.' };
    }
  };
}

module.exports = ReviewService;
