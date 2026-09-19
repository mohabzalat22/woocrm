import prisma from '@repo/database';
import { Injectable } from '@nestjs/common';
import { WorkspaceDto } from './dto';
import { CreateWorkspaceInput } from './schemas/create-workspace.schema';
import { UpdateWorkspaceInput } from './schemas/update-workspace.schema';
import { RolesRepository } from '../roles/roles.repository';

@Injectable()
export class WorkspaceRepository {
  constructor(private readonly rolesRepository: RolesRepository) {}
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
      const adminRole = await this.rolesRepository.createDefaultsForWorkspace(
        tx,
        workspace.id,
      );

      await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId: workspace.id,
          roleId: adminRole.id,
        },
      });

      const creatorMembership = await tx.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId: workspace.id,
          },
        },
      });
      if (!creatorMembership || creatorMembership.roleId !== adminRole.id) {
        throw new Error(
          'Failed to assign the creator the workspace ADMIN role',
        );
      }

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
