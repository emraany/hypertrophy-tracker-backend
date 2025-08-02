const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).send("Message required");

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.REPORT_EMAIL_USER,
        pass: process.env.REPORT_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.REPORT_EMAIL_USER,
      to: "emraany1220@gmail.com",
      subject: "Bug Report from App",
      text: message,
    });

    res.status(200).send("Report sent");
  } catch (err) {
    res.status(500).send("Failed to send report");
  }
});

module.exports = router;