import { createZodDto } from 'nestjs-zod';
import { ListContactsSchema } from '../schemas';

export class ListContactsDto extends createZodDto(ListContactsSchema) {}
