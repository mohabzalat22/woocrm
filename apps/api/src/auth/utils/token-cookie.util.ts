import type { Request } from 'express';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from '../constants/auth.constants';

export function extractCookie(
  request: Request,
  cookieName: string,
): string | undefined {
  const cookieHeader = request.headers.cookie;
  if (!cookieHeader) return undefined;

  const cookie = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${cookieName}=`));

  if (!cookie) return undefined;

  const value = cookie.slice(`${cookieName}=`.length);

  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function extractAccessToken(request: Request): string | undefined {
  return extractCookie(request, ACCESS_TOKEN_COOKIE);
}

export function extractRefreshToken(request: Request): string | undefined {
  return extractCookie(request, REFRESH_TOKEN_COOKIE);
}

export function durationToMilliseconds(duration: string): number {
  const match = /^(\d+)\s*(s|m|h|d|w)$/i.exec(duration.trim());
  if (!match) {
    throw new Error(
      `Invalid token duration "${duration}". Use values such as 15m, 1h, or 7d.`,
    );
  }

  const amount = Number(match[1]);
  const units: Record<string, number> = {
    s: 1_000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
    w: 604_800_000,
  };

  return amount * units[match[2].toLowerCase()];
}
