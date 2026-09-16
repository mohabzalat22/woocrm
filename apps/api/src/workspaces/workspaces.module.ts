import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspaceRepository } from './workspaces.repository';
import { WorkspacesService } from './workspaces.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [WorkspacesController],
  providers: [WorkspacesService, WorkspaceRepository],
  exports: [WorkspacesService],
})
export class WorkspacesModule {}
