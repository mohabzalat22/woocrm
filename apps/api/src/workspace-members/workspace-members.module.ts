import { Module } from '@nestjs/common';
import { WorkspaceMembersController } from './workspace-members.controller';

@Module({
  controllers: [WorkspaceMembersController]
})
export class WorkspaceMembersModule {}
