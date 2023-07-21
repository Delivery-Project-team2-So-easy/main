const { Review, Review_like, User } = require('../models');
const { Op, Sequelize } = require('sequelize');

class ReviewRepository {
  getReviews = async (storeId) => {
    const getReviews = await Review.findAll({
      where: { store_id: storeId },
      attributes: [
        'id',
        'user_id',
        [Sequelize.literal(`(SELECT name FROM users WHERE users.id = Review.user_id)`), 'name'],
        'review',
        'rating',
        [
          Sequelize.literal(
            `(SELECT COUNT(*) From review_likes WHERE review_likes.review_id = Review.id)`
          ),
          'likes',
        ],
        'review_img',
        'create_at',
      ],
      include: [
        {
          model: User,
          attributes: [],
        },
        {
          model: Review_like,
          attributes: [],
        },
      ],
      order: [
        [Sequelize.literal('likes'), 'DESC'],
        ['create_at', 'DESC'],
      ],
    });

    return getReviews;
  };

  findReviewById = async (storeId, userId) => {
    const findReviewById = await Review.findOne({
      where: {
        [Op.and]: [{ store_id: storeId }, { user_id: userId }],
      },
    });
    return findReviewById;
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

  getMyReviews = async (userId) => {
    return await Review.findAll({
      where: { user_id: userId },
      attributes: ['id', 'store_id', 'order_id', 'review', 'rating', 'review_img', 'create_at'],
    });
  };
}

module.exports = ReviewRepository;
