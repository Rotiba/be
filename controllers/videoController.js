const { executeSql } = require("../utils/db");
const { BlobServiceClient } = require("@azure/storage-blob");
const { TYPES } = require("tedious");

async function getAllVideos(req, res) {
  try {
    const videos = await executeSql(`
      SELECT v.*, u.username as uploaderName
      FROM Videos v
      JOIN Users u ON v.uploaderId = u.id
      ORDER BY v.uploadDate DESC
    `);

    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function uploadVideo(req, res) {
  /*if (req.user.role !== "creator") {
    return res.status(403).json({ message: "Only creators can upload videos" });
  }*/

  try {
    const { title, publisher, producer, genre, ageRating } = req.body;

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(
      process.env.STORAGE_CONTAINER
    );

    const filename = `${Date.now()}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(filename);

    await blockBlobClient.upload(req.file.buffer, req.file.buffer.length);

    const blobUrl =
      blockBlobClient.url !== ""
        ? blockBlobClient.url
        : "https://appbucket.blob.core.windows.net/videos/pv.mp4";

    await executeSql(
      `
      INSERT INTO Videos (title, publisher, producer, genre, ageRating, blobUrl, uploaderId)
      VALUES (@title, @publisher, @producer, @genre, @ageRating, @blobUrl, @uploaderId)
    `,
      [
        { name: "title", type: TYPES.VarChar, value: title },
        { name: "publisher", type: TYPES.VarChar, value: publisher || "" },
        { name: "producer", type: TYPES.VarChar, value: producer || "" },
        { name: "genre", type: TYPES.VarChar, value: genre || "" },
        { name: "ageRating", type: TYPES.VarChar, value: ageRating || "" },
        { name: "blobUrl", type: TYPES.VarChar, value: blobUrl },
        { name: "uploaderId", type: TYPES.Int, value: req.user.id },
      ]
    );

    res.status(201).json({ message: "Video uploaded successfully", blobUrl });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

async function getVideoById(req, res) {
  const videoId = req.params.id;

  try {
    const videos = await executeSql(
      `
        SELECT v.*, u.username as uploaderName
        FROM Videos v
        JOIN Users u ON v.uploaderId = u.id
        WHERE v.id = @id
      `,
      [{ name: "id", type: TYPES.Int, value: parseInt(videoId) }]
    );

    if (videos.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }

    const video = videos[0];

    // Fetch comments and ratings for the video
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

    const ratings = await executeSql(
      `
        SELECT AVG(CAST(rating AS FLOAT)) as averageRating, COUNT(*) as ratingCount
        FROM Ratings
        WHERE videoId = @videoId
      `,
      [{ name: "videoId", type: TYPES.Int, value: parseInt(videoId) }]
    );

    video.comments = comments;
    video.averageRating = ratings[0].averageRating || 0;
    video.ratingCount = ratings[0].ratingCount || 0;

    res.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = { getAllVideos, uploadVideo, getVideoById };
