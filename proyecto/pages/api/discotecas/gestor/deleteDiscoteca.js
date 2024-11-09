import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { discoteca, city } = req.body;

  // Validar los parámetros recibidos
  if (!discoteca || !city) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar si la discoteca existe antes de intentar borrarla
    const existingDiscoteca = await prisma.discoteca.findUnique({
      where: {
        nombre_ciudad: {
          nombre: discoteca,
          ciudad: city,
        },
      },
    });

    if (!existingDiscoteca) {
      return res.status(400).json({ message: 'No existe una discoteca con ese nombre en esa ciudad' });
    }

    // Eliminar la discoteca utilizando la clave primaria compuesta
    await prisma.discoteca.delete({
      where: {
        nombre_ciudad: {
          nombre: discoteca,
          ciudad: city,
        },
      },
    });

    return res.status(200).json({ message: 'Discoteca eliminada con éxito' });
  } catch (error) {
    console.error('Error al borrar la discoteca:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}
