const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  muscleGroup: { type: String, required: true },
  exercise: { type: String, required: true },
  customExercise: { type: String },
  date: { type: Date, required: true },
  sets: [
    {
      reps: { type: Number, required: true },
      weight: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Workout", workoutSchema);
