import { z } from 'zod';
import { WorkspaceMemberSchema } from '../../workspace-members/schemas/workspace-member.schema';
import { RoleSchema } from '../../roles/schemas/role.schema';

export const WorkspaceMemberWithRoleSchema = WorkspaceMemberSchema.extend({
  role: RoleSchema,
});

export type WorkspaceMemberWithRoleInput = z.infer<
  typeof WorkspaceMemberWithRoleSchema
>;
