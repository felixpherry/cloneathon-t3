/*
  Warnings:

  - A unique constraint covering the columns `[id,createdAt]` on the table `Message` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Message_id_createdAt_key" ON "Message"("id", "createdAt");
