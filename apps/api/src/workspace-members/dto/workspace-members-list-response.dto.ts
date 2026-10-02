import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { WorkspaceMemberWithRelationsResponseSchema } from '../schemas';

const WorkspaceMembersListResponseSchema = z.array(
  WorkspaceMemberWithRelationsResponseSchema,
);

export class WorkspaceMembersListResponseDto extends createZodDto(
  WorkspaceMembersListResponseSchema,
  { codec: true },
) {}
