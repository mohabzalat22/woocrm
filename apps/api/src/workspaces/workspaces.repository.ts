import prisma from '@repo/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceRepository {
  async findById(id: string) {
    return await prisma.workspace.findUnique({ where: { id } });
  }

  async findAll() {
    return await prisma.workspace.findMany();
  }

  async create(data) {
    return await prisma.workspace.create(data);
  }

  async updateById(id: string, data) {
    return await prisma.workspace.update({ where: { id }, data });
  }

  async deleteById(id: string) {
    return await prisma.workspace.delete({ where: { id } });
  }
}
