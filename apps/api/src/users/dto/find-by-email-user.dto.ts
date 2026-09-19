import { createZodDto } from 'nestjs-zod';
import { FindByEmailUserSchema } from '../schemas/index';

export class FindByEmailUserDto extends createZodDto(FindByEmailUserSchema) {}
