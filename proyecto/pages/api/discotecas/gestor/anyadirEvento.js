import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { evento, discoteca, city, fecha} = req.body; 
    try {

      // Query the database, filter by city
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

      if (existingEvento) {
        return res.status(400).json({ error: 'Ya existe el evento' });
      }

      // Create new user in the database
      const newUser = await prisma.evento.create({
        data: {
            nombre: evento,
            discoteca: discoteca,
            ciudad: city,
            fecha: fecha,
        },
      });

      res.status(201).json({ message: 'Event created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ error: 'Error creating event' });
    } finally {
        // Always disconnect Prisma after the request is completed
        await prisma.$disconnect();
      }
  } else {
    // If it's not a GET request
    return res.status(405).json({ message: 'Method not allowed' });
  }
}