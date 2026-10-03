import { createZodDto } from 'nestjs-zod';
import { CreateChannelOAuthStateSchema } from '../schemas';

export class CreateChannelOAuthStateDto extends createZodDto(
  CreateChannelOAuthStateSchema,
  {codec:true}
) {}
