import { createZodDto } from 'nestjs-zod';
import { UpdatePermissionSchema } from '../schemas';

export class UpdatePermissionDto extends createZodDto(UpdatePermissionSchema) {}
