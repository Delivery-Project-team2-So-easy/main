const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/review.controller');
const reviewController = new ReviewController();
const upload = require('../middlewares/upload-middleware');
const auth = require('../middlewares/auth-middleware');

router.get('/store/:storeId/reviews', reviewController.getReviews);
router.get('/store/:storeId/review/:reviewId', auth, reviewController.getReviewDetail);
router.get('/myReviews', auth, reviewController.getMyReviews);
router.post('/store/:storeId/review', auth, upload, reviewController.postReview);
router.patch('/store/:storeId/review/:reviewId', auth, upload, reviewController.updateReview);
router.delete('/store/:storeId/review/:reviewId', auth, reviewController.deleteReview);
router.post('/store/:storeId/review/:reviewId/like', auth, reviewController.likeReview);

module.exports = router;
