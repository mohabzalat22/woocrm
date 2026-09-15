import { createZodDto } from 'nestjs-zod';
import { PermissionResponseSchema } from '../schemas/permission-response.schema';

export class PermissionResponseDto extends createZodDto(
  PermissionResponseSchema,
) {}
