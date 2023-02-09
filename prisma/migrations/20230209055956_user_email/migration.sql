/*
  Warnings:

  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userEmail]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userEmail` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "Profile_userId_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "userId",
ADD COLUMN     "userEmail" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userEmail_key" ON "Profile"("userEmail");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
