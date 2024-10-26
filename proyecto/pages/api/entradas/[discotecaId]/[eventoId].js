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
        // Busca el evento con discotecaId y eventoId
        const evento = await prisma.tipoEntradas.findMany({
            where: {
                nombre: eventoId,
                discoteca: discotecaId,
            },
        });

        if (!evento) {
            return res.status(404).json({ error: 'Entradas no encontrado' });
        }

        // Obtener los tipos de entrada
        const tipoEntradas = evento.tipoentrada;

        res.status(200).json(tipoEntradas);
    } catch (error) {
        console.error('Error fetching tipoentradas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}
