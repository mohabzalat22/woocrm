import prisma from '@repo/database';
import { PermissionDto, RolePermissionDto } from './dto';
import { CreatePermissionInput } from './schemas/create-permission.schema';
import { UpdatePermissionInput } from './schemas/update-permission.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsRepository {
  async findById(id: string): Promise<PermissionDto | null> {
    return await prisma.permission.findUnique({ where: { id } });
  }

  async findByIdAndRoleId(
    id: string,
    roleId: string,
  ): Promise<PermissionDto | null> {
    return await prisma.permission.findFirst({
      where: {
        id,
        roles: {
          some: { roleId },
        },
      },
    });
  }

  async findAllByRoleId(roleId: string): Promise<PermissionDto[] | []> {
    return await prisma.permission.findMany({
      where: {
        roles: {
          some: { roleId },
        },
      },
    });
  }

  async create(
    roleId: string,
    data: CreatePermissionInput,
  ): Promise<PermissionDto> {
    return prisma.$transaction(async (tx) => {
      const permission = await tx.permission.create({ data });

      // assign permission to the role
      await tx.rolePermission.create({
        data: {
          roleId,
          permissionId: permission.id,
        },
      });

      return permission;
    });
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
    roleId: string,
    permissionId: string,
  ): Promise<RolePermissionDto> {
    return await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
  }

  async detachPermissionFromRole(
    roleId: string,
    permissionId: string,
  ): Promise<RolePermissionDto> {
    return await prisma.rolePermission.delete({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });
  }
}
