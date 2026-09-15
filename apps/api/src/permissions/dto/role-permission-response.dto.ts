import { createZodDto } from 'nestjs-zod';
import { RolePermissionResponseSchema } from '../schemas/role-permission-response.schema';

export class RolePermissionResponseDto extends createZodDto(
  RolePermissionResponseSchema,
) {}
