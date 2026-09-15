import prisma from '@repo/database';
import { PermissionDto, RolePermissionDto } from './dto';
import { CreatePermissionInput } from './schemas/create-permission.schema';
import { UpdatePermissionInput } from './schemas/update-permission.schema';
import { RoleInput } from '../workspace-members/schemas/role.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsRepository {
  async findById(id: string): Promise<PermissionDto | null> {
    return await prisma.permission.findUnique({ where: { id } });
  }

  async findAll(): Promise<PermissionDto[] | []> {
    return await prisma.permission.findMany();
  }

  async findAllForRole(role: RoleInput): Promise<PermissionDto[] | []> {
    return await prisma.permission.findMany({
      where: {
        roles: {
          some: { role },
        },
      },
    });
  }

  async create(data: CreatePermissionInput): Promise<PermissionDto> {
    return await prisma.permission.create({ data });
  }

  async updateById(
    id: string,
    data: UpdatePermissionInput,
  ): Promise<PermissionDto> {
    return await prisma.permission.update({ where: { id }, data });
  }

  async deleteById(id: string): Promise<PermissionDto> {
    return await prisma.permission.delete({ where: { id } });
  }

  async assignPermissionToRole(
    role: RoleInput,
    permissionId: string,
  ): Promise<RolePermissionDto> {
    return prisma.rolePermission.create({
      data: {
        role,
        permissionId,
      },
    });
  }

  async detachPermissionFromRole(
    role: RoleInput,
    permissionId: string,
  ): Promise<RolePermissionDto> {
    return await prisma.rolePermission.delete({
      where: {
        role_permissionId: {
          role,
          permissionId,
        },
      },
    });
  }
}
