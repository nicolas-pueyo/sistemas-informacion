import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { correo, contrase_a, name, ciudad } = req.body;

    try {
      // Verificar si el usuario ya existe
      const existingUser = await prisma.Usuario.findUnique({
        where: { email: correo },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hashear la contraseña
      const hashedPassword = await bcrypt.hash(contrase_a, 10);

      // Crear el nuevo usuario y también crear una ciudad si no existe
      const newUser = await prisma.Usuario.create({
        data: {
          email: correo,
          Password: hashedPassword,
          name,
          Ciudad: {
            create: {
              nombre: ciudad,  // Crea una nueva Ciudad con el nombre enviado
            },
          },
        },
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error("Error during registration:", error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
