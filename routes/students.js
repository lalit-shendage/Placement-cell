const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const User = require("../models/User");
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const Student = require("../models/student");

router.get("/fetchstudents", fetchuser, async (req, res) => {
  const students = await Student.find({ user: req.user.id });
  res.json(students);
});

router.get(`/:id`, fetchuser, async (req, res) => {
  try {
    const student = await Student.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Add the body-parser middleware
router.use(bodyParser.json());

// adding student to databse
router.post(
  "/addstudent",
  fetchuser,
  [
    body("name", "Name is required").notEmpty(),
    body("batch", "Batch is required").notEmpty(),
    body("college", "College is required").notEmpty(),
    body(
      "status",
      'Status is required and must be "placed" or "not placed"'
    ).isIn(["placed", "not placed"]),
    body("dsaScore", "DSA score is required and must be a number")
      .notEmpty()
      .isNumeric(),
    body("webDScore", "Web D score is required and must be a number")
      .notEmpty()
      .isNumeric(),
    body("reactScore", "React score is required and must be a number")
      .notEmpty()
      .isNumeric(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, batch, college, status, dsaScore, webDScore, reactScore } =
        req.body;

      // Check if a student with the same name already exists
      const existingStudent = await Student.findOne({ name });
      if (existingStudent) {
        return res
          .status(400)
          .json({ msg: "Student with the same name already exists" });
      }

      const student = new Student({
        user: req.user.id,
        name,
        batch,
        college,
        status,
        dsaScore,
        webDScore,
        reactScore,
      });

      const newStudent = await student.save();
      res.json(newStudent);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);
router.delete("/deletestudent/:id", fetchuser, async (req, res) => {
  try {
    let student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    // Check if the user is authorized to delete the student
    if (student.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Student.findByIdAndRemove(req.params.id);

    res.json({ msg: "Student removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
router.put("/editstudent/:id", fetchuser, async (req, res) => {
  try {
    const { name, batch, college, status, dsaScore, webDScore, reactScore } =
      req.body;

    // Create a new student object
    const newStudent = {};

    if (name) newStudent.name = name;
    if (batch) newStudent.batch = batch;
    if (college) newStudent.college = college;
    if (status) newStudent.status = status;
    if (dsaScore) newStudent.dsaScore = dsaScore;
    if (webDScore) newStudent.webDScore = webDScore;
    if (reactScore) newStudent.reactScore = reactScore;

    // Find the student to be updated and update it
    let student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ msg: "Student not found" });

    if (student.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: newStudent },
      { new: true }
    );

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
