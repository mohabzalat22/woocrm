import { Global, Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PermissionsModule } from '../permissions/permissions.module';
import { RolesModule } from '../roles/roles.module';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { PermissionsGuard } from './guards/permissions.guard';

@Global()
@Module({
  imports: [PermissionsModule, RolesModule, WorkspaceMembersModule],
  providers: [{ provide: APP_GUARD, useClass: PermissionsGuard }],
})
export class AuthorizationModule {}
