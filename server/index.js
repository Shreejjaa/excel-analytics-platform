const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Failed", err));

// Import Routes
const authRoutes = require("./routes/auth");
const excelRoutes = require("./routes/excel"); // <-- Added for Excel upload

// Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/excel", excelRoutes); // <-- Excel route registered

// Basic route
app.get("/", (req, res) => {
  res.send("API is working!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
