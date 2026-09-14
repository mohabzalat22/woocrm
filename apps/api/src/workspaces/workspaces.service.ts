import { Injectable } from '@nestjs/common';
import { WorkspaceDto } from './dto';
import { CreateWorkspaceInput } from './schemas/create-workspace.schema';
import { UpdateWorkspaceInput } from './schemas/update-workspace.schema';
import { WorkspaceRepository } from './workspaces.repository';

@Injectable()
export class WorkspaceService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async findById(id: string): Promise<WorkspaceDto | null> {
    return this.workspaceRepository.findById(id);
  }

  async findAll(): Promise<WorkspaceDto[] | null> {
    return await this.workspaceRepository.findAll();
  }

  async create(
    userId: string,
    data: CreateWorkspaceInput,
  ): Promise<WorkspaceDto> {
    return await this.workspaceRepository.create(userId, data);
  }

  async updateById(
    id: string,
    data: UpdateWorkspaceInput,
  ): Promise<WorkspaceDto | null> {
    return await this.workspaceRepository.updateById(id, data);
  }

  async deleteById(id: string): Promise<WorkspaceDto | null> {
    return await this.workspaceRepository.deleteById(id);
  }
}
