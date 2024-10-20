// pages/api/discotecas.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { evento } = req.query; // Obtener el parámetro de discoteca desde la query string

    // Si se proporciona un evento, filtrar las entradas por el evento
    const entradas = await prisma.tipoentrada.findMany({
      where: {
        evento: evento, // Filtrar por discoteca
      },
    });
    
      await prisma.$disconnect();

    return res.status(200).json(entradas);
  } else {
    console.log('Método no permitido');
    return;
  }
}
