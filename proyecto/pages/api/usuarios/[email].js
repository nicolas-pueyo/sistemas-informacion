// pages/api/usuarios/[email].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email } = req.query;

  if (req.method === 'GET') {
    try {
      // Find the user by their email
      const user = await prisma.usuario.findUnique({
        where: { correo: email },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return the user data
      res.status(200).json({
        name: user.nombre_usuario,
        email: user.correo,
      });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user data' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
