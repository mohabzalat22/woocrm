import prisma from '@repo/database';
import { PermissionDto, RolePermissionDto } from './dto';
import { CreatePermissionInput } from './schemas/create-permission.schema';
import { UpdatePermissionInput } from './schemas/update-permission.schema';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PermissionsRepository {
  async findAllByWorkspaceId(workspaceId: string): Promise<PermissionDto[]> {
    return await prisma.permission.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async findById(
    id: string,
    workspaceId: string,
  ): Promise<PermissionDto | null> {
    return await prisma.permission.findFirst({ where: { id, workspaceId } });
  }

  async findByIdAndRoleId(
    id: string,
    roleId: string,
    workspaceId: string,
  ): Promise<PermissionDto | null> {
    return await prisma.permission.findFirst({
      where: {
        id,
        workspaceId,
        roles: {
          some: { roleId, role: { workspaceId } },
        },
      },
    });
  }

  async findAllByRoleId(
    roleId: string,
    workspaceId: string,
  ): Promise<PermissionDto[] | []> {
    return await prisma.permission.findMany({
      where: {
        workspaceId,
        roles: {
          some: { roleId, role: { workspaceId } },
        },
      },
    });
  }

  async create(
    roleId: string,
    workspaceId: string,
    data: CreatePermissionInput,
  ): Promise<PermissionDto> {
    return prisma.$transaction(async (tx) => {
      const permission = await tx.permission.create({
        data: { ...data, workspaceId },
      });

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
    workspaceId: string,
    data: UpdatePermissionInput,
  ): Promise<PermissionDto> {
    const result = await prisma.permission.updateMany({
      where: { id, workspaceId },
      data,
    });
    if (result.count !== 1) throw new Error('Permission not found');
    return (await prisma.permission.findFirst({ where: { id, workspaceId } }))!;
  }

  async deleteById(id: string, workspaceId: string): Promise<PermissionDto> {
    const permission = await prisma.permission.findFirst({
      where: { id, workspaceId },
    });
    if (!permission) throw new Error('Permission not found');
    await prisma.permission.deleteMany({ where: { id, workspaceId } });
    return permission;
  }

  async assignPermissionToRole(
    roleId: string,
    permissionId: string,
    workspaceId: string,
  ): Promise<RolePermissionDto> {
    const [role, permission] = await Promise.all([
      prisma.role.findFirst({ where: { id: roleId, workspaceId } }),
      prisma.permission.findFirst({ where: { id: permissionId, workspaceId } }),
    ]);
    if (!role || !permission)
      throw new Error('Role or permission not found in this workspace');
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
    workspaceId: string,
  ): Promise<RolePermissionDto> {
    const assignment = await prisma.rolePermission.findFirst({
      where: { roleId, permissionId, role: { workspaceId } },
    });
    if (!assignment)
      throw new Error('Role permission not found in this workspace');
    return await prisma.rolePermission.delete({ where: { id: assignment.id } });
  }
}
