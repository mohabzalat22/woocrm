import { Injectable } from '@nestjs/common';
import prisma from '@repo/database';
import { CreateNoteInput } from './schemas';
import { UpdateNoteInput } from './schemas';
import { NoteDto } from './dto';

@Injectable()
export class NotesRepository {
  async findAll(
    conversationId: string,
    workspaceId: string,
  ): Promise<NoteDto[] | []> {
    return await prisma.note.findMany({
      where: { conversationId, conversation: { workspaceId } },
    });
  }

  async findLast(
    conversationId: string,
    workspaceId: string,
  ): Promise<NoteDto | null> {
    return await prisma.note.findFirst({
      where: {
        conversationId,
        conversation: { workspaceId },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(
    id: string,
    conversationId: string,
    workspaceId: string,
  ): Promise<NoteDto | null> {
    return await prisma.note.findFirst({
      where: { id, conversationId, conversation: { workspaceId } },
    });
  }

  async create(
    conversationId: string,
    workspaceMemberId: string, //author
    data: CreateNoteInput,
  ): Promise<NoteDto> {
    return await prisma.note.create({
      data: {
        content: data.content,
        conversationId,
        workspaceMemberId,
      },
    });
  }

  async updateById(
    id: string,
    conversationId: string,
    workspaceId: string,
    data: UpdateNoteInput,
  ): Promise<NoteDto> {
    return prisma.note.update({
      where: {
        id_conversationId: {
          id,
          conversationId,
        },
        conversation: {
          workspaceId,
        },
      },
      data,
    });
  }

  async deleteById(
    id: string,
    conversationId: string,
    workspaceId: string,
  ): Promise<void> {
    await prisma.note.delete({
      where: {
        id,
        conversationId,
        conversation: {
          workspaceId,
        },
      },
    });
  }
}
