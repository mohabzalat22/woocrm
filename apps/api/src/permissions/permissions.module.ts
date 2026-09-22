import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import { PermissionsRepository } from './permissions.repository';
import { RolesModule } from '../roles/roles.module';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { WorkspacePermissionsController } from './workspace-permissions.controller';

@Module({
  imports: [RolesModule, WorkspaceMembersModule],
  controllers: [PermissionsController, WorkspacePermissionsController],
  providers: [PermissionsService, PermissionsRepository],
  exports: [PermissionsService],
})
export class PermissionsModule {}
