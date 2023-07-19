const { Store_like, Review_like } = require('../models');
const { Op } = require('sequelize');

class LikeRepository {
  existUserLike = async (userId, storeId) => {
    const existLike = await Store_like.findOne({ where: { user_id: userId, store_id: storeId } });
    return existLike;
  };

  createUserLike = async (userId, storeId) => {
    await Store_like.create({ user_id: userId, store_id: storeId });
    return;
  };

  deleteUserLike = async (userId, storeId) => {
    await Store_like.destroy({ where: { user_id: userId, store_id: storeId } });
    return;
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

module.exports = LikeRepository;
