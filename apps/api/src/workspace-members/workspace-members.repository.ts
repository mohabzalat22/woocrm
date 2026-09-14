import { Injectable } from '@nestjs/common';
import prisma from '@repo/database';

@Injectable()
export class WorkspaceMembersRepository {
  async findById(id: string) {
    return await prisma.workspaceMembers.findUnique({ where: { id } });
  }

  async findAll() {
    return await prisma.workspaceMembers.findMany();
  }

  async create(data) {
    return await prisma.workspaceMembers.create(data);
  }

  async updateById(id: string, data) {
    return await prisma.workspaceMembers.update({ where: { id }, data });
  }

  async deleteById(id: string) {
    return await prisma.workspaceMembers.delete({ where: { id } });
  }
}
