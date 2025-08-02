const mongoose = require("mongoose");

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: String,
  exercises: [
    {
      muscleGroup: String,
      exercise: String,
      sets: [
        {
          reps: Number,
          weight: Number,
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Session", SessionSchema);
