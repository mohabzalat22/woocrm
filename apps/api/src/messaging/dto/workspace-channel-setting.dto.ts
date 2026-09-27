import { createZodDto } from 'nestjs-zod';
import { WorkspaceChannelSettingSchema } from '../schemas';

export class WorkspaceChannelSettingDto extends createZodDto(
  WorkspaceChannelSettingSchema,
) {}
