const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadExcel } = require("../controllers/excelController");
const verifyToken = require("../middleware/authMiddleware"); // <-- new line

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Protect the upload route with verifyToken
router.post("/upload", verifyToken, upload.single("file"), uploadExcel);

module.exports = router;
// GET /api/excel/myuploads
router.get("/myuploads", verifyToken, async (req, res) => {
  try {
    const Upload = require("./models/Upload");
    const uploads = await Upload.find({ userId: req.user.id }).sort({ createdAt: -1 });

    res.json({ uploads });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
});
