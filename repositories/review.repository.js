const { Review } = require('../models');
const { Op } = require('sequelize');

class ReviewRepository {
  getReviews = async (storeId) => {
    const reviews = await Review.findAll({
      where: { store_id: storeId },
      include: [
        {
          model: User,
          attributes: ['name'],
        },
      ],
    });

    const getReviews = reviews.map((review) => {
      return {
        reviewId: review.review_id,
        userId: review.user_id,
        name: review.User.name,
        review: review.review,
        rating: review.rating,
        foodImg: review.review_img,
        createdAt: review.created_at,
        updatedAt: review.updated_at,
      };
    });

    return getReviews;
  };

  getReviewDetail = async (storeId, reviewId) => {
    const getReviewDetail = await Review.findOne({
      where: {
        [Op.and]: [{ store_id: storeId }, { id: reviewId }],
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
    if (!reviewImg.length) {
      const updateReview = await Review.update({ review, rating }, { where: { id: reviewId } });

      return updateReview;
    } else {
      const updateReview = await Review.update(
        { review, rating, review_img: reviewImg },
        { where: { id: reviewId } }
      );

      return updateReview;
    }
  };

  deleteReview = async (reviewId) => {
    const deleteReview = await Review.destroy({ where: { id: reviewId } });

    return deleteReview;
  };
}

module.exports = ReviewRepository;
