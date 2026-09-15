import { createZodDto } from 'nestjs-zod';
import { WorkspaceMemberResponseSchema } from '../schemas/workspace-member-response.schema';

export class WorkspaceMemberResponseDto extends createZodDto(
  WorkspaceMemberResponseSchema,
) {}
