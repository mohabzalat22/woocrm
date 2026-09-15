import { Module } from '@nestjs/common';
import { WorkspaceMembersController } from './workspace-members.controller';
import { WorkspaceMembersService } from './workspace-members.service';
import { WorkspaceMembersRepository } from './workspace-members.repository';

@Module({
  controllers: [WorkspaceMembersController],
  providers: [WorkspaceMembersService, WorkspaceMembersRepository],
  exports: [WorkspaceMembersService],
})
export class WorkspaceMembersModule {}
