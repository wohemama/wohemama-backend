/*
  Warnings:

  - Added the required column `seller` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "seller" TEXT NOT NULL;
