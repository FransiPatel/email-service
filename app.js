const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", "./views");

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// POST endpoint to send the welcome email
app.post("/send-welcome-email", async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email ) {
    return res.status(400).json({ message: "Name, and email are required." });
  }

  try {
    // Render the EJS template with dynamic data
    const emailBody = await ejs.renderFile("./views/email-template.ejs", {
      name,
      email,
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to Our Platform!",
      html: emailBody, // Use the rendered EJS template as the email body
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Welcome email sent successfully.",
      response: info.response,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email.", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
