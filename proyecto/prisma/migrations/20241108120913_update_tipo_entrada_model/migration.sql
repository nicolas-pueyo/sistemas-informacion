/*
  Warnings:

  - Added the required column `n_max_existencias` to the `tipoentrada` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tipoentrada" ADD COLUMN     "n_max_existencias" INTEGER NOT NULL;
