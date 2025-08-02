const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());

//routes
app.use("/api/workouts", require("./routes/workouts"));
app.use("/api/sessions", require("./routes/sessions"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/custom-exercises", require("./routes/customExercises"));
app.use("/api/report", require("./routes/report"));

//mongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .catch(() => {});

//default route
app.get("/", (req, res) => {
  res.send("API is running!");
});

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT);

app.get("/api/health", (req, res) => {
  res.status(200).send("OK");
});
