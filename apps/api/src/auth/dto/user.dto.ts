import { createZodDto } from 'nestjs-zod';
import { UserSchema } from '../schemas/index';

export class UserDto extends createZodDto(UserSchema) {}
