const express = require("express");
const router = express.router();
const reviewRouter = require("./review.route");
const StoreController = require("../controllers/store.controller");
const storeController = new StoreController();

router.use("/:storeId/reviews", reviewRouter);
router.route("/");

module.exports = router;
