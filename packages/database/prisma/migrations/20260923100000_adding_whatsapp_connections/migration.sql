CREATE TYPE "WhatsAppConnectionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

CREATE TABLE "WhatsAppConnection" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "metaUserId" TEXT,
    "metaBusinessAccountId" TEXT NOT NULL,
    "whatsappBusinessAccountId" TEXT NOT NULL,
    "phoneNumberId" TEXT NOT NULL,
    "displayPhoneNumber" TEXT,
    "verifiedName" TEXT,
    "businessName" TEXT,
    "encryptedAccessToken" TEXT NOT NULL,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "status" "WhatsAppConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WhatsAppConnection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WhatsAppOAuthState" (
    "id" TEXT NOT NULL,
    "stateHash" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WhatsAppOAuthState_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "WhatsAppConnection_workspaceId_key" ON "WhatsAppConnection"("workspaceId");
CREATE INDEX "WhatsAppConnection_status_idx" ON "WhatsAppConnection"("status");
CREATE UNIQUE INDEX "WhatsAppOAuthState_stateHash_key" ON "WhatsAppOAuthState"("stateHash");
CREATE INDEX "WhatsAppOAuthState_workspaceId_idx" ON "WhatsAppOAuthState"("workspaceId");
CREATE INDEX "WhatsAppOAuthState_userId_idx" ON "WhatsAppOAuthState"("userId");
CREATE INDEX "WhatsAppOAuthState_expiresAt_idx" ON "WhatsAppOAuthState"("expiresAt");

ALTER TABLE "WhatsAppConnection" ADD CONSTRAINT "WhatsAppConnection_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WhatsAppOAuthState" ADD CONSTRAINT "WhatsAppOAuthState_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WhatsAppOAuthState" ADD CONSTRAINT "WhatsAppOAuthState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
