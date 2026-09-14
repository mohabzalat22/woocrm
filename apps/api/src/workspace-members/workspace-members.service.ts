import { Injectable } from '@nestjs/common';
import { WorkspaceMemberDto } from './dto';
import { CreateWorkspaceMemberInput } from './schemas/create-workspace-member.schema';
import { UpdateWorkspaceMemberInput } from './schemas/update-workspace-member.schema';
import { WorkspaceMembersRepository } from './workspace-members.repository';

@Injectable()
export class WorkspaceMembersService {
  constructor(
    private readonly workspaceMembersRepository: WorkspaceMembersRepository,
  ) {}

  async findById(id: string): Promise<WorkspaceMemberDto | null> {
    return await this.workspaceMembersRepository.findById(id);
  }

  async findAll(): Promise<WorkspaceMemberDto[] | null> {
    return await this.workspaceMembersRepository.findAll();
  }

  async findAllByUserId(userId: string): Promise<WorkspaceMemberDto[] | null> {
    return await this.workspaceMembersRepository.findAllByUserId(userId);
  }

  async create(data: CreateWorkspaceMemberInput): Promise<WorkspaceMemberDto> {
    return await this.workspaceMembersRepository.create(data);
  }

  async updateById(
    id: string,
    data: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMemberDto | null> {
    return await this.workspaceMembersRepository.updateById(id, data);
  }

  async deleteById(id: string): Promise<WorkspaceMemberDto | null> {
    return await this.workspaceMembersRepository.deleteById(id);
  }
}
