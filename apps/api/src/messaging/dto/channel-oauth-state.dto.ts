import { createZodDto } from 'nestjs-zod';
import { ChannelOAuthStateSchema } from '../schemas';

export class ChannelOAuthStateDto extends createZodDto(
  ChannelOAuthStateSchema,
) {}
