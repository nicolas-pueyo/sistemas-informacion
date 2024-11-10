-- DropForeignKey
ALTER TABLE "evento" DROP CONSTRAINT "evento_discoteca_ciudad_fkey";

-- DropForeignKey
ALTER TABLE "posee" DROP CONSTRAINT "posee_entrada_evento_discoteca_ciudad_fecha_fkey";

-- DropForeignKey
ALTER TABLE "puntua" DROP CONSTRAINT "puntua_discoteca_ciudad_fkey";

-- DropForeignKey
ALTER TABLE "tipoentrada" DROP CONSTRAINT "tipoentrada_evento_discoteca_ciudad_fecha_fkey";

-- AddForeignKey
ALTER TABLE "evento" ADD CONSTRAINT "evento_discoteca_ciudad_fkey" FOREIGN KEY ("discoteca", "ciudad") REFERENCES "discoteca"("nombre", "ciudad") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posee" ADD CONSTRAINT "posee_entrada_evento_discoteca_ciudad_fecha_fkey" FOREIGN KEY ("entrada", "evento", "discoteca", "ciudad", "fecha") REFERENCES "tipoentrada"("nombre", "evento", "discoteca", "ciudad", "fecha") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "puntua" ADD CONSTRAINT "puntua_discoteca_ciudad_fkey" FOREIGN KEY ("discoteca", "ciudad") REFERENCES "discoteca"("nombre", "ciudad") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipoentrada" ADD CONSTRAINT "tipoentrada_evento_discoteca_ciudad_fecha_fkey" FOREIGN KEY ("evento", "discoteca", "ciudad", "fecha") REFERENCES "evento"("nombre", "discoteca", "ciudad", "fecha") ON DELETE NO ACTION ON UPDATE CASCADE;
