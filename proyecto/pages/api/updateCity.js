import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { email, city } = req.body;

  if (!email || !city) {
    return res.status(400).json({ message: 'Email and city are required' });
  }

  try {
    // Update the user's city in the database
    await prisma.usuario.update({
      where: { correo: email },
      data: { ciudad: city },
    });

    res.status(200).json({ message: 'City updated successfully' });
  } catch (error) {
    console.error('Error updating city:', error);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
