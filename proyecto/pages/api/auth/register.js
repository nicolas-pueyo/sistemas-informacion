// src/app/api/auth/signup.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, username, city } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await prisma.usuario.findUnique({
        where: { correo: email },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user in the database
      const newUser = await prisma.usuario.create({
        data: {
          correo: email,
          password: hashedPassword,
          nombre_usuario: username,
          ciudad: city,
        },
      });

      res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Error creating user' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
