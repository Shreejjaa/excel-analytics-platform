const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");
const Upload = require("../models/upload"); // Ensure correct relative path

exports.uploadExcel = async (req, res) => {
  try {
    const filePath = req.file.path;

    // Read Excel file
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Delete file from uploads/ after reading
    fs.unlinkSync(filePath);

    // Save data to MongoDB
    const newUpload = new Upload({
      userId: "demo_user", // Update this when user auth is done
      fileName: req.file.originalname,
      data: data,
    });

    await newUpload.save();

    res.status(201).json({ message: "File uploaded & data saved", data });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};
