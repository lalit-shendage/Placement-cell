require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Lalit:123@cluster0.dwnwv8t.mongodb.net/placement-cell-2");

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error in connecting to MongoDB'));

db.once('open', function () {
  console.log('Connected to Database :: Mongodb');
});

module.exports = db;
