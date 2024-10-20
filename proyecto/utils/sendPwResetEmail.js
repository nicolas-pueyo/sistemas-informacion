import nodemailer from 'nodemailer';

export const sendPasswordResetEmail = async (email, resetLink) => {
  // Configure Nodemailer with Mailgun's sandbox SMTP settings
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,    // Mailgun SMTP host
    port: process.env.EMAIL_PORT,    // Mailgun SMTP port (587 for TLS)
    secure: false,                   // Use TLS
    auth: {
      user: process.env.EMAIL_USER,  // Mailgun sandbox SMTP username
      pass: process.env.EMAIL_PASS,  // Mailgun sandbox SMTP password
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'no-reply@sandboxXXXX.mailgun.org',  // Sender email (use your sandbox domain)
    to: email,                                // Recipient email (must be authorized)
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  // Send the email using the transporter
  await transporter.sendMail(mailOptions);
};
