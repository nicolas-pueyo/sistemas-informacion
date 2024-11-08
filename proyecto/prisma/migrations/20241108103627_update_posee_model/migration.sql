/*
  Warnings:

  - You are about to drop the column `marca` on the `evento` table. All the data in the column will be lost.
  - The primary key for the `posee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nombre_usuario` on the `posee` table. All the data in the column will be lost.
  - The primary key for the `puntua` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `nombre_usuario` on the `puntua` table. All the data in the column will be lost.
  - You are about to drop the column `n_max_existencias` on the `tipoentrada` table. All the data in the column will be lost.
  - You are about to drop the `gestor_local` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `correo_usuario` to the `posee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `correo_usuario` to the `puntua` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "discoteca" DROP CONSTRAINT "discoteca_gestor_fkey";

-- DropForeignKey
ALTER TABLE "posee" DROP CONSTRAINT "posee_nombre_usuario_fkey";

-- DropForeignKey
ALTER TABLE "puntua" DROP CONSTRAINT "puntua_nombre_usuario_fkey";

-- AlterTable
ALTER TABLE "evento" DROP COLUMN "marca";

-- AlterTable
ALTER TABLE "posee" DROP CONSTRAINT "posee_pkey",
DROP COLUMN "nombre_usuario",
ADD COLUMN     "correo_usuario" VARCHAR(100) NOT NULL,
ADD CONSTRAINT "posee_pkey" PRIMARY KEY ("entrada", "evento", "discoteca", "ciudad", "fecha", "correo_usuario");

-- AlterTable
ALTER TABLE "puntua" DROP CONSTRAINT "puntua_pkey",
DROP COLUMN "nombre_usuario",
ADD COLUMN     "correo_usuario" VARCHAR(100) NOT NULL,
ADD CONSTRAINT "puntua_pkey" PRIMARY KEY ("discoteca", "ciudad", "correo_usuario");

-- AlterTable
ALTER TABLE "tipoentrada" DROP COLUMN "n_max_existencias";

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "tipo" VARCHAR(100);

-- DropTable
DROP TABLE "gestor_local";

-- AddForeignKey
ALTER TABLE "discoteca" ADD CONSTRAINT "discoteca_gestor_fkey" FOREIGN KEY ("gestor") REFERENCES "usuario"("correo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posee" ADD CONSTRAINT "posee_correo_usuario_fkey" FOREIGN KEY ("correo_usuario") REFERENCES "usuario"("correo") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "puntua" ADD CONSTRAINT "puntua_correo_usuario_fkey" FOREIGN KEY ("correo_usuario") REFERENCES "usuario"("correo") ON DELETE NO ACTION ON UPDATE NO ACTION;
