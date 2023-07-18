const { Review, Review_like } = require('../models');
const { Op } = require('sequelize');

class ReviewRepository {
  getReviews = async (store_id) => {
    const reviews = await Review.findAll({
      where: { store_id },
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

  getReviewDetail = async (store_id, review_id) => {
    const getReviewDetail = await Review.findOne({
      where: {
        [Op.and]: [{ store_id }, { review_id }],
      },
    });
    return getReviewDetail;
  };

  postReview = async (user_id, store_id, order_id, review, rating, review_img) => {
    const postReview = await Review.create({
      user_id: user_id,
      store_id: store_id,
      order_id: order_id,
      review,
      rating,
      review_img,
    });

    return postReview;
  };

  updateReview = async (review, rating, review_img, review_id) => {
    const updateReview = await Review.update(
      { review, rating, review_img },
      { where: { review_id } }
    );

    return updateReview;
  };

  deleteReview = async (review_id) => {
    const deleteReview = await Review.destory({ where: { review_id } });

    return deleteReview;
  };

  likeReview = async (user_id, review_id) => {
    const duplicateCheck = await Review_like.findOne({
      where: {
        [Op.and]: [{ user_id }, { review_id }],
      },
    });

    if (duplicateCheck) {
      await duplicateCheck.destroy();
      const likeCount = await Review_like.count({ where: { review_id } });
      return { message: '좋아요 취소', likeCount };
    }

    await Review_like.create({ user_id, review_id });
    const likeCount = await Review_like.count({ where: { review_id } });
    return { message: '좋아요 완료', likeCount };
  };
}

module.exports = ReviewRepository;
