const express = require("express");
const router = express.router();

router.use("/users", userRouter);
router.use("/store", storeRouter);

module.exports = router;
