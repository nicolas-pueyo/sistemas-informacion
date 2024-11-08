// pages/api/generate-and-save-pdf.js

import { PrismaClient } from '@prisma/client';
import jsPDF from 'jspdf';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { entradas, counts, eventoId, discotecaId, userEmail, seguros } = req.body;

    // Basic validation
    if (!entradas || !counts || !eventoId || !discotecaId || !userEmail || !seguros) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Create a new PDF document
      const doc = new jsPDF();

      // Set up some styles
      const titleFontSize = 18;
      const textFontSize = 12;
      const margin = 20;

      // Add each entrada as a new page
      entradas.forEach((entrada, index) => {
        if (index !== 0) {
          doc.addPage();
        }

        // Add a title
        doc.setFontSize(titleFontSize);
        doc.text(`Entrada para ${entrada.nombre}`, margin, margin);

        // Add a horizontal line
        doc.setLineWidth(0.5);
        doc.line(margin, margin + 5, 190, margin + 5);

        // Add details
        doc.setFontSize(textFontSize);
        doc.text(`Discoteca: ${discotecaId}`, margin, margin + 15);
        doc.text(`Evento ID: ${eventoId}`, margin, margin + 25);
        doc.text(`Cantidad seleccionada: ${counts[entrada.id] || 0}`, margin, margin + 35);
        doc.text(`Comprador: ${userEmail}`, margin, margin + 45);

        // Optionally, add a QR code or barcode for the entrada
        // You can use a library like 'qrcode' to generate a QR code and add it to the PDF
      });

      const safeDiscotecaName = discotecaId.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const safeEventoName = eventoId.replace(/[^a-z0-9]/gi, '_').toLowerCase();

      // Define the file path
      const fileName = `${userEmail}_${safeDiscotecaName}_${safeEventoName}_entradas.pdf`;
      const filePath = path.join(process.cwd(), 'public', 'entradas', fileName);

      // Ensure the 'entradas' directory exists
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      // Write the PDF to the file system
      fs.writeFileSync(filePath, Buffer.from(doc.output('arraybuffer')));

      // Save entries to database
      const currentDate = new Date();
      
      // Create entries in the database for each selected ticket
      for (const entrada of entradas) {
        if (counts[entrada.id] > 0) { // Only process entries with count > 0
          for (let i = 0; i < counts[entrada.id]; i++) { // Create an entry for each count
            const existingEntry = await prisma.posee.findFirst({
              where: {
                entrada: entrada.nombre,
                evento: eventoId,
                discoteca: discotecaId,
                ciudad: entrada.ciudad,
                correo_usuario: userEmail,
              },
            });            
            if (existingEntry) {
              // Si ya existe, actualizamos la cantidad de entradas sumando la nueva cantidad
              await prisma.posee.update({
                where: {
                  entrada_evento_discoteca_ciudad_fecha_correo_usuario: {
                    entrada: "dab",
                    evento: "Zinderizar",
                    discoteca: "Kenbo",
                    ciudad: "Zaragoza",
                    fecha: new Date("2024-10-31T00:00:00.000Z"),
                    correo_usuario: "pene@pene.pene",
                  },
                },
                data: {
                  n_entradas: existingEntry.n_entradas + counts[entrada.id],
                  seguro_devolucion: seguros[entrada.id] || existingEntry.seguro_devolucion,
                },
              });
            } else {
            await prisma.posee.create({
              data: {
                seguro_devolucion: seguros[entrada.id] || false,
                tipoentrada: {
                  connect: {
                    nombre_evento_discoteca_ciudad_fecha: {
                      nombre: entrada.nombre,
                      evento: eventoId,
                      discoteca: discotecaId,
                      ciudad: entrada.ciudad,
                      fecha: entrada.fecha, // Asegúrate de que esta fecha sea correcta
                    }
                  },
                },
                usuario: {
                  connect: {
                    correo: userEmail,
                  },
                },
                n_entradas: counts[entrada.id],
              },
            });
          }
            
          }
        }
      }

      // Return the file URL to the client
      res.status(200).json({ fileUrl: `/entradas/${fileName}`, fileName });
    } catch (error) {
      console.error("Error generating and saving PDF:", error);
      res.status(500).json({ error: 'Failed to generate and save PDF' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
