import { createZodDto } from 'nestjs-zod';
import { RoleSchema } from '../schemas';

export class RoleDto extends createZodDto(RoleSchema) {}
