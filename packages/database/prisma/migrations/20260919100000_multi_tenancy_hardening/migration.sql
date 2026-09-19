-- Add the platform role used by authorization before workspace membership is evaluated.
CREATE TYPE "SystemRole" AS ENUM ('USER', 'ADMIN');

ALTER TABLE "User"
ADD COLUMN "systemRole" "SystemRole" NOT NULL DEFAULT 'USER';

-- Invitations are addressed to a user email and are consumed once.
ALTER TABLE "WorkspaceInvite"
ADD COLUMN "email" TEXT NOT NULL DEFAULT '';

-- Permissions are workspace-owned. Existing permissions are assigned to the
-- first workspace that currently uses them; conflicting assignments are
-- removed so no permission can span workspace boundaries.
ALTER TABLE "Permission"
ADD COLUMN "workspaceId" TEXT;

UPDATE "Permission" p
SET "workspaceId" = source."workspaceId"
FROM (
  SELECT DISTINCT ON (rp."permissionId")
    rp."permissionId",
    r."workspaceId"
  FROM "RolePermission" rp
  JOIN "Role" r ON r.id = rp."roleId"
  ORDER BY rp."permissionId", r."workspaceId"
) source
WHERE p.id = source."permissionId";

DELETE FROM "RolePermission" rp
USING "Permission" p, "Role" r
WHERE rp."permissionId" = p.id
  AND rp."roleId" = r.id
  AND p."workspaceId" IS NOT NULL
  AND p."workspaceId" <> r."workspaceId";

DELETE FROM "Permission" WHERE "workspaceId" IS NULL;

ALTER TABLE "Permission"
ALTER COLUMN "workspaceId" SET NOT NULL;

CREATE UNIQUE INDEX "Permission_workspaceId_name_key"
ON "Permission"("workspaceId", "name");

CREATE INDEX "Permission_workspaceId_idx" ON "Permission"("workspaceId");

ALTER TABLE "Permission"
ADD CONSTRAINT "Permission_workspaceId_fkey"
FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
