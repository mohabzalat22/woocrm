/*
  Warnings:

  - You are about to drop the `WhatsAppOAuthState` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WhatsAppOAuthState" DROP CONSTRAINT "WhatsAppOAuthState_userId_fkey";

-- DropForeignKey
ALTER TABLE "WhatsAppOAuthState" DROP CONSTRAINT "WhatsAppOAuthState_workspaceId_fkey";

-- DropTable
DROP TABLE "WhatsAppOAuthState";

-- CreateTable
CREATE TABLE "ChannelOAuthState" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "stateHash" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelOAuthState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChannelOAuthState_stateHash_key" ON "ChannelOAuthState"("stateHash");

-- CreateIndex
CREATE INDEX "ChannelOAuthState_workspaceId_idx" ON "ChannelOAuthState"("workspaceId");

-- CreateIndex
CREATE INDEX "ChannelOAuthState_userId_idx" ON "ChannelOAuthState"("userId");

-- CreateIndex
CREATE INDEX "ChannelOAuthState_expiresAt_idx" ON "ChannelOAuthState"("expiresAt");

-- AddForeignKey
ALTER TABLE "ChannelOAuthState" ADD CONSTRAINT "ChannelOAuthState_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelOAuthState" ADD CONSTRAINT "ChannelOAuthState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
