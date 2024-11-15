// pages/api/sendResetEmail.js
import { sendEmail } from '../../../utils/sendPwResetEmail';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  const { email } = req.body;
  
try {
  if (!email) {
    return res.status(400).json({ message: 'El correo electrónico es requerido' });
  }

  const user = await prisma.usuario.findUnique({
    where: { correo: email },
  });

  if (!user) {
    return res.status(400).json({ message: 'No existe una cuenta con este correo' });
  }

  // Generar un token JWT para restablecimiento de contraseña (expira en 1 hora)
  const resetToken = jwt.sign(
    { email: user.correo }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );

  // URL para restablecer la contraseña
const resetPasswordUrl = `${process.env.NEXTAUTH_URL}/auth/resetpassword?token=${resetToken}`;


  // Enviar el correo
  const result = await sendEmail({
    to: email,
    subject: 'Restablece tu contraseña',
    html: `<p>Para restablecer tu contraseña, haz clic en el siguiente enlace:</p>
           <a href="${resetPasswordUrl}">Restablecer contraseña</a>
           <p>Este enlace expirará en 1 hora.</p>`,
  });
  if (result.success) {
    res.status(200).json({ message: 'Correo de restablecimiento enviado' });
  } else {
    res.status(500).json({ message: 'Error al enviar el correo' });
  }
} catch (error) {
  return res.status(400).json({ error: 'No se pudo enviar solicitud' });
} finally {
  await prisma.$disconnect();
}
}
