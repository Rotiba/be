const express = require("express");
const { rateVideo, getRatings } = require("../controllers/ratingController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id/ratings", authenticateToken, rateVideo);
router.get("/:id/ratings", getRatings); // Add this route

module.exports = router;
