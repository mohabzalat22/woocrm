import prisma from '@repo/database';
import { Injectable } from '@nestjs/common';
import { WorkspaceDto } from './dto';
import { CreateWorkspaceInput } from './schemas/create-workspace.schema';
import { UpdateWorkspaceInput } from './schemas/update-workspace.schema';
@Injectable()
export class WorkspaceRepository {
  async findById(id: string, userId: string): Promise<WorkspaceDto | null> {
    return await prisma.workspace.findFirst({
      where: {
        id,
        workspaceMembers: {
          some: {
            userId,
          },
        },
      },
    });
  }

  async findAll(userId: string): Promise<WorkspaceDto[] | []> {
    return prisma.workspace.findMany({
      where: {
        workspaceMembers: {
          some: {
            userId,
          },
        },
      },
    });
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
  ): Promise<WorkspaceDto> {
    return await prisma.workspace.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<WorkspaceDto> {
    return await prisma.workspace.delete({ where: { id } });
  }
}
