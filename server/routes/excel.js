const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verifyToken } = require("../middleware/authMiddleware");
const { uploadExcel } = require("../controllers/excelController");
const Upload = require("../models/upload");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const XLSX = require("xlsx");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./uploads"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// router.post("/upload", verifyToken, upload.single("file"), uploadExcel);

router.get("/myuploads", verifyToken, async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ uploads });
  } catch (err) {
    console.error("Fetch uploads error:", err);
    res.status(500).json({ message: "Failed to fetch uploads" });
  }
});

// Download original uploaded file by ID
router.get("/download/:id", verifyToken, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: "File not found" });

    // Re-create the Excel file from stored data
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(upload.data);
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Always use .xlsx extension and fallback if fileName is missing
    let fileName = upload.fileName;
    if (!fileName || !fileName.endsWith('.xlsx')) {
      fileName = (fileName ? fileName.replace(/\.[^/.]+$/, "") : "download") + ".xlsx";
    }
    const tempPath = path.join(__dirname, "..", "uploads", `download-${Date.now()}.xlsx`);
    XLSX.writeFile(wb, tempPath);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.download(tempPath, fileName, (err) => {
      fs.unlinkSync(tempPath);
    });
  } catch (err) {
    res.status(500).json({ message: "Download failed", error: err.message });
  }
});

router.post("/summary/:id", verifyToken, async (req, res) => {
  try {
    const upload = await Upload.findById(req.params.id);
    if (!upload) return res.status(404).json({ message: "File not found" });

    const prompt = `Summarize the following Excel data:\n${JSON.stringify(upload.data.slice(0, 20))}`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 150,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const summary = response.data.choices[0].message.content;
    res.json({ summary });
  } catch (err) {
    res.status(500).json({ message: "AI summary failed", error: err.message });
  }
});

// router.post("/save-analysis", verifyToken, saveAnalysis);
// router.get("/history", verifyToken, getUserHistory);

module.exports = router;
