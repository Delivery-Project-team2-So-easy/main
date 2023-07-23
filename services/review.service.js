const ReviewRepository = require('../repositories/review.repository');
const StoreRepository = require('../repositories/store.repository');
const OrderRepository = require('../repositories/order.repository');
const LikeRepository = require('../repositories/like.repository');
const errorHandler = require('../errorHandler');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;

class ReviewService {
  reviewRepository = new ReviewRepository();
  storeRepository = new StoreRepository();
  orderRepository = new OrderRepository();
  likeRepository = new LikeRepository();

  getReviews = async (storeId, res) => {
    try {
      const findStore = await this.storeRepository.findStoreById(storeId);
      const getReviews = await this.reviewRepository.getReviews(storeId);

      const token = jwt.sign(
        {
          userId: 5,
        },
        env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );
      res.cookie('authorization', `Bearer ${token}`);

      if (!findStore) throw errorHandler.nonExistStore;
      return getReviews;
    } catch (err) {
      throw err;
    }
  };

  getReviewDetail = async (userId, storeId, reviewId) => {
    try {
      const getReviewDetail = await this.reviewRepository.getReviewDetail(storeId, reviewId);
      let checkPermission = false;

      if (getReviewDetail.user_id === userId) {
        checkPermission = true;
      }

      return { code: 200, data: getReviewDetail, checkPermission };
    } catch (err) {
      throw err;
    }
  };

  postReview = async (userId, storeId, review, rating, review_img) => {
    try {
      const findStore = await this.storeRepository.findStoreById(storeId);
      const existOrder = await this.orderRepository.existOrder(userId, storeId);
      const existReview = await this.reviewRepository.findReviewById(storeId, userId);

      if (!findStore) throw errorHandler.nonExistStore;
      else if (!existOrder) throw errorHandler.noOrderHistory;
      else if (existReview) throw errorHandler.duplicateReview;
      else if (!review || !rating) throw errorHandler.emptyContent;

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
      throw err;
    }
  };

  updateReview = async (review, rating, userId, storeId, reviewId, reviewImg) => {
    try {
      const findStore = await this.storeRepository.findStoreById(storeId);
      const getReviewDetail = await this.reviewRepository.getReviewDetail(storeId, reviewId);

      if (!findStore) throw errorHandler.nonExistStore;
      else if (!getReviewDetail) throw errorHandler.nonExistReview;
      else if (getReviewDetail.user_id != userId) throw errorHandler.noPermissions;
      else if (
        getReviewDetail.review == review &&
        getReviewDetail.rating == rating &&
        getReviewDetail.review_img == reviewImg
      )
        throw errorHandler.noUpdateContent;

      await this.reviewRepository.updateReview(review, rating, reviewId, reviewImg);
      return true;
    } catch (err) {
      throw err;
    }
  };

  deleteReview = async (userId, storeId, reviewId) => {
    try {
      const findStore = await this.storeRepository.findStoreById(storeId);
      const getReviewDetail = await this.reviewRepository.getReviewDetail(storeId, reviewId);

      if (!findStore) throw errorHandler.nonExistStore;
      else if (!getReviewDetail) throw errorHandler.nonExistReview;
      else if (getReviewDetail.user_id != userId) throw errorHandler.noPermissions;

      await this.reviewRepository.deleteReview(reviewId);
      return { code: 200, message: '리뷰를 삭제하였습니다.' };
    } catch (err) {
      throw err;
    }
  };

  likeReview = async (userId, storeId, reviewId) => {
    try {
      const getReviewDetail = await this.reviewRepository.getReviewDetail(storeId, reviewId);

      if (!getReviewDetail) throw errorHandler.nonExistReview;

      const likeReview = await this.likeRepository.likeReview(userId, reviewId);
      return { code: 200, message: likeReview.message, likeCount: likeReview.likeCount };
    } catch (err) {
      throw err;
    }
  };
}

module.exports = ReviewService;
