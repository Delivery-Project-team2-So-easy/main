const { Review, Review_like } = require('../models');
const { Op } = require('sequelize');

class ReviewRepository {
  getReviews = async (storeId) => {
    const reviews = await Review.findAll({
      where: { store_id: storeId },
      // include: [
      //   {
      //     model: User,
      //     attributes: ['name'],
      //   },
      // ],
    });

    const getReviews = reviews.map((review) => {
      return {
        review_id: review.review_id,
        // user_id: review.user_id,
        name: review.User.name,
        review: review.review,
        rating: review.rating,
        food_img: review.review_img,
        created_at: review.created_at,
        updated_at: review.updated_at,
      };
    });

    return getReviews;
  };

  getReviewDetail = async (storeId, reviewId) => {
    const getReviewDetail = await Review.findOne({
      where: {
        [Op.and]: [{ store_id: storeId }, { review_id: reviewId }],
      },
    });
    return getReviewDetail;
  };

  postReview = async (userId, storeId, orderId, review, rating, review_img) => {
    const postReview = await Review.create({
      user_id: userId,
      store_id: storeId,
      order_id: orderId,
      review,
      rating,
      review_img,
    });

    return postReview;
  };

  updateReview = async (review, rating, reviewId, reviewImg) => {
    if (reviewImg === null) {
      const updateReview = await Review.update(
        { review, rating },
        { where: { review_id: reviewId } }
      );

      return updateReview;
    } else {
      const updateReview = await Review.update(
        { review, rating, review_img: reviewImg },
        { where: { review_id: reviewId } }
      );

      return updateReview;
    }
  };

  deleteReview = async (reviewId) => {
    const deleteReview = await Review.destory({ where: { review_id: reviewId } });

    return deleteReview;
  };

  likeReview = async (userId, reviewId) => {
    const duplicateCheck = await Review_like.findOne({
      where: {
        [Op.and]: [{ user_id: userId }, { review_id: reviewId }],
      },
    });

    if (duplicateCheck) {
      await duplicateCheck.destroy();
      const likeCount = await Review_like.count({ where: { review_id: reviewId } });
      return { message: '좋아요 취소', likeCount };
    }

    await Review_like.create({ user_id: userId, review_id: reviewId });
    const likeCount = await Review_like.count({ where: { review_id: reviewId } });
    return { message: '좋아요 완료', likeCount };
  };
}

module.exports = ReviewRepository;
