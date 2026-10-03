import { Injectable } from '@nestjs/common';
import prisma from '@repo/database';
import {
  UpsertWhatsAppConnectionDto,
  WhatsAppConnectionDto,
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

  findByPhoneNumberId(
    phoneNumberId: string,
  ): Promise<WhatsAppConnectionDto | null> {
    return prisma.whatsAppConnection.findFirst({ where: { phoneNumberId } });
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
}
