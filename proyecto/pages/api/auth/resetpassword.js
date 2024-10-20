import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token, newPassword } = req.body;

    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const email = decoded.email;

      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      await prisma.usuario.update({
        where: { correo: email },
        data: { password: hashedPassword },
      });

      return res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
  }

  return res.status(405).end(); // Method Not Allowed
}
