import { createZodDto } from 'nestjs-zod';
import { UpdateWorkspaceSchema } from '../schemas/index';

export class UpdateWorkspaceDto extends createZodDto(UpdateWorkspaceSchema) {}
