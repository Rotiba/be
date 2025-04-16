const express = require("express");
const { addComment, getComments } = require("../controllers/commentController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/:id/comments", authenticateToken, addComment);
router.get("/:id/comments", getComments); // Add this route

module.exports = router;
