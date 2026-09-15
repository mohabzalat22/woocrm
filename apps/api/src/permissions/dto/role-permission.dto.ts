import { createZodDto } from 'nestjs-zod';
import { RolePermissionSchema } from '../schemas';

export class RolePermissionDto extends createZodDto(RolePermissionSchema) {}
