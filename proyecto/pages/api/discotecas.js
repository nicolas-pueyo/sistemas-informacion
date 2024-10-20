// pages/api/discotecas.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { ciudad } = req.query; // Obtener el parámetro de ciudad desde la query string

    // Si se proporciona una ciudad, filtrar las discotecas por la ciudad
    const discotecas = await prisma.discoteca.findMany({
      where: {
        ciudad: ciudad, // Filtrar por ciudad
      },
    });
    
    await prisma.$disconnect();

    return res.status(200).json(discotecas);
  } else {
    console.log('Método no permitido');
    return;
  }
}
