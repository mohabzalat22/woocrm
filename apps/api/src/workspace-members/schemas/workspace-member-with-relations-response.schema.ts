import { WorkspaceMemberResponseSchema } from './index';
import { RoleResponseSchema } from '../../roles/schemas/role-response.schema';
import { UserResponseSchema } from '../../users/schemas/user-response.schema';

export const WorkspaceMemberWithRelationsResponseSchema =
  WorkspaceMemberResponseSchema.extend({
    user: UserResponseSchema.pick({
      id: true,
      email: true,
      name: true,
    }),
    role: RoleResponseSchema,
  });
