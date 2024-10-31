import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { userName } = req.query;

  if (req.method === 'GET') {
    try {
      // Fetchear entradas de un usuario
      const eventos = await prisma.posee.findMany({
        where: {
          nombre_usuario: userName, // Filter by username
        },
      });

      return res.status(200).json(eventos);
    } catch (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
