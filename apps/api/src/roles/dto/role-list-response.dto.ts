import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { RoleResponseSchema } from '../schemas/role-response.schema';

export class RoleListResponseDto extends createZodDto(
  z.array(RoleResponseSchema),
  {
    codec: true,
  },
) {}