import { createZodDto } from 'nestjs-zod';
import { WorkspaceMemberSchema } from '../schemas';

export class WorkspaceMemberDto extends createZodDto(WorkspaceMemberSchema) {}
