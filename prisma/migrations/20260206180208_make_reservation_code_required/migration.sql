/*
  Warnings:

  - Made the column `code` on table `Reservation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Reservation" ALTER COLUMN "code" SET NOT NULL;
