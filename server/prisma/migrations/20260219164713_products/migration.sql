/*
  Warnings:

  - You are about to drop the column `companyId` on the `products` table. All the data in the column will be lost.
  - Added the required column `updateAt` to the `OrderItems` table without a default value. This is not possible if the table is not empty.
  - Added the required column `supplierId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_companyId_fkey";

-- AlterTable
ALTER TABLE "OrderItems" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "companyId",
ADD COLUMN     "supplierId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "supplier"("supplierId") ON DELETE RESTRICT ON UPDATE CASCADE;
