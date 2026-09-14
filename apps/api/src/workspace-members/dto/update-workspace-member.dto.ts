import { createZodDto } from 'nestjs-zod';
import { UpdateWorkspaceMemberSchema } from '../schemas';

export class UpdateWorkspaceMemberDto extends createZodDto(
  UpdateWorkspaceMemberSchema,
) {}
