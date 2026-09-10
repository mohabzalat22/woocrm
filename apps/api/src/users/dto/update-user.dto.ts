import { createZodDto } from 'nestjs-zod';
import { UpdateUserSchema } from '../schemas/index';

export class UpdateUserDto extends createZodDto(UpdateUserSchema) {}
