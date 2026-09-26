import { Injectable, NotFoundException } from '@nestjs/common';
import { WorkspaceContextService } from '../authorization/workspace-context.service';
import type {
  CreateContactInfoInput,
  UpdateContactInfoInput,
  ListContactsInput,
  CreateContactInput,
  UpdateContactInput,
} from './schemas';
import type { ContactDto, ContactInfoDto, ContactsPageDto } from './dto';
import { ContactsRepository } from './contacts.repository';

@Injectable()
export class ContactsService {
  constructor(
    private readonly contactsRepository: ContactsRepository,
    private readonly workspaceContext: WorkspaceContextService,
  ) {}

  async findAll(
    userId: string,
    workspaceId: string,
    query: ListContactsInput,
  ): Promise<ContactsPageDto> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    return this.contactsRepository.findAll(workspaceId, query);
  }

  async findById(
    userId: string,
    workspaceId: string,
    contactId: string,
  ): Promise<ContactDto> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    return this.getContact(workspaceId, contactId);
  }

  async create(
    userId: string,
    workspaceId: string,
    data: CreateContactInput,
  ): Promise<ContactDto> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    return this.contactsRepository.create(workspaceId, data);
  }

  async update(
    userId: string,
    workspaceId: string,
    contactId: string,
    data: UpdateContactInput,
  ): Promise<ContactDto> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    await this.getContact(workspaceId, contactId);
    const updated = await this.contactsRepository.update(
      contactId,
      workspaceId,
      data,
    );
    if (!updated) throw new NotFoundException('Contact not found');
    return updated;
  }

  async delete(
    userId: string,
    workspaceId: string,
    contactId: string,
  ): Promise<ContactDto> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    await this.getContact(workspaceId, contactId);
    const deleted = await this.contactsRepository.delete(
      contactId,
      workspaceId,
    );
    if (!deleted) throw new NotFoundException('Contact not found');
    return deleted;
  }

  async export(userId: string, workspaceId: string): Promise<string> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    const contacts =
      await this.contactsRepository.findAllForExport(workspaceId);
    const rows = contacts.map((contact) => [
      contact.id,
      contact.name,
      contact.state,
      contact.contactInfos
        .map((info) => info.source + ':' + info.identity)
        .join(';'),
    ]);

    return [['id', 'name', 'state', 'contact_infos'], ...rows]
      .map((row) => row.map((value) => this.escapeCsv(value)).join(','))
      .join('\n');
  }

  async createInfo(
    userId: string,
    workspaceId: string,
    contactId: string,
    data: CreateContactInfoInput,
  ): Promise<ContactInfoDto> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    await this.getContact(workspaceId, contactId);
    return this.contactsRepository.createInfo(contactId, data);
  }

  async updateInfo(
    userId: string,
    workspaceId: string,
    contactId: string,
    contactInfoId: string,
    data: UpdateContactInfoInput,
  ): Promise<ContactInfoDto> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    await this.getContactInfo(workspaceId, contactId, contactInfoId);
    const updated = await this.contactsRepository.updateInfo(
      contactId,
      contactInfoId,
      data,
    );
    if (!updated) throw new NotFoundException('Contact info not found');
    return updated;
  }

  async deleteInfo(
    userId: string,
    workspaceId: string,
    contactId: string,
    contactInfoId: string,
  ): Promise<ContactInfoDto> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    await this.getContactInfo(workspaceId, contactId, contactInfoId);
    const deleted = await this.contactsRepository.deleteInfo(
      contactId,
      contactInfoId,
    );
    if (!deleted) throw new NotFoundException('Contact info not found');
    return deleted;
  }

  private async getContact(
    workspaceId: string,
    contactId: string,
  ): Promise<ContactDto> {
    const contact = await this.contactsRepository.findById(
      contactId,
      workspaceId,
    );
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  private async getContactInfo(
    workspaceId: string,
    contactId: string,
    contactInfoId: string,
  ): Promise<ContactInfoDto> {
    await this.getContact(workspaceId, contactId);
    const info = await this.contactsRepository.findInfo(
      contactId,
      contactInfoId,
    );
    if (!info) throw new NotFoundException('Contact info not found');
    return info;
  }

  private escapeCsv(value: string): string {
    return `"${value.replaceAll('"', '""')}"`;
  }
}
