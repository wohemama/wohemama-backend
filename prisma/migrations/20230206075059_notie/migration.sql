-- CreateTable
CREATE TABLE "Notice" (
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Notice_email_key" ON "Notice"("email");
