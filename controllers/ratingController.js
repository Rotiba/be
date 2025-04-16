const { executeSql } = require("../utils/db");

async function rateVideo(req, res) {
  const videoId = req.params.id;
  const { rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  try {
    const existingRatings = await executeSql(
      `
      SELECT id FROM Ratings
      WHERE videoId = @videoId AND userId = @userId
    `,
      [
        { name: "videoId", type: TYPES.Int, value: parseInt(videoId) },
        { name: "userId", type: TYPES.Int, value: req.user.id },
      ]
    );

    if (existingRatings.length > 0) {
      await executeSql(
        `
        UPDATE Ratings
        SET rating = @rating
        WHERE videoId = @videoId AND userId = @userId
      `,
        [
          { name: "rating", type: TYPES.Int, value: parseInt(rating) },
          { name: "videoId", type: TYPES.Int, value: parseInt(videoId) },
          { name: "userId", type: TYPES.Int, value: req.user.id },
        ]
      );
    } else {
      await executeSql(
        `
        INSERT INTO Ratings (videoId, userId, rating)
        VALUES (@videoId, @userId, @rating)
      `,
        [
          { name: "videoId", type: TYPES.Int, value: parseInt(videoId) },
          { name: "userId", type: TYPES.Int, value: req.user.id },
          { name: "rating", type: TYPES.Int, value: parseInt(rating) },
        ]
      );
    }

    res.status(201).json({ message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Rating error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { rateVideo };
