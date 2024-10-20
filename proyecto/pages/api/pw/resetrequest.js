import { PrismaClient } from '@prisma/client';
import { sendPasswordResetEmail } from '../../../utils/sendPwResetEmail';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

    try {
      // Check if user exists in the database
      const user = await prisma.usuario.findUnique({
        where: { correo: email },
      });

      if (!user) {
        return res.status(404).json({ error: 'No user found with this email' });
      }

      // Generate a JWT token for password reset (expires in 1 hour)
      const resetToken = jwt.sign(
        { email: user.correo }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
      );

      // Construct the password reset link
      const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

      // Send the password reset email
      await sendPasswordResetEmail(user.correo, resetLink);

      // Return success response
      return res.status(200).json({ message: 'Password reset link sent' });
    } catch (error) {
      console.error(error); // Log the error for debugging
      return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
      // Ensure the Prisma Client disconnects properly after the request is processed
      await prisma.$disconnect();
    }
  }

  // Handle invalid HTTP methods
  res.setHeader('Allow', ['POST']);
  res.status(405).json({ message: `Method ${req.method} not allowed` });
}
