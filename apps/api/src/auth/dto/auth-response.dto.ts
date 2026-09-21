import { createZodDto } from 'nestjs-zod';
import { AuthResponseSchema } from '../schemas/auth-response.schema';

export class AuthResponseDto extends createZodDto(AuthResponseSchema) {}
