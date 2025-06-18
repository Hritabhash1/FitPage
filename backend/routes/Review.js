const express = require("express");
const router = express.Router();
const { addReview, getReviewsByProductId } = require("../controllers/Review");

router.post("/", addReview);
router.get("/:productId",getReviewsByProductId);

module.exports = router;
