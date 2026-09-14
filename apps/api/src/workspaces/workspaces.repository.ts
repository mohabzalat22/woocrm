import prisma from '@repo/database';
import { Injectable } from '@nestjs/common';
import { WorkspaceDto } from './dto';
import { CreateWorkspaceInput } from './schemas/create-workspace.schema';
import { UpdateWorkspaceInput } from './schemas/update-workspace.schema';

@Injectable()
export class WorkspaceRepository {
  async findById(id: string): Promise<WorkspaceDto | null> {
    return await prisma.workspace.findUnique({ where: { id } });
  }

  async findAll(): Promise<WorkspaceDto[] | null> {
    return await prisma.workspace.findMany();
  }

  async create(
    userId: string,
    data: CreateWorkspaceInput,
  ): Promise<WorkspaceDto> {
    return prisma.$transaction(async (tx) => {
      const workspace = await tx.workspace.create({ data });
      await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId: workspace.id,
          role: 'ADMIN',
        },
      });
      return workspace;
    });
  }

  async updateById(
    id: string,
    data: UpdateWorkspaceInput,
  ): Promise<WorkspaceDto | null> {
    return await prisma.workspace.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<WorkspaceDto | null> {
    return await prisma.workspace.delete({ where: { id } });
  }
}
