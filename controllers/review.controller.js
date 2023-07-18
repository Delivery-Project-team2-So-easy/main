const ReviewService = require('../services/review.service');

class ReviewController {
  reviewService = new ReviewService();

  getReviews = async (req, res) => {
    const storeId = 1;
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
    const userId = 1;
    const storeId = 1;
    const orderId = 1;
    const { review, rating } = req.body;

    let filepath = req.file ? req.file.location : null;
    const reviewImg = filepath
      ? `<img src="${filepath}" class="postImage" alt="../image/defaultImage.jpg" />`
      : '';

    const postReview = await this.reviewService.postReview(
      userId,
      storeId,
      orderId,
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
    const userId = 1;
    const storeId = 1;
    const reviewId = 1;
    const { review, rating } = req.body;

    let filepath = req.file ? req.file.location : null;
    const reviewImg = filepath
      ? `<img src="${filepath}" class="postImage" alt="../image/defaultImage.jpg" />`
      : '';

    const updateReview = await this.updateReview(
      review,
      rating,
      reviewImg,
      userId,
      storeId,
      reviewId
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
    const userId = 1;
    const storeId = 1;
    const reviewId = 1;

    const deleteReview = await this.reviewService.deleteReview(userId, storeId, reviewId);

    if (deleteReview.errorMessage) {
      return res.status(deleteReview.code).json({
        errorMessage: deleteReview.errorMessage,
      });
    }

    return res.status(204).json();
  };

  likeReview = async (req, res) => {
    const userId = 1;
    const reviewId = 1;

    const likeReview = await this.reviewService.likeReview(userId, reviewId);

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
