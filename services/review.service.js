const ReviewRepository = require("../repositories/review.repository");

class ReviewService {
  reviewRepository = new ReviewRepository();
}

module.exports = ReviewService;
