// pages/api/discotecas.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { discoteca } = req.query; // Obtener el parámetro de discoteca desde la query string

      // Si se proporciona una discoteca, filtrar los eventos por la discoteca
      const eventos = await prisma.evento.findMany({
        where: {
          discoteca: discoteca, // Filtrar por discoteca
        },
      });
      return res.status(200).json(eventos); 
    } catch (error) {
      console.log('Error fetching entradas', error);
      res.status(500).json({ message: 'Error fetching eventos' });
    } finally {
      await prisma.$disconnect;
    }
  } else {
    console.log('Método no permitido');
    return;
  } 
}
