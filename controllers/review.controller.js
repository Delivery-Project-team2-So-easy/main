const ReviewService = require('../services/review.service');

class ReviewController {
  reviewService = new ReviewService();

  getReviews = async (req, res) => {
    const { storeId } = req.params;
    const getReviews = await this.reviewService.getReviews(storeId);

    if (getReviews.errorMessage) {
      return res.status(getReviews.code).json({
        errorMessage: getReviews.errorMessage,
      });
    }
    return res.status(200).json({
      reviews: getReviews,
    });
  };

  postReview = async (req, res) => {
    const user = res.locals.user;
    const { storeId } = req.params;
    const { review, rating } = req.body;
    let filepath = req.file ? req.file.location : null;
    const reviewImg = filepath
      ? `<img src="${filepath}" class="postImage" alt="../image/defaultImage.jpg" />`
      : '';

    const postReview = await this.reviewService.postReview(
      user.id,
      storeId,
      review,
      rating,
      reviewImg
    );

    if (postReview.errorMessage) {
      return res.status(postReview.code).json({
        errorMessage: postReview.errorMessage,
      });
    }
    return res.status(201).json({
      message: '리뷰를 등록하였습니다.',
    });
  };

  updateReview = async (req, res) => {
    const user = res.locals.user;
    const { storeId, reviewId } = req.params;
    const { review, rating } = req.body;

    let filepath = req.file ? req.file.location : null;
    const reviewImg = filepath
      ? `<img src="${filepath}" class="postImage" alt="../image/defaultImage.jpg" />`
      : '';

    const updateReview = await this.reviewService.updateReview(
      review,
      rating,
      user.id,
      storeId,
      reviewId,
      reviewImg
    );

    if (updateReview.errorMessage) {
      return res.status(updateReview.code).json({
        errorMessage: updateReview.errorMessage,
      });
    }

    return res.status(201).json({
      message: '리뷰를 수정하였습니다.',
    });
  };

  deleteReview = async (req, res) => {
    const user = res.locals.user;
    const { storeId, reviewId } = req.params;

    const deleteReview = await this.reviewService.deleteReview(user.id, storeId, reviewId);

    if (deleteReview.errorMessage) {
      return res.status(deleteReview.code).json({
        errorMessage: deleteReview.errorMessage,
      });
    }

    return res.status(204).json();
  };

  likeReview = async (req, res) => {
    const user = res.locals.user;
    const { storeId, reviewId } = req.params;

    const likeReview = await this.reviewService.likeReview(user.id, storeId, reviewId);

    if (likeReview.errorMessage) {
      return res.status(likeReview.code).json({
        errorMessage: likeReview.errorMessage,
      });
    }

    return res.status(likeReview.code).json({
      message: likeReview.message,
      likeCount: likeReview.likeCount,
    });
  };
}

module.exports = ReviewController;
