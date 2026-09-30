import { createZodDto } from 'nestjs-zod';
import { NoteListResponseSchema, NoteResponseSchema } from '../schemas';

export class NoteResponseDto extends createZodDto(NoteResponseSchema, {
  codec: true,
}) {}
export class NoteListResponseDto extends createZodDto(NoteListResponseSchema) {}
