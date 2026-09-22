import { Injectable } from '@nestjs/common';
import prisma, { PrismaClient } from '@repo/database';
import { RoleDto } from './dto';
import { Permission, Role, RolePermissions } from '@repo/shared-types';

type TransactionClient = Pick<PrismaClient, 'role' | 'permission' | 'rolePermission'>;

const DEFAULT_ROLE_NAMES = ['ADMIN', 'MANAGER', 'AGENT'] as const;

@Injectable()
export class RolesRepository {
  async findAllByWorkspaceId(workspaceId: string): Promise<RoleDto[]> {
    return await prisma.role.findMany({
      where: { workspaceId },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, workspaceId: string): Promise<RoleDto | null> {
    return await prisma.role.findFirst({
      where: { id, workspaceId },
    });
  }

  async createDefaultsForWorkspace(
    tx: TransactionClient,
    workspaceId: string,
  ): Promise<RoleDto> {
    await tx.role.createMany({
      data: DEFAULT_ROLE_NAMES.map((name) => ({
        name,
        workspaceId,
      })),
    });

    const adminRole = await tx.role.findUnique({
      where: {
        workspaceId_name: {
          workspaceId,
          name: 'ADMIN',
        },
      },
    });

    if (!adminRole) {
      throw new Error('Failed to create default workspace roles');
    }

    const roles = await tx.role.findMany({ where: { workspaceId } });
    const permissions = await Promise.all(
      Object.values(Permission).map((name) =>
        tx.permission.create({
          data: { name, workspaceId },
        }),
      ),
    );
    await tx.rolePermission.createMany({
      data: roles.flatMap((role) =>
        RolePermissions[role.name.toLowerCase() as Role].map((permissionName) => ({
          roleId: role.id,
          permissionId: permissions.find((permission) => permission.name === permissionName)!.id,
        })),
      ),
    });

    return adminRole;
  }
}
