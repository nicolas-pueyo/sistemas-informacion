// pages/api/discotecas.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Obtener todas las discotecas sin filtros
      const discotecas = await prisma.discoteca.findMany();
      res.status(200).json(discotecas);
    } catch (error) {
      console.error('Error al obtener discotecas:', error);
      res.status(500).json({ error: 'Error al obtener las discotecas', detalle: error.message });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}
