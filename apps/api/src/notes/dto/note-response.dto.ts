import { createZodDto } from 'nestjs-zod';
import { NoteListResponseSchema, NoteResponseSchema } from '../schemas';

export class NoteResponseDto extends createZodDto(NoteResponseSchema) {}
export class NoteListResponseDto extends createZodDto(NoteListResponseSchema) {}
