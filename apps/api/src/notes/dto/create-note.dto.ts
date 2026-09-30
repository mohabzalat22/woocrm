import { createZodDto } from 'nestjs-zod';
import { CreateNoteSchema } from '../schemas';

export class CreateNoteDto extends createZodDto(CreateNoteSchema) {}
