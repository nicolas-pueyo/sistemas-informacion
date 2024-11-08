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
        // Solo crear página si hay entradas seleccionadas para este tipo
        if (counts[entrada.id] && counts[entrada.id] > 0) {
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
          doc.text(`Evento: ${eventoId}`, margin, margin + 25);
          doc.text(`Número de entradas: ${counts[entrada.id]}`, margin, margin + 35);
          doc.text(`Comprador: ${userEmail}`, margin, margin + 45);
          doc.text(`Seguro de devolución: ${seguros[entrada.id] ? 'Sí' : 'No'}`, margin, margin + 55);
          doc.text(`Fecha: ${new Date(entrada.fecha).toLocaleDateString()}`, margin, margin + 65);
        }
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

      // Create entries in the database for each selected ticket
      for (const entrada of entradas) {
        if (counts[entrada.id] && counts[entrada.id] > 0) {
          const hasSeguro = seguros[entrada.id];
          console.log(`Processing entrada ${entrada.nombre}: ${counts[entrada.id]} tickets with seguro: ${hasSeguro}`);
          
          // Buscar entrada existente con el mismo estado de seguro
          const existingEntry = await prisma.posee.findFirst({
            where: {
              entrada: entrada.nombre,
              evento: eventoId,
              discoteca: discotecaId,
              ciudad: entrada.ciudad,
              fecha: entrada.fecha,
              correo_usuario: userEmail,
              seguro_devolucion: hasSeguro,
            },
          });

          if (existingEntry) {
            console.log(`Updating existing entry: ${existingEntry.n_entradas} + ${counts[entrada.id]}`);
            // Actualizar entrada existente
            await prisma.posee.update({
              where: {
                entrada_evento_discoteca_ciudad_fecha_correo_usuario: {
                  entrada: entrada.nombre,
                  evento: eventoId,
                  discoteca: discotecaId,
                  ciudad: entrada.ciudad,
                  fecha: entrada.fecha,
                  correo_usuario: userEmail,
                }
              },
              data: {
                n_entradas: {
                  increment: counts[entrada.id]
                },
                seguro_devolucion: hasSeguro,
              },
            });
          } else {
            console.log(`Creating new entry with ${counts[entrada.id]} tickets`);
            // Crear nueva entrada
            await prisma.posee.create({
              data: {
                entrada: entrada.nombre,
                evento: eventoId,
                discoteca: discotecaId,
                ciudad: entrada.ciudad,
                fecha: entrada.fecha,
                correo_usuario: userEmail,
                seguro_devolucion: hasSeguro,
                n_entradas: counts[entrada.id],
                tipoentrada: {
                  connect: {
                    nombre_evento_discoteca_ciudad_fecha: {
                      nombre: entrada.nombre,
                      evento: eventoId,
                      discoteca: discotecaId,
                      ciudad: entrada.ciudad,
                      fecha: entrada.fecha,
                    }
                  }
                },
                usuario: {
                  connect: {
                    correo: userEmail,
                  }
                }
              },
            });
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
