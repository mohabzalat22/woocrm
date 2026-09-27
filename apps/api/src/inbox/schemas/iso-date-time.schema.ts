import { z } from 'zod';

export const IsoDateTimeSchema = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.iso.datetime(),
);

export const NullableIsoDateTimeSchema = IsoDateTimeSchema.nullable();
