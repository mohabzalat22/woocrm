import { z } from 'zod';
import { NoteSchema } from './note.schema';
import { stringToDate } from '../../common/types/stringToDate';

export const NoteResponseSchema = NoteSchema.extend({
  createdAt: stringToDate,
  updatedAt: stringToDate,
});

export const NoteListResponseSchema = z.array(NoteResponseSchema);
