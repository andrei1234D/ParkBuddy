const nodemailer = require('nodemailer');
require('dotenv').config();
// Configure your transporter
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GMAIL_PASSWORD,
  },
});
const sendConfirmationEmail = (firstName, email, role) => {
  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Registration Successful',
    text: `Hello ${firstName},\n\nThank you for registering on our platform with a ${role} account.\nSafe driving!\n\nBest Regards,\nPark Buddy Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
module.exports = sendConfirmationEmail;
