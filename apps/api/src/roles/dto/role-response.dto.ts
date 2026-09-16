import { createZodDto } from 'nestjs-zod';
import { RoleResponseSchema } from '../schemas/role-response.schema';

export class RoleResponseDto extends createZodDto(RoleResponseSchema) {}
