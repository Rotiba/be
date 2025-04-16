const { executeSql } = require("../utils/db");

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
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { addComment };
