// pages/api/returnciudad/[email].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  try {
    const user = await prisma.usuario.findUnique({
      where: { correo: email },
      select: { ciudad: true },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user city:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
