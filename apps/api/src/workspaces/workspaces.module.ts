import { Module } from '@nestjs/common';
import { WorkspacesController } from './workspaces.controller';
import { WorkspaceRepository } from './workspaces.repository';

@Module({
  controllers: [WorkspacesController],
  providers: [WorkspaceRepository],
})
export class WorkspacesModule {}
