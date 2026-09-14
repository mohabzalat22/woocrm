import { z } from 'zod';

export const RoleSchema = z.enum(['ADMIN', 'MANAGER', 'AGENT']);
export type RoleInput = z.infer<typeof RoleSchema>;
