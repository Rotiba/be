const express = require("express");
const { rateVideo } = require("../controllers/ratingController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id/ratings", authenticateToken, rateVideo);

module.exports = router;
