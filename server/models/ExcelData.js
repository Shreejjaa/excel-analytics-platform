// models/ExcelData.js
const mongoose = require("mongoose");

const excelDataSchema = new mongoose.Schema({
  data: Array, // Stores rows of Excel as JSON
}, { timestamps: true });

module.exports = mongoose.model("ExcelData", excelDataSchema);
