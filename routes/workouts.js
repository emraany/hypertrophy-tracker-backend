const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

//post new session
router.post("/", async (req, res) => {
  try {
    const newSession = new Session(req.body);
    const saved = await newSession.save();
    res.json(saved);
  } catch (err) {
    res.status(500).send("Error saving session");
  }
});

//get all sessions
router.get("/", async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).send("Error fetching sessions");
  }
});

//delete session by ID
router.delete("/:id", async (req, res) => {
  try {
    await Session.findByIdAndDelete(req.params.id);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send("Error deleting session");
  }
});



module.exports = router;
