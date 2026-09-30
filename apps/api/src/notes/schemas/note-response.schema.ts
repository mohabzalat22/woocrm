import { z } from 'zod';
import { NoteSchema } from './note.schema';
import { dateToString } from '../../common/types/dateToString';

export const NoteResponseSchema = NoteSchema.extend({
  createdAt: dateToString,
  updatedAt: dateToString,
});

export const NoteListResponseSchema = z.array(NoteResponseSchema);
