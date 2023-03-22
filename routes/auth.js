require('dotenv').config()
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/fetchuser");
const cors = require("cors");

const JWT_SECRET = process.env.JWT_SECRET;

// Create user using POST "/api/auth/createuser" Doesn't require auth
router.post(
  "/createuser",
  [
    body("name", "enter valid name").isLength({ min: 3 }),
    body("password", "password must be at least 5 characters").isLength({
      min: 5,
    }),
    body("email", "enter valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(JWT_SECRET)
    // find if user already exists
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "sorry a user with this email exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);

      // set HttpOnly cookie with JWT token
      res.cookie("jwt", authToken, { httpOnly: true, secure: true });

      res.json({ token: authToken });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Internal server error", message: err.message });
    }
  }
);

// authenticationg user using POST "/api/auth/login" Doesn't require auth
router.post(
  "/login",
  [
    body("email", "enter valid email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "please enter correct email" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(402).json({ error: "please enter correct password" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      // set HttpOnly cookie with JWT token
      res.cookie("jwt", authToken, { httpOnly: true, secure: true });

      res.json({ token: authToken });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Internal server error", message: err.message });
    }
  }
);

// Protected route using GET "/api/auth/getuser". Requires auth
router.post("/getuser", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
