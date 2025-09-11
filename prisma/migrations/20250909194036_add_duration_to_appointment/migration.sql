/*
  Warnings:

  - Added the required column `duration` to the `appointments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."appointments" ADD COLUMN     "duration" INTEGER NOT NULL;
