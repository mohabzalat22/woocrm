import { createZodDto } from 'nestjs-zod';
import { AccessTokenSchema } from '../schemas/index';

export class AccessTokenDto extends createZodDto(AccessTokenSchema) {}
