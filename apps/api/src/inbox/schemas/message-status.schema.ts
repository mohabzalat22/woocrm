import { z } from 'zod';
import { MESSAGE_STATUSES } from '@repo/shared-types';

export const MessageStatusSchema = z.enum(MESSAGE_STATUSES);
