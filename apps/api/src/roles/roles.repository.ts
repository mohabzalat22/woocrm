import { Injectable } from '@nestjs/common';
import prisma, { PrismaClient } from '@repo/database';
import { RoleDto } from './dto';

type TransactionClient = { role: PrismaClient['role'] };

const DEFAULT_ROLE_NAMES = ['ADMIN', 'MANAGER', 'AGENT'] as const;

@Injectable()
export class RolesRepository {
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

    return adminRole;
  }
}
