const ReviewService = require("../services/review.service");

class ReviewController {
  reviewService = new ReviewService();
}

module.exports = ReviewController;
