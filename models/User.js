const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  username: { type: String, unique: true, required: true, lowercase: true},
  password: { type: String, required: true },

  customExercises: {
    type: Map,
    of: [String],
    default: {},
  },
  
  securityQuestions: {
    type: [
      {
        question: String,
        answer: String,
      },
    ],
    required: true,
  },
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  if (this.isModified("securityQuestions")) {
    for (const q of this.securityQuestions) {
      if (q.answer && !q.answer.startsWith("$2")) {
        q.answer = await bcrypt.hash(q.answer, 10);
      }
    }
  }

  next();
});

module.exports = mongoose.model("User", UserSchema);