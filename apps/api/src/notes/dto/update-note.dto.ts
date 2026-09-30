import { createZodDto } from 'nestjs-zod';
import { UpdateNoteSchema } from '../schemas';

export class UpdateNoteDto extends createZodDto(UpdateNoteSchema) {}
