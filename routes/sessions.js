const express = require("express");
const router = express.Router();
const Session = require("../models/Session");
const auth = require("../middleware/auth");

//post a session
router.post("/", auth, async (req, res) => {
  try {
    const newSession = new Session({
      ...req.body,
      userId: req.user.userId,
    });
    const saved = await newSession.save();
    res.json(saved);
  } catch (err) {
    res.status(500).send("Error saving session");
  }
});

//get sessions
router.get("/", auth, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.userId }).sort({
      date: -1,
    });
    res.json(sessions);
  } catch (err) {
    res.status(500).send("Error fetching sessions");
  }
});

//update sessoin
router.put("/:id", auth, async (req, res) => {
  try {
    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true },
    );
    res.json(session);
  } catch (err) {
    res.status(500).send("Error updating session");
  }
});

//delete session
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await Session.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!result) {
      return res.status(404).send("Session not found or unauthorized");
    }

    res.sendStatus(204);
  } catch (err) {
    res.status(500).send("Error deleting session");
  }
});





module.exports = router;
