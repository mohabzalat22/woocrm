import { createZodDto } from 'nestjs-zod';
import { SetWorkspaceChannelSchema } from '../schemas';

export class SetWorkspaceChannelDto extends createZodDto(
  SetWorkspaceChannelSchema,
) {}
