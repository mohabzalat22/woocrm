import { Module } from '@nestjs/common';
import { RolesModule } from '../roles/roles.module';
import { UsersModule } from '../users/users.module';
import { WorkspaceMembersModule } from '../workspace-members/workspace-members.module';
import { InvitationsController } from './invitations.controller';
import { InvitationsRepository } from './invitations.repository';
import { InvitationsService } from './invitations.service';

@Module({
  imports: [RolesModule, UsersModule, WorkspaceMembersModule],
  controllers: [InvitationsController],
  providers: [InvitationsRepository, InvitationsService],
})
export class InvitationsModule {}
