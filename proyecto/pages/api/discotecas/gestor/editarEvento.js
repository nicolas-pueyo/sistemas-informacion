import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

    const { evento, city, discoteca, fecha, newName, newFecha } = req.body;

    console.log("Valores enviados para la actualización:");
    console.log("Nombre:", newName);
    console.log("Discoteca:", discoteca);
    console.log("Ciudad:", city);
    console.log("Fecha:", newFecha);

  // Validar los parámetros recibidos
  if (!evento || !city || !fecha || !newName || !newFecha || !newExistencias) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }

  try {

    // Verificar si ya existe una discoteca con los nuevos datos
    const existingEvento = await prisma.evento.findUnique({
        where: {  
            nombre_discoteca_ciudad_fecha: {
                nombre: newName,
                discoteca: discoteca,
                ciudad: city,
                fecha: newFecha,
            },
        },
    });

    if (existingEvento) {
      return res.status(400).json({ message: 'Ya existe ' });
    }

    // Actualizar la discoteca utilizando la clave primaria compuesta
    const updatedEvento = await prisma.evento.update({
        where: {
            nombre_discoteca_ciudad_fecha: {
                nombre: evento,
                discoteca: discoteca,
                ciudad: city,
                fecha: fecha,
            },
        },
        data: {
          nombre: newName,
          fecha: newFecha,
        },
      });

    return res.status(200).json({ message: 'Evento actualizado con éxito', user: updatedEvento});
  } catch (error) {
    console.error('Error al actualizar el evento:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}
