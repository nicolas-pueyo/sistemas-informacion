// pages/api/returnciudad/[email].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { nombre,ciudad } = req.query;

  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  try {
    const discotecas = await prisma.discoteca.findUnique({
      where: {  
        nombre_ciudad: {
            nombre: nombre,
            ciudad: ciudad,
        },
       },
    });

    if (!discotecas) {
        return res.status(404).json({ message: 'Discoteca not found' });
    }
    res.status(200).json(discotecas);
  } catch (error) {
    console.error('Error fetching Discoteca:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
}
