import { Injectable } from '@nestjs/common';
import { WorkspaceDto } from './dto';
import { CreateWorkspaceInput } from './schemas/create-workspace.schema';
import { UpdateWorkspaceInput } from './schemas/update-workspace.schema';
import { WorkspaceRepository } from './workspaces.repository';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class WorkspacesService {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  async findById(id: string, userId: string): Promise<WorkspaceDto | null> {
    return this.workspaceRepository.findById(id, userId);
  }

  async findAll(userId: string): Promise<WorkspaceDto[] | []> {
    return await this.workspaceRepository.findAll(userId);
  }

  async create(
    userId: string,
    data: CreateWorkspaceInput,
  ): Promise<WorkspaceDto> {
    return await this.workspaceRepository.create(userId, data);
  }

  async updateById(
    id: string,
    userId: string,
    data: UpdateWorkspaceInput,
  ): Promise<WorkspaceDto> {
    const existing = await this.workspaceRepository.findById(id, userId);

    if (!existing) {
      throw new NotFoundException('Workspace not found');
    }

    return await this.workspaceRepository.updateById(id, data);
  }

  async deleteById(id: string, userId: string): Promise<WorkspaceDto> {
    const existing = await this.workspaceRepository.findById(id, userId);

    if (!existing) {
      throw new NotFoundException('Workspace not found');
    }
    return await this.workspaceRepository.deleteById(id);
  }
}
