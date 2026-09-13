import { createZodDto } from 'nestjs-zod';
import { SignInSchema } from '../schemas/index';

export class SignInDto extends createZodDto(SignInSchema) {}
