import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { RolesService } from '../roles/roles.service';
import { UserRepository } from '../users/users.repository';
import { WorkspaceMembersRepository } from '../workspace-members/workspace-members.repository';
import { CreateInvitationInput } from './schemas';
import { InvitationsRepository } from './invitations.repository';

@Injectable()
export class InvitationsService {
  constructor(
    private readonly invitationsRepository: InvitationsRepository,
    private readonly rolesService: RolesService,
    private readonly usersRepository: UserRepository,
    private readonly membersRepository: WorkspaceMembersRepository,
  ) {}

  async create(
    createdById: string,
    workspaceId: string,
    data: CreateInvitationInput,
  ) {
    await this.rolesService.findById(data.roleId, workspaceId);
    const user = await this.usersRepository.findByEmail(data.email);
    if (!user) {
      throw new ConflictException(
        'Make Sure the invited user is registered workspace',
      );
    }
    const invitedUserAlreadyExists = await this.membersRepository.findByUserId(
      user.id,
      workspaceId,
    );
    if (user && invitedUserAlreadyExists) {
      throw new ConflictException('User is already a member of this workspace');
    }
    const generatedToken = randomBytes(32).toString('hex');
    return this.invitationsRepository.create(
      createdById,
      workspaceId,
      generatedToken,
      data,
    );
  }

  async accept(token: string, userId: string, email: string) {
    if (!userId || !email)
      throw new NotFoundException('Authenticated user not found');
    return this.invitationsRepository.accept(token, userId, email);
  }
}
