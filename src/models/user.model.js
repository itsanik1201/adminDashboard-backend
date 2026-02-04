const mongoose = require("mongoose");

const PORTAL_ACCESS_LEVELS = ["TPC", "STUDENT", "DEPT_HEAD", "ADMIN"];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: PORTAL_ACCESS_LEVELS,
      default: "STUDENT"
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
