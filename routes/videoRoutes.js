const express = require("express");
const { getAllVideos, uploadVideo } = require("../controllers/videoController");
const { authenticateToken } = require("../middleware/authMiddleware");
const multer = require("multer");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/", getAllVideos);
router.post("/", authenticateToken, upload.single("videoFile"), uploadVideo);

module.exports = router;
