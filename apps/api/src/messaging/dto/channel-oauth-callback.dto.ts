import { createZodDto } from 'nestjs-zod';
import { ChannelOAuthCallbackSchema } from '../schemas';

export class ChannelOAuthCallbackDto extends createZodDto(
  ChannelOAuthCallbackSchema,
) {}
