const express = require("express");
const { addComment } = require("../controllers/commentController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id/comments", authenticateToken, addComment);

module.exports = router;
