/*
  Warnings:

  - The primary key for the `posee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `seguro_devolucion` on table `posee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "posee" DROP CONSTRAINT "posee_pkey",
ALTER COLUMN "seguro_devolucion" SET NOT NULL,
ADD CONSTRAINT "posee_pkey" PRIMARY KEY ("entrada", "evento", "discoteca", "ciudad", "fecha", "correo_usuario", "seguro_devolucion");
