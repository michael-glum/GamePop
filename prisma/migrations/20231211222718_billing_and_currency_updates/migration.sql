/*
  Warnings:

  - A unique constraint covering the columns `[shop]` on the table `Store` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "couponEndDate" TIMESTAMP(3),
ADD COLUMN     "currencyCode" TEXT,
ADD COLUMN     "nextPeriod" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "Store_shop_key" ON "Store"("shop");
