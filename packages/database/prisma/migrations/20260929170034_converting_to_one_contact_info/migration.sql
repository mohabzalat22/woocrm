/*
  Warnings:

  - A unique constraint covering the columns `[contactId]` on the table `ContactInfo` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ContactInfo_contactId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "ContactInfo_contactId_key" ON "ContactInfo"("contactId");
