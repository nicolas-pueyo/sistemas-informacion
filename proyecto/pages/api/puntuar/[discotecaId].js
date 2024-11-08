// /pages/api/puntuar/[discotecaId].js

import { getServerSession } from "next-auth"
import {authOptions} from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { discotecaId } = req.query;

  if (req.method === 'POST') {
    // Obtener la sesión del usuario
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'No autenticado' });
    }
    const correo_usuario = session.user.email;

    const { ciudad, rating } = req.body;

    if (!ciudad || !rating) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    try {
      // Comprobar si el usuario ya ha puntuado esta discoteca
      const existingRating = await prisma.puntua.findUnique({
        where: {
          discoteca_ciudad_correo_usuario: {
            discoteca: discotecaId,
            ciudad: ciudad,
            correo_usuario: correo_usuario
          }
        }
      });

      if (existingRating) {
        // Actualizar la puntuación existente
        await prisma.puntua.update({
          where: {
            discoteca_ciudad_correo_usuario: {
              discoteca: discotecaId,
              ciudad: ciudad,
              correo_usuario: correo_usuario
            }
          },
          data: {
            calificacion: rating
          }
        });
      } else {
        // Crear una nueva puntuación
        await prisma.puntua.create({
          data: {
            discoteca: discotecaId,
            ciudad: ciudad,
            correo_usuario: correo_usuario,
            calificacion: rating
          }
        });
      }

      // Recalcular la calificación promedio y el número de reseñas
      const allRatings = await prisma.puntua.findMany({
        where: {
          discoteca: discotecaId,
          ciudad: ciudad,
        },
        select: {
          calificacion: true,
        },
      });

      const totalRatings = allRatings.length;
      const sumRatings = allRatings.reduce((sum, r) => sum + parseFloat(r.calificacion), 0);
      const averageRating = sumRatings / totalRatings;

      // Actualizar la calificación y el número de reseñas de la discoteca
      await prisma.discoteca.update({
        where: {
          nombre_ciudad: {
            nombre: discotecaId,
            ciudad: ciudad,
          },
        },
        data: {
          calificacion: averageRating,
          n_reviews: totalRatings,
        },
      });

      return res.status(200).json({ message: 'Puntuación guardada correctamente', 
                                    updatedRating: averageRating
       });
    } catch (error) {
      console.error('Error al guardar la puntuación:', error);
      return res.status(500).json({ message: 'Error del servidor' });
    } finally {
      await prisma.$disconnect;
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Método ${req.method} no permitido`);
  }
}
