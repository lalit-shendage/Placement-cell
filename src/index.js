require('dotenv').config()
const connectToMongo = require("../db");
const cors = require("cors");

connectToMongo();

const express = require("express");
const app = express();
const port =process.env.PORT || 5000;

// app.use(cors());

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

// available routes
app.use("/api/auth", require("../routes/auth"));
app.use("/api/students", require("../routes/students"));
app.use("/api/interview", require("../routes/interviews"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
