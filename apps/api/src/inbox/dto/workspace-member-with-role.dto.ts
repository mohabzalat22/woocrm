import { createZodDto } from 'nestjs-zod';
import { WorkspaceMemberWithRoleSchema } from '../schemas';

export class WorkspaceMemberWithRoleDto extends createZodDto(
  WorkspaceMemberWithRoleSchema,
) {}
