import prisma from '@repo/database';
import { Injectable } from '@nestjs/common';
import type {
  CreateContactInput,
  UpdateContactInput,
  CreateContactInfoInput,
  ListContactsInput,
} from './schemas';

import type { ContactDto, ContactInfoDto, ContactsPageDto } from './dto';
const contactInclude = { contactInfo: true } as const;

@Injectable()
export class ContactsRepository {
  async findAll(
    workspaceId: string,
    query: ListContactsInput,
  ): Promise<ContactsPageDto> {
    const { search, state, page, limit } = query;
    const where = {
      workspaceId,
      ...(state ? { state } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' as const } },
              {
                contactInfo: {
                  is: {
                    identity: {
                      contains: search,
                      mode: 'insensitive' as const,
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [data, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        include: contactInclude,
        orderBy: { name: 'asc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.contact.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findAllForExport(workspaceId: string): Promise<ContactDto[]> {
    return prisma.contact.findMany({
      where: { workspaceId },
      include: contactInclude,
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string, workspaceId: string): Promise<ContactDto | null> {
    return prisma.contact.findFirst({
      where: { id, workspaceId },
      include: contactInclude,
    });
  }

  async create(
    workspaceId: string,
    data: CreateContactInput,
  ): Promise<ContactDto> {
    return prisma.contact.create({
      data: {
        workspaceId,
        name: data.name,
        state: data.state,
        contactInfo: data.contactInfo
          ? { create: data.contactInfo }
          : undefined,
      },
      include: contactInclude,
    });
  }

  async update(
    id: string,
    workspaceId: string,
    data: UpdateContactInput,
  ): Promise<ContactDto | null> {
    return prisma.$transaction(async (tx) => {
      const scalarData = {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.state !== undefined ? { state: data.state } : {}),
      };

      if (Object.keys(scalarData).length > 0) {
        await tx.contact.updateMany({
          where: { id, workspaceId },
          data: scalarData,
        });
      }

      if (data.contactInfo !== undefined) {
        if (data.contactInfo === null) {
          // deleteMany used to never throw error if infos doesnot exists
          await tx.contactInfo.deleteMany({ where: { contactId: id } });
        } else {
          await tx.contactInfo.upsert({
            where: { contactId: id },
            create: { ...data.contactInfo, contactId: id },
            update: data.contactInfo,
          });
        }
      }
      return tx.contact.findFirst({
        where: { id, workspaceId },
        include: contactInclude,
      });
    });
  }

  async delete(id: string, workspaceId: string): Promise<ContactDto | null> {
    const existing = await this.findById(id, workspaceId);
    if (!existing) return null;
    await prisma.contact.delete({ where: { id } });
    return existing;
  }

  async createInfo(
    contactId: string,
    data: CreateContactInfoInput,
  ): Promise<ContactInfoDto> {
    return prisma.contactInfo.create({
      data: { contactId, ...data },
    });
  }

  async findInfo(
    contactId: string,
    contactInfoId: string,
  ): Promise<ContactInfoDto | null> {
    return prisma.contactInfo.findFirst({
      where: { id: contactInfoId, contactId },
    });
  }

  async updateInfo(
    contactId: string,
    contactInfoId: string,
    data: { identity?: string; source?: string },
  ): Promise<ContactInfoDto | null> {
    const existing = await this.findInfo(contactId, contactInfoId);
    if (!existing) return null;

    return prisma.contactInfo.update({
      where: { id: existing.id },
      data,
    });
  }

  async deleteInfo(
    contactId: string,
    contactInfoId: string,
  ): Promise<ContactInfoDto | null> {
    const existing = await this.findInfo(contactId, contactInfoId);
    if (!existing) return null;
    await prisma.contactInfo.delete({ where: { id: existing.id } });
    return existing;
  }
  async findContactChannelIdentity(
    contactId: string,
    channel: string,
  ): Promise<ContactInfoDto | null> {
    return prisma.contactInfo.findFirst({
      where: { contactId, source: channel },
    });
  }
}
