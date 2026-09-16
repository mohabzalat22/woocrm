import { Injectable } from '@nestjs/common';
import prisma from '@repo/database';
import { WorkspaceMemberDto } from './dto/index';
import { CreateWorkspaceMemberInput } from './schemas/create-workspace-member.schema';
import { UpdateWorkspaceMemberInput } from './schemas/update-workspace-member.schema';

@Injectable()
export class WorkspaceMembersRepository {
  async findById(
    id: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto | null> {
    return await prisma.workspaceMember.findFirst({
      where: { id, workspaceId },
    });
  }

  async findByUserId(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto | null> {
    return prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });
  }

  async findAllByWorkspaceId(
    workspaceId: string,
  ): Promise<WorkspaceMemberDto[] | []> {
    return await prisma.workspaceMember.findMany({
      where: { workspaceId },
    });
  }

  async create(data: CreateWorkspaceMemberInput): Promise<WorkspaceMemberDto> {
    return await prisma.workspaceMember.create({ data });
  }

  async updateById(
    id: string,
    data: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMemberDto> {
    return await prisma.workspaceMember.update({
      where: { id },
      data,
    });
  }

  async deleteById(id: string): Promise<WorkspaceMemberDto> {
    return await prisma.workspaceMember.delete({
      where: { id },
    });
  }
}
