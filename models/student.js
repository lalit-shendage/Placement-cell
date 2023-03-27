const mongoose = require("mongoose");
const { Schema } = mongoose;

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: `user`,
  },

  name: { type: String, required: true, unique: true },
  batch: { type: String, required: true },
  college: { type: String, required: true },
  status: { type: String, enum: ["placed", "not placed"], required: true },
  dsaScore: { type: Number, required: true },
  webDScore: { type: Number, required: true },
  reactScore: { type: Number, required: true },
  interviews: [
    {
      company: {
        type: String,
      },
      date: {
        type: String,
      },
      result: {
        type: String,
        enum: [
          'pass',
          'fail',
          'did not attempt',
        ],
        
      },
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);
