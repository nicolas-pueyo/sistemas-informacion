import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

    const { entrada, evento, city, discoteca, fecha, newName, newPrecio, newExistencias } = req.body;

    // Realiza un console.log para cada valor
    console.log("Entrada:", entrada);
    console.log("Evento:", evento);
    console.log("Ciudad:", city);
    console.log("Discoteca:", discoteca);
    console.log("Fecha:", fecha);
    console.log("Nuevo Nombre:", newName);
    console.log("Nuevo Precio:", newPrecio);
    console.log("Nuevas Existencias:", newExistencias);

  // Validar los parámetros recibidos
  if (!evento || !city || !fecha || !newName || !newPrecio || !newExistencias || !entrada || !discoteca) {
    return res.status(400).json({ message: 'Todos los campos son requeridos' });
  }
  try {
    // Verificar si ya existe una discoteca con los nuevos datos
    const existingEntrada = await prisma.tipoentrada.findUnique({
        where: {  
            nombre_evento_discoteca_ciudad_fecha: {
                nombre: newName,
                evento: evento,
                discoteca: discoteca,
                ciudad: city,
                fecha: fecha,
            },
        },
    });

    if (existingEntrada) {
      return res.status(400).json({ message: 'Ya existe ' });
    }
    // Actualizar la discoteca utilizando la clave primaria compuesta
    const updatedEntrada = await prisma.tipoentrada.update({
        where: {
            nombre_evento_discoteca_ciudad_fecha: {
                nombre: entrada,
                evento: evento,
                discoteca: discoteca,
                ciudad: city,
                fecha: fecha,
            },
        },
        data: {
          nombre: newName,
          precio: parseInt(newPrecio),
          n_existencias: parseInt(newExistencias),
          n_max_existencias: parseInt(newExistencias),
        },
      });

    return res.status(200).json({ message: 'Entrada actualizada con éxito', user: updatedEntrada});
  } catch (error) {
    console.error('Error al actualizar la entrada:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  } finally {
    await prisma.$disconnect();
  }
}
