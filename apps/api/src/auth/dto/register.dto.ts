import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from '../../users/schemas/index';

export class RegisterDto extends createZodDto(CreateUserSchema) {}
