import { createZodDto } from 'nestjs-zod';
import { PermissionSchema } from '../schemas';

export class PermissionDto extends createZodDto(PermissionSchema) {}
