import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiParam,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { NotesService } from './notes.service';
import {
  CreateNoteDto,
  UpdateNoteDto,
  NoteResponseDto,
  NoteListResponseDto,
} from './dto';
import { CurrentWorkspace } from '../common/decorators/current-workspace.decorator';
import { ZodSerializerDto } from 'nestjs-zod';

@ApiTags('Notes')
@ApiCookieAuth('access_token')
@Controller('workspaces/:workspaceId/conversations/:conversationId/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get()
  @ApiOperation({ summary: 'List notes of a conversation' })
  @ApiParam({
    name: 'conversationId',
    type: String,
    format: 'uuid',
    description: 'The ID of the conversation',
  })
  @ZodSerializerDto(NoteListResponseDto)
  @ApiOkResponse({
    description: 'List Notes',
    type: NoteListResponseDto.Output,
  })
  findAll(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.notesService.findAll(conversationId, userId, workspaceId);
  }

  @Get('/last')
  @ApiOperation({ summary: 'get last note of a conversation' })
  @ApiParam({
    name: 'conversationId',
    type: String,
    format: 'uuid',
    description: 'The ID of the conversation',
  })
  @ZodSerializerDto(NoteResponseDto)
  @ApiOkResponse({
    description: 'List Notes',
    type: NoteResponseDto.Output,
  })
  findLast(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Param('conversationId') conversationId: string,
  ) {
    return this.notesService.findLast(conversationId, userId, workspaceId);
  }

  @Get(':noteId')
  @ApiOperation({ summary: 'Get a note' })
  @ApiParam({
    name: 'conversationId',
    type: String,
    format: 'uuid',
    description: 'The ID of the conversation',
  })
  @ApiParam({
    name: 'noteId',
    type: String,
    format: 'uuid',
    description: 'The ID of the note',
  })
  @ZodSerializerDto(NoteResponseDto)
  @ApiOkResponse({
    description: 'Get Note',
    type: NoteResponseDto.Output,
  })
  @ApiNotFoundResponse({
    description: 'Note not found',
  })
  findById(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Param('conversationId') conversationId: string,
    @Param('noteId') noteId: string,
  ) {
    return this.notesService.findById(
      noteId,
      conversationId,
      userId,
      workspaceId,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Add a note to a conversation' })
  @ApiParam({
    name: 'conversationId',
    type: String,
    format: 'uuid',
    description: 'The ID of the conversation',
  })
  @ZodSerializerDto(NoteResponseDto)
  @ApiCreatedResponse({
    description: 'Create Note',
    type: NoteResponseDto.Output,
  })
  create(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Param('conversationId') conversationId: string,
    @Body() data: CreateNoteDto,
  ) {
    return this.notesService.create(conversationId, userId, workspaceId, data);
  }

  @Patch(':noteId')
  @ApiOperation({ summary: 'Edit a note' })
  @ApiParam({
    name: 'conversationId',
    type: String,
    format: 'uuid',
    description: 'The ID of the conversation',
  })
  @ApiParam({
    name: 'noteId',
    type: String,
    format: 'uuid',
    description: 'The ID of the note',
  })
  @ZodSerializerDto(NoteResponseDto)
  @ApiOkResponse({
    description: 'Update Note',
    type: NoteResponseDto.Output,
  })
  @ApiNotFoundResponse({
    description: 'Note not found',
  })
  updateById(
    @Param('noteId') noteId: string,
    @Param('conversationId') conversationId: string,
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Body() data: UpdateNoteDto,
  ) {
    return this.notesService.updateById(
      noteId,
      conversationId,
      userId,
      workspaceId,
      data,
    );
  }

  @Delete(':noteId')
  @ApiOperation({ summary: 'Delete a note' })
  @ApiParam({
    name: 'conversationId',
    type: String,
    format: 'uuid',
    description: 'The ID of the conversation',
  })
  @ApiParam({
    name: 'noteId',
    type: String,
    format: 'uuid',
    description: 'The ID of the note',
  })
  @ApiNoContentResponse({ description: 'Note deleted' })
  @ApiNotFoundResponse({
    description: 'Note not found',
  })
  async deleteById(
    @Param('noteId') noteId: string,
    @Param('conversationId') conversationId: string,
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
  ) {
    await this.notesService.deleteById(
      noteId,
      conversationId,
      userId,
      workspaceId,
    );
  }
}
