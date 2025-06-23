const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const Upload = require("../models/upload");
// const AnalysisHistory = require("../models/AnalysisHistory");

const uploadExcel = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    const ext = req.file.originalname.split('.').pop().toLowerCase();
    let data = [];

    if (ext === "csv" || ext === "xlsx" || ext === "xls") {
      // Parse Excel
      const workbook = XLSX.readFile(req.file.path);
      const sheet = workbook.SheetNames[0];
      data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    } else {
      return res.status(400).json({ message: "Unsupported file type" });
    }

    fs.unlinkSync(req.file.path);

    const upload = new Upload({
      userId: req.user.id,
      fileName: req.file.originalname,
      data: data,
    });

    await upload.save();
    res.status(201).json({ message: "Upload successful", data });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// Save a new analysis
// exports.saveAnalysis = ...

// Get all analyses for the logged-in user
// exports.getUserHistory = ...

module.exports = {
  uploadExcel,
  // saveAnalysis,
  // getUserHistory,
};
