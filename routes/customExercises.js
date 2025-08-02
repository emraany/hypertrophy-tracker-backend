const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

//get user's custom exercises
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.customExercises || {});
  } catch (err) {
    res.status(500).json({ message: "Failed to load custom exercises" });
  }
});

//add a new custom exercise
router.post("/", auth, async (req, res) => {
  const { muscleGroup, exerciseName } = req.body;

  if (!muscleGroup || !exerciseName) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user.customExercises.has(muscleGroup)) {
      user.customExercises.set(muscleGroup, []);
    }

    const groupList = user.customExercises.get(muscleGroup);
    if (!groupList.includes(exerciseName)) {
      groupList.push(exerciseName);
      user.customExercises.set(muscleGroup, groupList);
    }

    await user.save();
    res.json({ message: "Custom exercise saved", customExercises: user.customExercises });
  } catch (err) {
    res.status(500).json({ message: "Error saving exercise" });
  }
});
//delete a custom exercise
router.delete("/", auth, async (req, res) => {
  const { muscleGroup, exerciseName } = req.body;

  if (!muscleGroup || !exerciseName) {
    return res.status(400).json({ message: "Missing muscle group or exercise name" });
  }

  try {
    const user = await User.findById(req.userId);

    if (!user.customExercises || !user.customExercises.has(muscleGroup)) {
      return res.status(404).json({ message: "Muscle group not found" });
    }

    const groupList = user.customExercises.get(muscleGroup).filter(ex => ex !== exerciseName);
    if (groupList.length > 0) {
      user.customExercises.set(muscleGroup, groupList);
    } else {
      user.customExercises.delete(muscleGroup);
    }

    await user.save();
    res.json({ message: "Exercise deleted", customExercises: user.customExercises });
  } catch (err) {
    res.status(500).json({ message: "Server error deleting exercise" });
  }
});

module.exports = router;