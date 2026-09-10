import { createZodDto } from 'nestjs-zod';
import { UserWithPasswordSchema } from '../schemas/index';

export class UserWithPasswordDto extends createZodDto(UserWithPasswordSchema) {}
