export interface JwtPayload {
  sub: string;
  name: string | null;
  email: string;
  iat?: number;
  exp?: number;
}
