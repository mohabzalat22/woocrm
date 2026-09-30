import { z } from 'zod';

export const dateToString = z.codec(z.date(), z.iso.datetime(), {
  decode: (date) => date.toISOString(),
  encode: (value) => new Date(value),
});
