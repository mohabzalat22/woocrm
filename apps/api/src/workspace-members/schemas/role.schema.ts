import { z } from 'zod';

export const RoleSchema = z.enum(['admin', 'manager', 'agent']);
export type RoleInput = z.infer<typeof RoleSchema>;
