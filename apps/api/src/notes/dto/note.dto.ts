import { createZodDto } from 'nestjs-zod';
import { NoteSchema } from '../schemas';

export class NoteDto extends createZodDto(NoteSchema) {}
