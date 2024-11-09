import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { discoteca, city, newName, capacity } = req.body;

  // Validar los parámetros recibidos
  if (!discoteca || !city || !newName || !capacity) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {

    // Verificar si ya existe una discoteca con el nuevo nombre y la misma ciudad
    const existingDiscoteca = await prisma.discoteca.findUnique({
      where: {
        nombre_ciudad: {
          nombre: newName,
          ciudad: city,
        },
      },
    });

    if (existingDiscoteca) {
      return res.status(400).json({ message: 'Ya existe una discoteca con ese nombre en esa ciudad' });
    }

    // Actualizar la discoteca utilizando la clave primaria compuesta
    const updatedDiscoteca = await prisma.discoteca.update({
        where: {
          nombre_ciudad: {
            nombre: discoteca,
            ciudad: city,
          },
        },
        data: {
          nombre: newName,
          aforo: parseInt(capacity, 10),
        },
      });

    return res.status(200).json({ message: 'Discoteca actualizada con éxito', user: updatedDiscoteca });
  } catch (error) {
    console.error('Error al actualizar la discoteca:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}
