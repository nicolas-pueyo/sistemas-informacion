// pages/api/usuarios/[ciudad].js

import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // Ensure it's a GET request
  if (req.method === 'GET') {
    try {
      // Get the current user session
      const session = await getSession({ req });

      // If there's no session, the user is not logged in
      if (!session) {
        return res.status(401).json({ error: 'You must be logged in to access this resource.' });
      }

      // Get the user's email from the session
      const userEmail = session.user.email;

      // Fetch the user's data from the database using Prisma (assuming user is identified by email)
      const user = await prisma.usuario.findUnique({
        where: { correo: userEmail },
        select: { ciudad: true }, // Only select the city (ciudad) field
      });

      // If the user is not found
      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Return the user's city
      return res.status(200).json({ ciudad: user.ciudad });
      
    } catch (error) {
      console.error('Error fetching user city:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    // Method not allowed
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
