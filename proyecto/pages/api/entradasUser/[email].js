import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email } = req.query;

  if (req.method === 'GET') {
    try {
      // Fetchear entradas de un usuario
      console.log("Email a buscar: ",email)
      const entradas = await prisma.posee.findMany({
        where: {
          correo_usuario: email // Filter by username
        },
      });
      return res.status(200).json(entradas);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Failed to fetch entradas' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
