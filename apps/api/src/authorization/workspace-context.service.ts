import { ForbiddenException, Injectable } from '@nestjs/common';
import { WorkspaceMemberDto } from '../workspace-members/dto';
import { WorkspaceMembersRepository } from '../workspace-members/workspace-members.repository';

@Injectable()
export class WorkspaceContextService {
  constructor(private readonly workspaceMembersRepository: WorkspaceMembersRepository) {}

  async requireMembership(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto> {
    const membership = await this.workspaceMembersRepository.findByUserId(
      userId,
      workspaceId,
    );

    if (!membership) {
      throw new ForbiddenException('Unauthorized request');
    }

    return membership;
  }
}
