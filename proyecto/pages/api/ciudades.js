// pages/api/ciudades.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Fetch the list of cities and map to strings
      const ciudades = await prisma.ciudad.findMany({
        select: { nombre: true }, // Only fetch the 'nombre' field
      });

      // Send an array of city names (strings) instead of objects
      res.status(200).json(ciudades.map(ciudad => ciudad.nombre));
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ message: 'Error fetching cities' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
