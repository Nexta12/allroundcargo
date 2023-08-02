const nodemailer = require("nodemailer");

// Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.Email_Host,
  port: process.env.Email_port,
  secure: true,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.Email_pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
