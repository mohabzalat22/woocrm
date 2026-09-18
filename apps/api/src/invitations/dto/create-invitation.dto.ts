import { createZodDto } from 'nestjs-zod';
import { CreateInvitationSchema } from '../schemas/create-invitation.schema';

export class CreateInvitationDto extends createZodDto(CreateInvitationSchema) {}
