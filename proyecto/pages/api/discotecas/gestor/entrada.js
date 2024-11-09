// pages/api/returnciudad/[email].js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { discoteca,ciudad, fecha, evento, entrada } = req.query;

  
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  try {
    const entradas = await prisma.tipoentrada.findUnique({
      where: {  
        nombre_evento_discoteca_ciudad_fecha: {
            nombre: entrada,
            evento: evento,
            discoteca: discoteca,
            ciudad: ciudad,
            fecha: fecha,
        },
       },
    });

    if (!entradas) {
        return res.status(404).json({ message: 'Entrada not found' });
    }
    res.status(200).json(entradas);
  } catch (error) {
    console.error('Error fetching Entrada:', error);
    res.status(500).json({ message: 'Server error' });
  } finally {
    await prisma.$disconnect();
  }
}
