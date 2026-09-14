import { createZodDto } from 'nestjs-zod';
import { WorkspaceSchema } from '../schemas/index';

export class WorkspaceDto extends createZodDto(WorkspaceSchema) {}
