/*
  Warnings:

  - A unique constraint covering the columns `[outTradeNo]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Order_outTradeNo_key" ON "Order"("outTradeNo");
