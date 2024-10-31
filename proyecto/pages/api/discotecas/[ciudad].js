import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { ciudad } = req.query; // `ciudad` comes from the dynamic route

    try {
      // Query the database, filter by city
      console.log("Ciudad: ", ciudad);
      const discotecas = await prisma.discoteca.findMany({
        where: {
          ciudad: ciudad, // Filtrar por ciudad
        },
      });

      // Close the Prisma connection
      await prisma.$disconnect();
      return res.status(200).json(discotecas);
    } catch (error) {
      console.error('Error fetching discotecas:', error);
      return res.status(500).json({ error: 'Failed to fetch discotecas' });
    }
  } else {
    // If it's not a GET request
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
