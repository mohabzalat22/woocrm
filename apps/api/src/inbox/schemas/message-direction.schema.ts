import { z } from 'zod';
import { MESSAGE_DIRECTIONS } from '@repo/shared-types';

export const MessageDirectionSchema = z.enum(MESSAGE_DIRECTIONS);
