// pages/api/usuarios.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const usuarios = await prisma.usuario.findMany();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  } else {
    res.status(405).json({ message: 'Método no permitido' });
  }
}