const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');
const reviewController = new ReviewController();
// const auth = require("/")

router.get('/store/:storeId/reviews', reviewController.getReviews);
router.post('/store/:storeId/review', auth, reviewController.createReview);
router.patch('/store/:storeId/:reviewId', auth, reviewController.modifyReview);
router.delete('/store/:storeId/review/reviewId', auth, reviewController.deleteReview);

module.exports = router;
