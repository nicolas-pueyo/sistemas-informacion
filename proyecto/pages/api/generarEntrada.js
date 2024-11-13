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

      // Filter entradas that have counts > 0
      const validEntradas = entradas.filter(entrada => counts[entrada.nombre] && counts[entrada.nombre] > 0);

      // Add each valid entrada as a new page
      validEntradas.forEach((entrada, index) => {
        // Only add a new page after the first page
        if (index > 0) {
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
        doc.text(`Número de entradas: ${counts[entrada.nombre]}`, margin, margin + 35);
        doc.text(`Comprador: ${userEmail}`, margin, margin + 45);
        doc.text(`Seguro de devolución: ${seguros[entrada.nombre] ? 'Sí' : 'No'}`, margin, margin + 55);
        doc.text(`Fecha: ${new Date(entrada.fecha).toLocaleDateString()}`, margin, margin + 65);
      });

      // If no valid entradas were found, return an error
      if (validEntradas.length === 0) {
        return res.status(400).json({ error: 'No hay entradas seleccionadas' });
      }

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
        if (counts[entrada.nombre] && counts[entrada.nombre] > 0) {
          const hasSeguro = seguros[entrada.nombre];
          const ticketCount = counts[entrada.nombre];
          console.log(`Processing entrada ${entrada.nombre}: ${ticketCount} tickets with seguro: ${hasSeguro}`);
          
          try {
            // First check if there are enough tickets available
            const tipoEntrada = await prisma.tipoentrada.findUnique({
              where: {
                nombre_evento_discoteca_ciudad_fecha: {
                  nombre: entrada.nombre,
                  evento: eventoId,
                  discoteca: discotecaId,
                  ciudad: entrada.ciudad,
                  fecha: entrada.fecha,
                }
              }
            });

            if (!tipoEntrada) {
              throw new Error(`Entrada ${entrada.nombre} no encontrada`);
            }

            if (tipoEntrada.n_existencias < ticketCount) {
              throw new Error(`Solo quedan ${tipoEntrada.n_existencias} entradas disponibles para ${entrada.nombre}`);
            }

            // Start a transaction
            await prisma.$transaction(async (tx) => {
              // First update the tipoentrada to decrease available tickets
              await tx.tipoentrada.update({
                where: {
                  nombre_evento_discoteca_ciudad_fecha: {
                    nombre: entrada.nombre,
                    evento: eventoId,
                    discoteca: discotecaId,
                    ciudad: entrada.ciudad,
                    fecha: entrada.fecha,
                  }
                },
                data: {
                  n_existencias: {
                    decrement: ticketCount
                  }
                }
              });

              // Then create or update the posee record
              const existingEntry = await tx.posee.findFirst({
                where: {
                  entrada: entrada.nombre,
                  evento: eventoId,
                  discoteca: discotecaId,
                  ciudad: entrada.ciudad,
                  fecha: entrada.fecha,
                  correo_usuario: userEmail,
                  seguro_devolucion: hasSeguro,
                }
              });

              if (existingEntry) {
                await tx.posee.update({
                  where: {
                    entrada_evento_discoteca_ciudad_fecha_correo_usuario_seguro_devolucion: {
                      entrada: entrada.nombre,
                      evento: eventoId,
                      discoteca: discotecaId,
                      ciudad: entrada.ciudad,
                      fecha: entrada.fecha,
                      correo_usuario: userEmail,
                      seguro_devolucion: hasSeguro
                    }
                  },
                  data: {
                    n_entradas: {
                      increment: ticketCount
                    }
                  }
                });
              } else {
                await tx.posee.create({
                  data: {
                    entrada: entrada.nombre,
                    evento: eventoId,
                    discoteca: discotecaId,
                    ciudad: entrada.ciudad,
                    fecha: entrada.fecha,
                    correo_usuario: userEmail,
                    seguro_devolucion: hasSeguro,
                    n_entradas: ticketCount
                  }
                });
              }
            });

            console.log(`Successfully processed ${ticketCount} tickets for ${entrada.nombre}`);

          } catch (error) {
            console.error('Error processing entrada:', error);
            throw error;
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
