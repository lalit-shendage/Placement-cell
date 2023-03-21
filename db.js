const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/placement-cell";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectToMongo;
