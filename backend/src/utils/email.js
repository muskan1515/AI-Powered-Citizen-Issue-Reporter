const nodemailer = require('nodemailer');
const env = require('../config/env');

// 1️⃣ Create reusable transporter
const transporter = nodemailer.createTransport({
  host: env.nodemailer.host,
  port: env.nodemailer.port,
  secure: true,
  auth: {
    user: env.nodemailer.user_email,
    pass: env.nodemailer.email_pass,
  },
});

// 2️⃣ Send reset email function
module.exports.sendResetEmail = async ({ to, resetUrl }) => {
  const mailOptions = {
    from: env.nodemailer.from,
    to, 
    subject: 'Password Reset Request',
    text: `You requested a password reset. Click this link to reset your password: ${resetUrl}`,
    html: `
      <p>You requested a password reset.</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>If you did not request this, please ignore this email.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${to}`);
  } catch (err) {
    console.error(`❌ Error sending email to ${to}`, err);
    throw new Error('Failed to send reset email');
  }
};
