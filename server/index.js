const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");const path = require("path");
const session = require("express-session");
const passport = require("passport");
require("dotenv").config({ path: path.join(__dirname, '.env') });

// Import passport configuration
require('./config/passport');

// Debug: Check if environment variables are loaded
console.log("🔍 Debug - MONGO_URI:", process.env.MONGO_URI);
console.log("🔍 Debug - PORT:", process.env.PORT);
console.log("🔍 Debug - GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set");

const app = express();

// Session configuration for Passport
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
=======
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35

// Routes
const authRoutes = require("./routes/auth");
const excelRoutes = require("./routes/excel");
const adminRoutes = require("./routes/admin");
const notificationsRoutes = require("./routes/notifications");
=======
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35

app.use("/api/auth", authRoutes);
app.use("/api/excel", excelRoutes);
app.use("/api/admin", adminRoutes);
<
app.use("/api/notifications", notificationsRoutes);
=======
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35

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
