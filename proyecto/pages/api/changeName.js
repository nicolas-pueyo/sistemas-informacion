import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }


  const { email, username } = req.body;

  console.log('Email:', email);
  console.log('Username:', username);


  if (!email || !username) {
    return res.status(400).json({ message: 'Email and new name are required' });
  }

  try {
    const updatedUser = await prisma.usuario.update({
      where: { correo: email },
      data: { nombre_usuario: username },
    });

    return res.status(200).json({ message: 'Name updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating name:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
