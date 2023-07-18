const ReviewService = require('../services/review.service');

class ReviewController {
  reviewService = new ReviewService();

  getReviews = async (req, res) => {
    const store_id = 1;
    const getReviews = await this.reviewService.getReviews(store_id);

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
    const user_id = 1;
    const store_id = 1;
    const order_id = 1;
    const { review, rating, review_img } = req.body;

    const postReview = await this.reviewService.postReview(
      user_id,
      store_id,
      order_id,
      review,
      rating,
      review_img
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
    const user_id = 1;
    const store_id = 1;
    const review_id = 1;
    const { review, rating, review_img } = req.body;

    const updateReview = await this.updateReview(
      review,
      rating,
      review_img,
      user_id,
      store_id,
      review_id
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
    const user_id = 1;
    const store_id = 1;
    const review_id = 1;

    const deleteReview = await this.reviewService.deleteReview(user_id, store_id, review_id);

    if (deleteReview.errorMessage) {
      return res.status(deleteReview.code).json({
        errorMessage: deleteReview.errorMessage,
      });
    }

    return res.status(200).json({
      message: '리뷰를 삭제하였습니다.',
    });
  };

  likeReview = async (req, res) => {
    const user_id = 1;
    const review_id = 1;

    const likeReview = await this.reviewService.likeReview(user_id, review_id);

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
