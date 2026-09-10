import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from '../schemas/index';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
