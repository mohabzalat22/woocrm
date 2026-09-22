import { createZodDto } from 'nestjs-zod';
import { WorkspaceMemberWithRelationsSchema } from '../schemas';

export class WorkspaceMemberWithRelationsDto extends createZodDto(
  WorkspaceMemberWithRelationsSchema,
) {}
