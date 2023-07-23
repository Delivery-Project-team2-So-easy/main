const { Store_like, Review_like, Store } = require('../models');
const { Op, Sequelize } = require('sequelize');

class LikeRepository {
  existUserLike = async (userId, storeId) => {
    const existLike = await Store_like.findOne({
      where: {
        [Op.and]: [{ user_id: userId }, { store_id: storeId }],
      },
    });
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

  getMyLike = async (userId) => {
    const getMyLike = await Store_like.findAll({
      where: { user_id: userId },
      attributes: [
        'store_id',
        [
          Sequelize.literal(
            `(SELECT store_name FROM stores WHERE stores.id = Store_like.store_id)`
          ),
          'storeName',
        ],
        [
          Sequelize.literal(`(SELECT store_img FROM stores WHERE stores.id = Store_like.store_id)`),
          'storeImg',
        ],
        [
          Sequelize.literal(`(SELECT COUNT(*) FROM stores WHERE stores.id = Store_like.store_id)`),
          'likes',
        ],
      ],
      include: [
        {
          model: Store,
          attributes: [],
        },
      ],
    });
    return getMyLike;
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
