import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, name, city, capacity} = req.body; 
    try {

      // Query the database, filter by city
      const existingDiscoteca = await prisma.discoteca.findUnique({
        where: {
          nombre_ciudad: {
            nombre: name,
            ciudad: city,
          },
        },
      });

      if (existingDiscoteca) {
        return res.status(400).json({ error: 'Ya existe la discoteca' });
      }

      // Create new user in the database
      const newUser = await prisma.discoteca.create({
        data: {
          nombre: name,
          ciudad: city,
          gestor: email,
          calificacion: 0,
          n_reviews: 0,
          aforo: parseInt(capacity),
        },
      });

      res.status(201).json({ message: 'Discoteca created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating discoteca:', error);
      res.status(500).json({ error: 'Error creating discoteca' });
    } finally {
        // Always disconnect Prisma after the request is completed
        await prisma.$disconnect();
      }
  } else {
    // If it's not a GET request
    return res.status(405).json({ message: 'Method not allowed' });
  }
}