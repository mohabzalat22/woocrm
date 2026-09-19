import { Module } from '@nestjs/common';
import { WorkspaceMembersController } from './workspace-members.controller';
import { WorkspaceMembersService } from './workspace-members.service';
import { WorkspaceMembersRepository } from './workspace-members.repository';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [RolesModule],
  controllers: [WorkspaceMembersController],
  providers: [WorkspaceMembersService, WorkspaceMembersRepository],
  exports: [WorkspaceMembersService, WorkspaceMembersRepository],
})
export class WorkspaceMembersModule {}
