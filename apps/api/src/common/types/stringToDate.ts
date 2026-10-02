import { z } from 'zod';

export const stringToDate = z.codec(
  z.iso.datetime(),
  z
    .any()
    .refine((v): v is Date => v instanceof Date)
    .meta({ type: 'string', format: 'date-time' }),
  {
    decode: (s) => new Date(s),
    encode: (d) => d.toISOString(),
  },
);
