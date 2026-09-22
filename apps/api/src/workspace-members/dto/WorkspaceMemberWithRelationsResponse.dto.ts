import { createZodDto } from 'nestjs-zod';
import { WorkspaceMemberWithRelationsResponseSchema } from '../schemas';

export class WorkspaceMemberWithRelationsResponseDto extends createZodDto(
  WorkspaceMemberWithRelationsResponseSchema,
) {}
