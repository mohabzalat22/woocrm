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

  async countByWorkspaceAndRoleName(
    workspaceId: string,
    roleName: 'ADMIN' | 'MANAGER' | 'AGENT',
  ): Promise<number> {
    return prisma.workspaceMember.count({
      where: { workspaceId, role: { name: roleName } },
    });
  }

  async create(
    data: CreateWorkspaceMemberInput,
    workspaceId: string,
  ): Promise<WorkspaceMemberDto> {
    return await prisma.workspaceMember.create({ data: { ...data, workspaceId } });
  }

  async updateById(
    id: string,
    workspaceId: string,
    data: UpdateWorkspaceMemberInput,
  ): Promise<WorkspaceMemberDto> {
    const result = await prisma.workspaceMember.updateMany({
      where: { id, workspaceId },
      data,
    });
    if (result.count !== 1) throw new Error('Member not found in this workspace');
    return (await prisma.workspaceMember.findFirst({ where: { id, workspaceId } }))!;
  }

  async deleteById(id: string, workspaceId: string): Promise<WorkspaceMemberDto> {
    const existing = await prisma.workspaceMember.findFirst({ where: { id, workspaceId } });
    if (!existing) throw new Error('Member not found in this workspace');
    await prisma.workspaceMember.deleteMany({ where: { id, workspaceId } });
    return existing;
  }
}
