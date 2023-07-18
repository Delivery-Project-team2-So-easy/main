const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');
const reviewController = new ReviewController();

router.post('/store/:storeId/review', reviewController.postReview);
router.get('/store/:storeId/reviews', reviewController.getReviews);
router.patch('/store/:storeId/review/:reviewId', reviewController.updateReview);
router.delete('/store/:storeId/review/:reviewId', reviewController.deleteReview);
router.post('/store/:storeId/review/:reviewId/like', reviewController.likeReview);

module.exports = router;
