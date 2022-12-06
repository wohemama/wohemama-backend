/*
  Warnings:

  - Added the required column `isNotified` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tradeNo` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "isNotified" BOOLEAN NOT NULL,
ADD COLUMN     "tradeNo" TEXT NOT NULL;
