import { Injectable } from '@nestjs/common';
import prisma from '@repo/database';
import {
  CreateWhatsAppOAuthStateDto,
  UpsertWhatsAppConnectionDto,
  WhatsAppConnectionDto,
  WhatsAppOAuthStateDto,
} from './dto';

@Injectable()
export class WhatsAppConnectionRepository {
  findByWorkspaceId(
    workspaceId: string,
  ): Promise<WhatsAppConnectionDto | null> {
    return prisma.whatsAppConnection.findUnique({ where: { workspaceId } });
  }

  findByWhatsAppBusinessAccountId(
    whatsappBusinessAccountId: string,
  ): Promise<WhatsAppConnectionDto | null> {
    return prisma.whatsAppConnection.findFirst({
      where: { whatsappBusinessAccountId },
    });
  }

  upsert(
    workspaceId: string,
    data: UpsertWhatsAppConnectionDto,
  ): Promise<WhatsAppConnectionDto> {
    return prisma.whatsAppConnection.upsert({
      where: { workspaceId },
      create: { workspaceId, ...data, status: 'ACTIVE' },
      update: { ...data, status: 'ACTIVE', lastError: null },
    });
  }

  async deleteByWorkspaceId(workspaceId: string): Promise<number> {
    const result = await prisma.whatsAppConnection.deleteMany({
      where: { workspaceId },
    });

    return result.count;
  }

  createOAuthState(
    data: CreateWhatsAppOAuthStateDto,
  ): Promise<WhatsAppOAuthStateDto> {
    return prisma.whatsAppOAuthState.create({ data });
  }

  consumeOAuthState(stateHash: string): Promise<WhatsAppOAuthStateDto | null> {
    return prisma.$transaction(async (tx) => {
      const result = await tx.whatsAppOAuthState.updateMany({
        where: {
          stateHash,
          consumedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { consumedAt: new Date() },
      });

      if (result.count !== 1) {
        return null;
      }

      return tx.whatsAppOAuthState.findUnique({ where: { stateHash } });
    });
  }
}
