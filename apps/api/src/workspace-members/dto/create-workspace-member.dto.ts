import { createZodDto } from 'nestjs-zod';
import { CreateWorkspaceMemberSchema } from '../schemas';

export class CreateWorkspaceMemberDto extends createZodDto(
  CreateWorkspaceMemberSchema,
) {}
