import { RoleResponseSchema } from '../../roles/schemas/role-response.schema';
import { UserResponseSchema } from '../../users/schemas/user-response.schema';
import { WorkspaceMemberSchema } from './workspace-member.schema';

export const WorkspaceMemberWithRelationsSchema = WorkspaceMemberSchema.extend({
  user: UserResponseSchema.pick({
    id: true,
    email: true,
    name: true,
  }),
  role: RoleResponseSchema,
});
