import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { PermissionResponseSchema } from '../schemas/permission-response.schema';

export class PermissionListResponseDto extends createZodDto(
  z.array(PermissionResponseSchema),
  {
    codec: true,
  },
) {}