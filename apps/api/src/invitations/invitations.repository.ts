import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import prisma from '@repo/database';
import { CreateInvitationInput } from './schemas';

@Injectable()
export class InvitationsRepository {
  async create(
    createdById: string,
    workspaceId: string,
    token: string,
    data: CreateInvitationInput,
  ) {
    return prisma.workspaceInvite.create({
      data: {
        token,
        email: data.email,
        roleId: data.roleId,
        expiresAt: data.expiresAt,
        createdById,
        workspaceId,
      },
    });
  }

  async accept(token: string, userId: string, email: string) {
    return prisma.$transaction(async (tx) => {
      const invitation = await tx.workspaceInvite.findUnique({
        where: { token },
        include: { role: true },
      });

      if (!invitation || (invitation.expiresAt && invitation.expiresAt <= new Date())) {
        throw new NotFoundException('Invitation is invalid or expired');
      }
      if (invitation.email.toLowerCase() !== email.toLowerCase()) {
        throw new ConflictException('Invitation belongs to another email address');
      }

      const existing = await tx.workspaceMember.findUnique({
        where: { userId_workspaceId: { userId, workspaceId: invitation.workspaceId } },
      });
      if (existing) throw new ConflictException('User is already a member of this workspace');

      const member = await tx.workspaceMember.create({
        data: {
          userId,
          workspaceId: invitation.workspaceId,
          roleId: invitation.roleId,
        },
      });
      await tx.workspaceInvite.delete({ where: { id: invitation.id } });
      return member;
    });
  }
}
