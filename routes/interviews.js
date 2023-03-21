const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Interview = require("../models/Interview");
const bodyParser = require("body-parser");
const User = require("../models/User");

router.use(bodyParser.json());

// Add interview to database
router.post("/addinterview/:id", fetchuser, async (req, res) => {
  try {
    const { company, date, result } = req.body;

    const interview = new Interview({
      student: req.params.id,
      user: req.user.id,
      company,
      date,
      result,
    });

    const newInterview = await interview.save();

    res.json(newInterview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Update interview information
router.put("/editinterview/:id", fetchuser, async (req, res) => {
  try {
    const { company, date, result } = req.body;

    // Create a new interview object
    const newInterview = {};

    if (company) newInterview.company = company;
    if (date) newInterview.date = date;
    if (result) newInterview.result = result;

    // Find the interview to be updated and update it
    let interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ msg: "Interview not found" });

    interview = await Interview.findByIdAndUpdate(
      req.params.id,
      { $set: newInterview },
      { new: true }
    );

    res.json(interview);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete interview information
router.delete("/deleteinterview/:id", fetchuser, async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ msg: "Interview not found" });
    }

    await Interview.findByIdAndRemove(req.params.id);

    res.json({ msg: "Interview removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/fetchinterview", async (req, res) => {
  try {
    const interviews = await Interview.find();
    res.json(interviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.get("/interview/:studentId", fetchuser, async (req, res) => {
  try {
    const interviews = await Interview.find({
      student: req.params.studentId,
    });
    res.json(interviews);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.get("/getinterview/:id", fetchuser, async (req, res) => {
  try {
    let interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ msg: "Interview not found" });
    }

    res.json(interview);
    // res.json({ msg: "Interview removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
