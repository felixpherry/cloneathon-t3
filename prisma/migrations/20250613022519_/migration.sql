/*
  Warnings:

  - A unique constraint covering the columns `[id,createdAt]` on the table `Thread` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Thread_id_createdAt_key" ON "Thread"("id", "createdAt");
