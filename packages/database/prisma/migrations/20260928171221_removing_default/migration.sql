/*
  Warnings:

  - You are about to drop the `WorkspaceChannelSetting` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "WorkspaceChannelSetting" DROP CONSTRAINT "WorkspaceChannelSetting_workspaceId_fkey";

-- DropTable
DROP TABLE "WorkspaceChannelSetting";
