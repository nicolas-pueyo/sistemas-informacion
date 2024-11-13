// pages/api/discotecas/[discotecaId]/eventos/[eventoId]/entradas.js

import prisma from '../../../../lib/prisma';

export default async function handler(req, res) {
    const { discotecaId, eventoId } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Método no permitido' });
    }

    if (!discotecaId || !eventoId) {
        return res.status(400).json({ error: 'discotecaId y eventoId son requeridos' });
    }

    try {
        // Obtener todas las entradas relacionadas con el evento y la discoteca
        const tipoEntradas = await prisma.tipoentrada.findMany({
            where: {
                evento: eventoId,
                discoteca: discotecaId,
            },
            select: {
                nombre: true,
                evento: true,
                discoteca: true,
                ciudad: true,
                fecha: true,
                n_existencias: true,
                precio: true,
            }
        });

        // Map the data to include an id field
        const mappedEntradas = tipoEntradas.map(entrada => ({
            ...entrada,
            id: entrada.nombre, // Using nombre as id since it's part of the primary key
        }));

        // Verificar si existen entradas para el evento
        if (!mappedEntradas || mappedEntradas.length === 0) {
            return res.status(404).json({ error: 'No se encontraron entradas para el evento y discoteca especificados.' });
        }

        res.status(200).json(mappedEntradas);
    } catch (error) {
        console.error('Error fetching tipoentradas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    } finally {
        await prisma.$disconnect();
    }
}
