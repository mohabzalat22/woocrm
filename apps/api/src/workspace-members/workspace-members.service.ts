import {
  ConflictException,
  NotFoundException,
  Injectable,
} from '@nestjs/common';
import { WorkspaceMemberDto } from './dto';
import { CreateWorkspaceMemberInput } from './schemas/create-workspace-member.schema';
import { UpdateWorkspaceMemberInput } from './schemas/update-workspace-member.schema';
import { WorkspaceMembersRepository } from './workspace-members.repository';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    private readonly workspaceMembersRepository: WorkspaceMembersRepository,
  ) {}

  async findById(
    id: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto | null> {
    return await this.workspaceMembersRepository.findById(id, workspaceId);
  }

  async findByUserId(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto | null> {
    return await this.workspaceMembersRepository.findByUserId(
      userId,
      workspaceId,
    );
  }

  async findAllByWorkspaceId(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto[] | []> {
    const existing = await this.workspaceMembersRepository.findById(
      userId,
      workspaceId,
    );

    if (!existing) {
      throw new NotFoundException('Member not found in this workspace');
    }
    return await this.workspaceMembersRepository.findAllByWorkspaceId(
      workspaceId,
    );
  }

  async create(data: CreateWorkspaceMemberInput): Promise<WorkspaceMemberDto> {
    const existing = await this.workspaceMembersRepository.findByUserId(
      data.userId,
      data.workspaceId,
    );
    if (existing) {
      throw new ConflictException('Member Already Exists');
    }

    return await this.workspaceMembersRepository.create(data);
  }

  async updateById(
    id: string,
    workspaceId: string,
    data: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMemberDto> {
    const existing = await this.workspaceMembersRepository.findById(
      id,
      workspaceId,
    );

    if (!existing) {
      throw new NotFoundException('Member not found in this workspace');
    }

    return await this.workspaceMembersRepository.updateById(id, data);
  }

  async deleteById(
    id: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto> {
    const existing = await this.workspaceMembersRepository.findById(
      id,
      workspaceId,
    );

    if (!existing) {
      throw new NotFoundException('Member not found in this workspace');
    }
    return await this.workspaceMembersRepository.deleteById(id);
  }
}
