import { createZodDto } from 'nestjs-zod';
import { WorkspaceResponseSchema } from '../schemas/workspace-response.schema';

export class WorkspaceResponseDto extends createZodDto(
  WorkspaceResponseSchema,
) {}
