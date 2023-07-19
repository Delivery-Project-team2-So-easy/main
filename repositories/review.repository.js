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
      order: [[Sequelize.literal('likes'), 'DESC']],
    });

    // const getReviews = reviews.map((review) => {
    //   return {
    //     reviewId: review.review_id,
    //     userId: review.user_id,
    //     name: review.User.name,
    //     review: review.review,
    //     rating: review.rating,
    //     foodImg: review.review_img,
    //     createdAt: review.created_at,
    //     updatedAt: review.updated_at,
    //   };
    // });

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
