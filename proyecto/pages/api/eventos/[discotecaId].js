import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { discotecaId } = req.query; // Get the discotecaId (likely the discoteca name)

  if (req.method === 'GET') {
    try {
      // Fetch events associated with the discoteca, filtering by the discoteca name
      const eventos = await prisma.evento.findMany({
        where: {
          discoteca: { equals: discotecaId }
        },
        select: {
          nombre: true, // Fetch the discoteca name
          fecha: true,     // Fetch the fecha (date)
        }
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
