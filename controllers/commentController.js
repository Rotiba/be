const { executeSql } = require("../utils/db");
const { TYPES } = require("tedious");

async function addComment(req, res) {
  const videoId = req.params.id;
  const { comment } = req.body;

  try {
    await executeSql(
      `
      INSERT INTO Comments (videoId, userId, comment)
      VALUES (@videoId, @userId, @comment)
    `,
      [
        { name: "videoId", type: TYPES.Int, value: parseInt(videoId) },
        { name: "userId", type: TYPES.Int, value: req.user.id },
        { name: "comment", type: TYPES.VarChar, value: comment },
      ]
    );

    res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.error("Comment error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getComments(req, res) {
  const videoId = req.params.id;

  try {
    const comments = await executeSql(
      `
        SELECT c.*, u.username
        FROM Comments c
        JOIN Users u ON c.userId = u.id
        WHERE c.videoId = @videoId
        ORDER BY c.createdAt DESC
      `,
      [{ name: "videoId", type: TYPES.Int, value: parseInt(videoId) }]
    );

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { addComment, getComments };
