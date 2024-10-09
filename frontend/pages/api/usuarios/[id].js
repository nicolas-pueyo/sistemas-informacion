import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    const { id } = req.query; // Get the user ID from the URL

    if (req.method === 'GET') {
        try {
            const usuario = await prisma.usuario.findUnique({
                where: { id: parseInt(id) },
                include: {
                    Ciudad: true, // Ensure this matches the model's casing
                },
            });
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error(error); // Log any errors for debugging
            res.status(500).json({ error: 'Error fetching user data' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
