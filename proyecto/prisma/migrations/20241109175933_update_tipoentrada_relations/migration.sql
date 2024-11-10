-- DropForeignKey
ALTER TABLE "tipoentrada" DROP CONSTRAINT "tipoentrada_evento_discoteca_ciudad_fecha_fkey";

-- AddForeignKey
ALTER TABLE "tipoentrada" ADD CONSTRAINT "tipoentrada_evento_discoteca_ciudad_fecha_fkey" FOREIGN KEY ("evento", "discoteca", "ciudad", "fecha") REFERENCES "evento"("nombre", "discoteca", "ciudad", "fecha") ON DELETE RESTRICT ON UPDATE CASCADE;
