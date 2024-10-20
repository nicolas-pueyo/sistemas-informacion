import { PrismaClient } from '@prisma/client';
import mailgun from 'mailgun-js';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN,
});

// Helper function to send the password reset email
const sendPasswordResetEmail = async (email, resetLink) => {
  const data = {
    from: 'your-email@example.com', // You can configure this as per your domain
    to: email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  await mg.messages().send(data);
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      // Check if the user exists
      const user = await prisma.usuario.findUnique({
        where: { correo: email },
      });

      if (!user) {
        return res.status(404).json({ error: 'No user found with this email' });
      }

      // Generate a reset token
      const resetToken = jwt.sign(
        { email: user.correo }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' } // Token expires in 1 hour
      );

      // Optionally, store the token in the database (you can skip this)
      await prisma.usuario.update({
        where: { correo: user.correo },
        data: { resetToken },
      });

      // Construct the password reset link
      const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

      // Send the password reset email
      await sendPasswordResetEmail(user.correo, resetLink);

      // Respond with success
      return res.status(200).json({ message: 'Password reset link sent' });
    } catch (error) {
      return res.status(500).json({ error: 'Error processing request' });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
