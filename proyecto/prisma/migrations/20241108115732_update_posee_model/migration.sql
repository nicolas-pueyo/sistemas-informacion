/*
  Warnings:

  - Added the required column `n_entradas` to the `posee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "posee" ADD COLUMN     "n_entradas" INTEGER NOT NULL;
