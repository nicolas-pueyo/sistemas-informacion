// pages/api/returnciudad/[email].js

import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { email } = req.query; // Get the email from the dynamic route

  if (req.method === 'GET') {
    try {
      const session = await getSession({ req });

      if (!session || session.user.email !== email) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      console.log("ReturnCiudad email: ", email);
      // Fetch the user's city from the database using the email
      const user = await prisma.usuario.findUnique({
        where: { correo: email },
        select: { ciudad: true },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Return the user's city
      return res.status(200).json({ ciudad: user.ciudad });
    } catch (error) {
      console.error('Error fetching user city:', error);
      return res.status(500).json({ error: 'Internal server error' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
