import { createZodDto } from 'nestjs-zod';
import { UserResponseSchema } from '../schemas/user-response.schema';

export class UserResponseDto extends createZodDto(UserResponseSchema) {}
