// pages/api/generate-and-save-pdf.js

import jsPDF from 'jspdf';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { entradas, counts, eventoId, discotecaId } = req.body;

    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Add each entrada as a new page
      entradas.forEach((entrada, index) => {
        if (index !== 0) {
          doc.addPage();
        }
        doc.setFontSize(16);
        doc.text(`Entrada: ${entrada.nombre}`, 20, 20);
        doc.setFontSize(12);
        doc.text(`Discoteca: ${discotecaId}`, 20, 30);
        doc.text(`Evento ID: ${eventoId}`, 20, 40);
        doc.text(`Cantidad seleccionada: ${counts[entrada.id] || 0}`, 20, 50);
      });

      const safeDiscotecaName = discotecaId.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeEventoName = eventoId.replace(/[^a-z0-9]/gi, '_').toLowerCase();


      // Define the file path
      const fileName = `${safeDiscotecaName}_${safeEventoName}_entradas.pdf`;
      const filePath = path.join(process.cwd(), 'public', 'entradas', fileName);

      // Ensure the 'entradas' directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      // Write the PDF to the file system
      fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));

      // Return the file URL to the client
      res.status(200).json({ fileUrl: `/entradas/${fileName}` , fileName});
    } catch (error) {
      console.error("Error generating and saving PDF:", error);
      res.status(500).json({ error: 'Failed to generate and save PDF' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
