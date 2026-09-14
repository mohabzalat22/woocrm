import { createZodDto } from 'nestjs-zod';
import { CreateWorkspaceSchema } from '../schemas/index';

export class CreateWorkspaceDto extends createZodDto(CreateWorkspaceSchema) {}
