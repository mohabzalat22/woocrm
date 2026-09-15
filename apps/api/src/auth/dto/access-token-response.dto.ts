import { createZodDto } from 'nestjs-zod';
import { AccessTokenResponseSchema } from '../schemas/access-token-response.schema';

export class AccessTokenResponseDto extends createZodDto(
  AccessTokenResponseSchema,
) {}
