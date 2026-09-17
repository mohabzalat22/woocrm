import {
  ConflictException,
  NotFoundException,
  BadRequestException,
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
    data: CreateWorkspaceMemberInput,
  ): Promise<WorkspaceMemberDto> {
    await this.userExistsIntheWorkspace(currentUserId, data.workspaceId);

    const existing = await this.workspaceMembersRepository.findByUserId(
      data.userId,
      data.workspaceId,
    );

    if (existing) {
      throw new ConflictException('Member Already Exists');
    }

    const role = await this.rolesService.findById(
      data.roleId,
      data.workspaceId,
    );

    if (!role) {
      throw new ConflictException('Role Doesnot Exists in the workspace');
    }

    return await this.workspaceMembersRepository.create(data);
  }

  async updateById(
    id: string,
    currentUserId: string,
    workspaceId: string,
    data: UpdateWorkspaceMemberInput, // now: userId, workspaceId, roleId all required
  ): Promise<WorkspaceMemberDto> {
    await this.userExistsIntheWorkspace(currentUserId, workspaceId);

    const targetMember = await this.workspaceMembersRepository.findById(
      id,
      workspaceId,
    );
    if (!targetMember) {
      throw new NotFoundException('Member not found in this workspace');
    }

    if (data.userId !== targetMember.userId) {
      throw new BadRequestException(
        'userId does not match the member being updated',
      );
    }

    const isMovingWorkspace = data.workspaceId !== workspaceId;

    if (isMovingWorkspace) {
      await this.userExistsIntheWorkspace(currentUserId, data.workspaceId);

      const UserAlreadyExistsInTargetWorkspace =
        await this.workspaceMembersRepository.findByUserId(
          targetMember.userId,
          data.workspaceId,
        );
      if (UserAlreadyExistsInTargetWorkspace) {
        throw new ConflictException(
          'User is already a member of the target workspace',
        );
      }
    }

    const role = await this.rolesService.findById(
      data.roleId,
      data.workspaceId,
    );
    if (!role) {
      throw new NotFoundException(
        "this role doesn't relate to the targeted workspace",
      );
    }

    return await this.workspaceMembersRepository.updateById(id, data);
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
    return await this.workspaceMembersRepository.deleteById(id);
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
