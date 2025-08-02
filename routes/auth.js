const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

//fetch name and username
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("name username");
    if (!user) return res.status(404).send("User not found");
    res.json(user);
  } catch (err) {
    res.status(500).send("Error fetching user");
  }
});

//register
router.post("/register", async (req, res) => {
  try {
    const { name, username, password, securityQuestions } = req.body;

    if (!name || !username || !password || !securityQuestions || securityQuestions.length !== 2) {
      return res.status(400).json({ message: "All fields are required including two security questions" });
    }

    const exists = await User.findOne({ username: username.toLowerCase() });
    if (exists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const user = new User({ name, username: username.toLowerCase(), password, securityQuestions });
    await user.save();

    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).send("Registration error");
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ token });
  } catch (err) {
    res.status(500).send("Login error");
  }
});

//change password
router.put("/change-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).send("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect old password" });

    user.password = newPassword;
    await user.save();
    res.send("Password updated");
  } catch (err) {
    res.status(500).send("Error changing password");
  }
});

//get security questions
router.get("/security-questions", async (req, res) => {
  const { username } = req.query;
  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !user.securityQuestions) {
      return res.status(404).json({ message: "User or security questions not found" });
    }

    const questionsOnly = user.securityQuestions.map((q) => q.question);
    res.json({ questions: questionsOnly });
  } catch (err) {
    res.status(500).send("Error fetching security questions");
  }
});

//verify security answers
router.post("/verify-security-answers", async (req, res) => {
  const { username, securityAnswers } = req.body;
  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user || !user.securityQuestions) {
      return res.status(404).json({ message: "User or questions not found" });
    }

    for (const { question, answer } of securityAnswers) {
      const record = user.securityQuestions.find((q) => q.question === question);
      if (!record) {
        return res.status(400).json({ message: "Invalid security question" });
      }
      const match = await bcrypt.compare(answer, record.answer);
      if (!match) {
        return res.status(401).json({ message: "Incorrect answer" });
      }
    }


    res.json({ success: true });
  } catch (err) {
    res.status(500).send("Verification failed");
  }
});

//reset password
router.post("/reset-password", async (req, res) => {
  const { username, newPassword } = req.body;
  try {
    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).send("Password reset error");
  }
});

module.exports = router;