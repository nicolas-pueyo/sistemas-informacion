// pages/api/returnciudad/[email].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { discoteca,ciudad, fecha, evento } = req.query;

  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  try {
    const eventos = await prisma.evento.findUnique({
      where: {  
        nombre_discoteca_ciudad_fecha: {
            nombre: evento,
            discoteca: discoteca,
            ciudad: ciudad,
            fecha: fecha,
        },
       },
    });

    if (!eventos) {
        return res.status(404).json({ message: 'Evento not found' });
    }
    res.status(200).json(eventos);
  } catch (error) {
    console.error('Error fetching Evento:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
}
