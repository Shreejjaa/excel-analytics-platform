const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const excelRoutes = require("./routes/excel");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("📡 API is running");
});

// ✅ Connect to MongoDB BEFORE starting server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Failed:", err.message);
  });
