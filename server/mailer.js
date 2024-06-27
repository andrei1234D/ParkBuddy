const nodemailer = require('nodemailer');
require('dotenv').config();
// Configure your transporter

function formatDate(date) {
  const d = new Date(date);
  let month = '' + (d.getMonth() + 1);
  let day = '' + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [month, day, year].join('/');
}

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

const sendRentalDetailsCustomer = (
  firstName,
  email,
  startTime,
  endTime,
  date,
  address,
  price
) => {
  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: 'Spot rental',
    text: `Hello ${firstName},\n\nThank you for purchasing your spot at the ${address}.\nYour renting time starts at ${startTime} and ends at ${endTime} on ${formatDate(
      date
    )}
    for ${price}RON
    \nPlease don't overstay as this might imply additional costs \nSafe driving!\n\nBest Regards,\nPark Buddy Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending Rental Details email:', error);
    } else {
      console.log('Rental Details Email sent:', info.response);
    }
  });
};
const sendRentalDetailsPartner = (
  firstName,
  email,
  startTime,
  endTime,
  date,
  address,
  price
) => {
  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: `Spot at ${address} has been rented`,
    text: `Hello ${firstName},\n\nYour spot at the ${address} has been rented on ${formatDate(
      date
    )} from ${startTime} until ${endTime}.\n
   ${price}RON Have been sent to your active payment method.
    \nThank you for being a good partner. \nSafe driving!\n\nBest Regards,\nPark Buddy Team`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending Rental Details email:', error);
    } else {
      console.log('Rental Details Email sent:', info.response);
    }
  });
};

module.exports = {
  sendConfirmationEmail,
  sendRentalDetailsCustomer,
  sendRentalDetailsPartner,
};
