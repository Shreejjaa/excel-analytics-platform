const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    fileName: String,
    data: Array,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Upload", uploadSchema);
