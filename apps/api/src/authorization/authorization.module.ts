import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { PermissionsGuard } from './guards/permissions.guard';
import { RolesGuard } from './guards/roles.guard';
import { PlatformRolesGuard } from './guards/platform-roles.guard';
import { WorkspaceContextService } from './workspace-context.service';

@Global()
@Module({
  imports: [PermissionsModule, RolesModule, WorkspaceMembersModule],
  providers: [
    WorkspaceContextService,
    { provide: APP_GUARD, useClass: PlatformRolesGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_GUARD, useClass: PermissionsGuard },
  ],
})
export class AuthorizationModule {}
