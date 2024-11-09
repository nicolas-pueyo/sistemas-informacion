import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { discoteca, city, evento, fecha} = req.body;

  // Validar los parámetros recibidos
  if (!discoteca || !city || !evento || !fecha) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {
    // Verificar si la discoteca existe antes de intentar borrarla
    const existingEvento = await prisma.evento.findUnique({
      where: {  
        nombre_discoteca_ciudad_fecha: {
            nombre: evento,
            discoteca: discoteca,
            ciudad: city,
            fecha: fecha,
        },
       },
    });

    if (!existingEvento) {
      return res.status(400).json({ message: 'No existe el evento' });
    }

    // Eliminar el evento utilizando la clave primaria compuesta
    await prisma.evento.delete({
        where: {  
            nombre_discoteca_ciudad_fecha: {
                nombre: evento,
                discoteca: discoteca,
                ciudad: city,
                fecha: fecha,
            },
       },
    });

    return res.status(200).json({ message: 'Evento eliminado con éxito' });
  } catch (error) {
    console.error('Error al borrar el evento:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}
