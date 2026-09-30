import { Injectable, NotFoundException } from '@nestjs/common';
import { NotesRepository } from './notes.repository';
import { CreateNoteInput } from './schemas';
import { UpdateNoteInput } from './schemas';
import { NoteDto } from './dto';
import { WorkspaceContextService } from '../authorization/workspace-context.service';

@Injectable()
export class NotesService {
  constructor(
    private readonly notesRepository: NotesRepository,
    private readonly workspaceContextService: WorkspaceContextService,
  ) {}

  async findAll(
    conversationId: string,
    userId: string,
    workspaceId: string,
  ): Promise<NoteDto[]> {
    await this.workspaceContextService.requireMembership(userId, workspaceId);

    return this.notesRepository.findAll(conversationId, workspaceId);
  }

  async findLast(
    conversationId: string,
    userId: string,
    workspaceId: string,
  ): Promise<NoteDto> {
    await this.workspaceContextService.requireMembership(userId, workspaceId);

    const note = await this.notesRepository.findLast(
      conversationId,
      workspaceId,
    );

    if (!note) {
      throw new NotFoundException('Last Note not found');
    }

    return note;
  }

  async findById(
    id: string,
    conversationId: string,
    userId: string,
    workspaceId: string,
  ): Promise<NoteDto> {
    await this.workspaceContextService.requireMembership(userId, workspaceId);

    const note = await this.notesRepository.findById(
      id,
      conversationId,
      workspaceId,
    );

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    return note;
  }

  async create(
    conversationId: string,
    userId: string, // author current auth user
    workspaceId: string,
    data: CreateNoteInput, // content text
  ): Promise<NoteDto> {
    await this.workspaceContextService.requireMembership(userId, workspaceId);

    return await this.notesRepository.create(conversationId, workspaceId, data);
  }

  async updateById(
    id: string,
    conversationId: string,
    userId: string,
    workspaceId: string,
    data: UpdateNoteInput,
  ): Promise<NoteDto> {
    await this.workspaceContextService.requireMembership(userId, workspaceId);

    const note = await this.notesRepository.findById(
      id,
      conversationId,
      workspaceId,
    );

    if (!note) {
      throw new NotFoundException('Note not found');
    }
    return await this.notesRepository.updateById(
      id,
      conversationId,
      workspaceId,
      data,
    );
  }

  async deleteById(
    id: string,
    conversationId: string,
    userId: string,
    workspaceId: string,
  ): Promise<void> {
    await this.workspaceContextService.requireMembership(userId, workspaceId);
    const note = await this.notesRepository.findById(
      id,
      conversationId,
      workspaceId,
    );

    if (!note) {
      throw new NotFoundException('Note not found');
    }
    await this.notesRepository.deleteById(id, conversationId, workspaceId);
  }
}
