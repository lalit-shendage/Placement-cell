require('dotenv').config()
console.log(process.env.mongoURI)
const mongoose = require("mongoose");


const connectToMongo = async () => {

  try {
    await mongoose.connect("mongodb+srv://Lalit:123@cluster0.dwnwv8t.mongodb.net/placement-cell");
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error(err);
  }
};

module.exports = connectToMongo;
