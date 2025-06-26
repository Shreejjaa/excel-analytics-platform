<<<<<<< HEAD
const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const Upload = require("../models/upload");
const History = require('../models/History');
// const AnalysisHistory = require("../models/AnalysisHistory");
const axios = require('axios');
const ExcelData = require('../models/ExcelData');
const Notification = require('../models/Notification');

const uploadExcel = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "No file uploaded" });

    console.log("Checking for duplicate:", req.user.id, req.file.originalname);

    const normalizedFileName = req.file.originalname.trim().toLowerCase();

    // Check for duplicate file for this user
    const existing = await Upload.findOne({
      userId: req.user.id,
      fileName: normalizedFileName
    });
    if (existing) {
      fs.unlinkSync(req.file.path); // Clean up uploaded file
      return res.status(400).json({ message: "You have already uploaded this file." });
    }

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
      fileName: normalizedFileName,
      data: data,
    });

    await upload.save();

    // Add this block to save upload history
    const history = new History({
      user: req.user.id,
      activityType: 'upload',
      details: `Uploaded file: ${req.file.originalname}`,
    });
    await history.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(400).json({ error: "Some error message" });
  }
};

// Save analysis or activity history
const saveHistory = async (req, res) => {
  try {
    console.log('saveHistory called', req.user, req.body);
    const { activityType, details, analysis } = req.body;
    const history = new History({
      user: req.user.id,
      activityType: activityType || 'analyze',
      details: details || '',
      analysis: analysis || null
    });
    await history.save();
    res.status(201).json(history);
  } catch (err) {
    console.error('saveHistory error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get user analysis history
const getHistory = async (req, res) => {
  try {
    console.log('getHistory called', req.user);
    const history = await History.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(history);
  } catch (err) {
    console.error('getHistory error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all analyses for the logged-in user
// exports.getUserHistory = ...

// Download analysis as Excel file
const downloadAnalysis = async (req, res) => {
  try {
    const { analysis } = req.body; // analysis should be an array of objects
    const ws = XLSX.utils.json_to_sheet(analysis);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Analysis');
    const filePath = path.join(__dirname, '../uploads/analysis.xlsx');
    XLSX.writeFile(wb, filePath);
    res.download(filePath, 'analysis.xlsx', async (err) => {
      if (err) throw err;
      fs.unlinkSync(filePath); // Clean up after download

      // Add this block to save download history
      const history = new History({
        user: req.user.id,
        activityType: 'download',
        details: `Downloaded analysis`,
      });
      await history.save();

      const notification = new Notification({
        user: req.user.id,
        title: "File Downloaded",
        message: `You downloaded the file: analysis.xlsx as Excel.`,
        type: "news"
      });
      await notification.save();
    });
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Some error message" });
  }
};

// Delete a specific upload
const deleteUpload = async (req, res) => {
  try {
    const uploadId = req.params.id;
    const upload = await Upload.findById(uploadId);
    if (!upload) {
      return res.status(404).json({ message: "Upload not found" });
    }

    // Add this block to save delete history
    const history = new History({
      user: req.user.id,
      activityType: 'delete',
      details: `Deleted file: ${upload.fileName}`,
    });
    await history.save();

    await Upload.findByIdAndDelete(uploadId);
    res.json({ message: "Upload deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Some error message" });
  }
};

// AI summary for latest upload
const getAISummary = async (req, res) => {
  try {
    // Find the latest upload for the user
    const upload = await Upload.findOne({ userId: req.user.id }).sort({ createdAt: -1 });
    if (!upload) {
      return res.status(404).json({ message: "No uploads found for summary" });
    }
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
};

// Get all uploads for the user (Excel data)
const getExcelData = async (req, res) => {
  try {
    const uploads = await Upload.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ uploads });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch uploads", error: err.message });
  }
};

module.exports = {
  uploadExcel,
  saveHistory,
  getHistory,
  downloadAnalysis,
  deleteUpload,
  getAISummary,
  getExcelData,
};
=======
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

    if (ext === "csv") {
      // Parse CSV
      const workbook = XLSX.readFile(req.file.path, { type: "file", raw: false });
      const sheet = workbook.SheetNames[0];
      data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    } else {
      // Parse Excel
      const workbook = XLSX.readFile(req.file.path);
      const sheet = workbook.SheetNames[0];
      data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
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
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
