/*
  Warnings:

  - Added the required column `updatedAt` to the `Entreprise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Freelance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Projet` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entreprise" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Freelance" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Projet" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
