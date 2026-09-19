import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { WorkspaceMemberDto } from './dto';
import { CreateWorkspaceMemberInput } from './schemas/create-workspace-member.schema';
import { UpdateWorkspaceMemberInput } from './schemas/update-workspace-member.schema';
import { WorkspaceMembersRepository } from './workspace-members.repository';
import { RolesService } from '../roles/roles.service';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    private readonly workspaceMembersRepository: WorkspaceMembersRepository,
    private readonly rolesService: RolesService,
  ) {}

  async findById(
    id: string,
    currentUserId: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto | null> {
    await this.userExistsIntheWorkspace(currentUserId, workspaceId);

    return await this.workspaceMembersRepository.findById(id, workspaceId);
  }

  async findByUserId(
    userId: string,
    currentUserId: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto | null> {
    await this.userExistsIntheWorkspace(currentUserId, workspaceId);

    return await this.workspaceMembersRepository.findByUserId(
      userId,
      workspaceId,
    );
  }

  async findAllByWorkspaceId(
    currentUserId: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto[] | []> {
    await this.userExistsIntheWorkspace(currentUserId, workspaceId);

    return await this.workspaceMembersRepository.findAllByWorkspaceId(
      workspaceId,
    );
  }

  async create(
    currentUserId: string,
    workspaceId: string,
    data: CreateWorkspaceMemberInput,
  ): Promise<WorkspaceMemberDto> {
    await this.userExistsIntheWorkspace(currentUserId, workspaceId);

    const existing = await this.workspaceMembersRepository.findByUserId(
      data.userId,
      workspaceId,
    );

    if (existing) {
      throw new ConflictException('Member Already Exists');
    }

    const role = await this.rolesService.findById(data.roleId, workspaceId);

    if (!role) {
      throw new ConflictException('Role Doesnot Exists in the workspace');
    }

    return await this.workspaceMembersRepository.create(data, workspaceId);
  }

  async updateById(
    id: string,
    currentUserId: string,
    workspaceId: string,
    data: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMemberDto> {
    await this.userExistsIntheWorkspace(currentUserId, workspaceId);

    const targetMember = await this.workspaceMembersRepository.findById(
      id,
      workspaceId,
    );
    if (!targetMember) {
      throw new NotFoundException('Member not found in this workspace');
    }

    if (!data.roleId || data.roleId === targetMember.roleId)
      return targetMember;

    const targetRole = await this.rolesService.findById(
      data.roleId,
      workspaceId,
    );
    if (!targetRole) {
      throw new NotFoundException(
        "this role doesn't relate to the targeted workspace",
      );
    }

    const currentRole = await this.rolesService.findById(
      targetMember.roleId,
      workspaceId,
    );
    if (
      currentRole.name === 'ADMIN' &&
      targetRole.name !== 'ADMIN' &&
      (await this.workspaceMembersRepository.countByWorkspaceAndRoleName(
        workspaceId,
        'ADMIN',
      )) <= 1
    ) {
      throw new ConflictException('The last workspace admin cannot be removed');
    }

    return await this.workspaceMembersRepository.updateById(
      id,
      workspaceId,
      data,
    );
  }

  async deleteById(
    id: string,
    currentUserId: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto> {
    await this.userExistsIntheWorkspace(currentUserId, workspaceId);

    const existing = await this.workspaceMembersRepository.findById(
      id,
      workspaceId,
    );

    if (!existing) {
      throw new NotFoundException('Member not found in this workspace');
    }

    const targetRole = await this.rolesService.findById(
      existing.roleId,
      workspaceId,
    );
    if (
      targetRole.name === 'ADMIN' &&
      (await this.workspaceMembersRepository.countByWorkspaceAndRoleName(
        workspaceId,
        'ADMIN',
      )) <= 1
    ) {
      throw new ConflictException('The last workspace admin cannot be removed');
    }
    return await this.workspaceMembersRepository.deleteById(id, workspaceId);
  }

  private async userExistsIntheWorkspace(
    currentUserId: string,
    workspaceId: string,
  ) {
    const currentUserExists =
      await this.workspaceMembersRepository.findByUserId(
        currentUserId,
        workspaceId,
      );

    if (!currentUserExists) {
      throw new ConflictException('You arenot a member in this workspace');
    }
  }
}
