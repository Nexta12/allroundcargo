const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.Email_Host,
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.USER_EMAIL, // generated ethereal user
    pass: process.env.Email_pass, // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false,
  },
});


module.exports = transporter


