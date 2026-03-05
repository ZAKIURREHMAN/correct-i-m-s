/*
  Warnings:

  - You are about to drop the column `customizeCustomer` on the `OrderItems` table. All the data in the column will be lost.
  - Added the required column `customizePrise` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItems" DROP COLUMN "customizeCustomer",
ADD COLUMN     "customizePrise" INTEGER NOT NULL;
