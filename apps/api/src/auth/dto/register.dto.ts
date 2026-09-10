import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from '../../users/schemas';

export class RegisterDto extends createZodDto(CreateUserSchema) {}
