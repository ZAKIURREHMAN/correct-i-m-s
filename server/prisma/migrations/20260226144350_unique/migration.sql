/*
  Warnings:

  - Added the required column `uniqueCustomer` to the `OrderItems` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItems" ADD COLUMN     "uniqueCustomer" INTEGER NOT NULL;
