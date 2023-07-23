const errorHandler = require('../errorHandler');
const ReviewService = require('../services/review.service');

class ReviewController {
  reviewService = new ReviewService();

  getReviews = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const getReviews = await this.reviewService.getReviews(storeId, res);

      return res.status(200).json({ reviews: getReviews });
    } catch (err) {
      next(err);
    }
  };

  getReviewDetail = async (req, res, next) => {
    try {
      const user = res.locals.user;
      const { storeId, reviewId } = req.params;

      const result = await this.reviewService.getReviewDetail(user.id, storeId, reviewId);

      return res
        .status(result.code)
        .json({ data: result.data, checkPermission: result.checkPermission });
    } catch (err) {
      next(err);
    }
  };

  postReview = async (req, res, next) => {
    try {
      const user = res.locals.user;
      const { storeId } = req.params;
      const { review, rating } = req.body;
      let filepath = req.file ? req.file.location : null;
      const reviewImg = filepath
        ? `<img src="${filepath}" class="postImage" alt="../image/defaultImage.jpg" />`
        : '';

      await this.reviewService.postReview(user.id, storeId, review, rating, reviewImg);

      return res.status(201).json({ message: '리뷰를 등록하였습니다.' });
    } catch (err) {
      next(err);
    }
  };

  updateReview = async (req, res, next) => {
    try {
      const user = res.locals.user;
      const { storeId, reviewId } = req.params;
      const { review, rating } = req.body;

      let filepath = req.file ? req.file.location : null;
      const reviewImg = filepath
        ? `<img src="${filepath}" class="postImage" alt="../image/defaultImage.jpg" />`
        : '';

      if (!review && !filepath) throw errorHandler.emptyContent;

      await this.reviewService.updateReview(review, rating, user.id, storeId, reviewId, reviewImg);

      return res.status(201).json({ message: '리뷰를 수정하였습니다.' });
    } catch (err) {
      next(err);
    }
  };

  deleteReview = async (req, res, next) => {
    try {
      const user = res.locals.user;
      const { storeId, reviewId } = req.params;

      const deleteReview = await this.reviewService.deleteReview(user.id, storeId, reviewId);

      return res.status(deleteReview.code).json({ message: deleteReview.message });
    } catch (err) {
      next(err);
    }
  };

  likeReview = async (req, res, next) => {
    try {
      const user = res.locals.user;
      const { storeId, reviewId } = req.params;

      const likeReview = await this.reviewService.likeReview(user.id, storeId, reviewId);

      return res.status(likeReview.code).json({
        message: likeReview.message,
        likeCount: likeReview.likeCount,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ReviewController;
