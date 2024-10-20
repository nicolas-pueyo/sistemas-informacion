import nodemailer from 'nodemailer';

// Create a transporter using Mailtrap
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER, // Mailtrap user from .env.local
    pass: process.env.MAILTRAP_PASS, // Mailtrap password from .env.local
  },
});

// Function to send a password reset email
export const sendPasswordResetEmail = async (email, resetLink) => {
  const mailOptions = {
    from: 'no-reply@yourdomain.com', // Sender address
    to: email, // Recipient email
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};
