import { createZodDto } from 'nestjs-zod';
import { WorkspaceChannelResponseSchema } from '../schemas';

export class WorkspaceChannelResponseDto extends createZodDto(
  WorkspaceChannelResponseSchema,
  { codec: true },
) {}
