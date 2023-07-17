const express = require("express");
const router = express.router();
const ReviewController = require("../controllers/review.controller");
const reviewController = new ReviewController();

router.route("/");

module.exports = router;
