import { SystemRole } from '@repo/shared-types';

export interface JwtPayload {
  sub: string;
  name: string | null;
  email: string;
  systemRole: SystemRole;
  iat?: number;
  exp?: number;
}
