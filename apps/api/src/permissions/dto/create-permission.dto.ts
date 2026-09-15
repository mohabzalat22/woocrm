import { createZodDto } from 'nestjs-zod';
import { CreatePermissionSchema } from '../schemas';

export class CreatePermissionDto extends createZodDto(CreatePermissionSchema) {}
