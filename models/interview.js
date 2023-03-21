const mongoose = require("mongoose");
const { Schema } = mongoose;

const interviewSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  date: { type: Date, required: true },
  company: { type: String, required: true },
  result: {
    type: String,
    enum: ["pass", "fail", "did not attempt"],
    required: true,
  },
});

module.exports = mongoose.model("Interview", interviewSchema);
