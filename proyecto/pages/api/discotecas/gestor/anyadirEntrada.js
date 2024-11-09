import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { entrada, evento, discoteca, city, fecha, precio, existencias} = req.body; 
    try {

      // Query the database, filter by city
      const existingEntrada = await prisma.tipoentrada.findUnique({
        where: {
            nombre_evento_discoteca_ciudad_fecha: {
                nombre: entrada,
                evento: evento,
                discoteca: discoteca,
                ciudad: city,
                fecha: fecha,
            },
        },
      });

      if (existingEntrada) {
        return res.status(400).json({ error: 'Ya existe la entrada' });
      }

      // Create new user in the database
      const newUser = await prisma.tipoentrada.create({
        data: {
            nombre: entrada,
            evento: evento,
            discoteca: discoteca,
            ciudad: city,
            fecha: fecha,
            n_existencias: parseInt(existencias),
            n_max_existencias: parseInt(existencias),
            precio: parseInt(precio),
        },
      });

      res.status(201).json({ message: 'Entrada created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating entrada:', error);
      res.status(500).json({ error: 'Error creating entrada' });
    } finally {
        // Always disconnect Prisma after the request is completed
        await prisma.$disconnect();
      }
  } else {
    // If it's not a GET request
    return res.status(405).json({ message: 'Method not allowed' });
  }
}