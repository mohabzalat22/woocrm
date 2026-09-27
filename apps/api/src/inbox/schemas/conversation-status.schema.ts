import { z } from 'zod';
import { CONVERSATION_STATUSES } from '@repo/shared-types';

export const ConversationStatusSchema = z.enum(CONVERSATION_STATUSES);
