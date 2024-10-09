import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const discotecas = await prisma.discoteca.findMany({
        include: {
          Usuario: true,
          Evento: true,
        },
      });
      res.status(200).json(discotecas);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch discotecas' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
