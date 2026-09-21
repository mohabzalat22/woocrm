-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshTokenHash" TEXT;

-- AlterTable
ALTER TABLE "WorkspaceInvite" ALTER COLUMN "email" DROP DEFAULT;
