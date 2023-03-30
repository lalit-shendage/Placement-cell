require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.mongoURI,);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error in connecting to MongoDB'));

db.once('open', function () {
  console.log('Connected to Database :: Mongodb');
});

module.exports = db;
