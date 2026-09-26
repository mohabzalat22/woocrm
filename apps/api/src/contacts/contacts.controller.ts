import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOperation,
  ApiParam,
  ApiProduces,
  ApiTags,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import type { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { CurrentWorkspace } from '../common/decorators/current-workspace.decorator';
import {
  ContactResponseDto,
  ContactsPageResponseDto,
  CreateContactDto,
  CreateContactInfoDto,
  ListContactsDto,
  UpdateContactDto,
  UpdateContactInfoDto,
} from './dto';
import { ContactsService } from './contacts.service';
import { RequirePermissions } from '../common/decorators/permissions.decorator';
import { Permission } from '@repo/shared-types';

@ApiTags('contacts')
@ApiCookieAuth('access_token')
@Controller('workspaces/:workspaceId/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Get()
  @ApiOperation({ summary: 'List, search, filter, and paginate contacts' })
  @ApiParam({ name: 'workspaceId' })
  @ZodResponse({ status: 200, type: ContactsPageResponseDto })
  @RequirePermissions(Permission.CONTACT_VIEW)
  findAll(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Query() query: ListContactsDto,
  ) {
    return this.contactsService.findAll(userId, workspaceId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a contact' })
  @ApiParam({ name: 'workspaceId' })
  @ZodResponse({ status: 201, type: ContactResponseDto })
  @RequirePermissions(Permission.CONTACT_CREATE)
  create(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Body() data: CreateContactDto,
  ) {
    return this.contactsService.create(userId, workspaceId, data);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  @ApiOperation({ summary: 'Export workspace contacts as CSV' })
  @ApiParam({ name: 'workspaceId' })
  @ApiProduces('text/csv')
  @RequirePermissions(Permission.CONTACT_EXPORT)
  async export(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Res({ passthrough: true }) response: Response,
  ) {
    response.setHeader(
      'Content-Disposition',
      'attachment; filename="contacts.csv"',
    );
    return this.contactsService.export(userId, workspaceId);
  }

  @Get(':contactId')
  @ApiOperation({ summary: 'Get a contact and all contact information' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'contactId' })
  @ZodResponse({ status: 200, type: ContactResponseDto })
  @RequirePermissions(Permission.CONTACT_VIEW)
  findById(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.contactsService.findById(userId, workspaceId, contactId);
  }

  @Patch(':contactId')
  @ApiOperation({ summary: 'Update a contact' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'contactId' })
  @ZodResponse({ status: 200, type: ContactResponseDto })
  @RequirePermissions(Permission.CONTACT_EDIT)
  update(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Param('contactId') contactId: string,
    @Body() data: UpdateContactDto,
  ) {
    return this.contactsService.update(userId, workspaceId, contactId, data);
  }

  @Delete(':contactId')
  @ApiOperation({ summary: 'Delete a contact and its contact information' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'contactId' })
  @ZodResponse({ status: 200, type: ContactResponseDto })
  @RequirePermissions(Permission.CONTACT_DELETE)
  delete(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.contactsService.delete(userId, workspaceId, contactId);
  }

  @Post(':contactId/contact-infos')
  @ApiOperation({ summary: 'Add contact information' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'contactId' })
  @ZodResponse({ status: 201, type: ContactResponseDto })
  @RequirePermissions(Permission.CONTACT_CREATE)
  async createInfo(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Param('contactId') contactId: string,
    @Body() data: CreateContactInfoDto,
  ) {
    await this.contactsService.createInfo(userId, workspaceId, contactId, data);
    return this.contactsService.findById(userId, workspaceId, contactId);
  }

  @Patch(':contactId/contact-infos/:contactInfoId')
  @ApiOperation({ summary: 'Update contact information' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'contactId' })
  @ApiParam({ name: 'contactInfoId' })
  @ZodResponse({ status: 200, type: ContactResponseDto })
  @RequirePermissions(Permission.CONTACT_EDIT)
  async updateInfo(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Param('contactId') contactId: string,
    @Param('contactInfoId') contactInfoId: string,
    @Body() data: UpdateContactInfoDto,
  ) {
    await this.contactsService.updateInfo(
      userId,
      workspaceId,
      contactId,
      contactInfoId,
      data,
    );
    return this.contactsService.findById(userId, workspaceId, contactId);
  }

  @Delete(':contactId/contact-infos/:contactInfoId')
  @ApiOperation({ summary: 'Delete contact information' })
  @ApiParam({ name: 'workspaceId' })
  @ApiParam({ name: 'contactId' })
  @ApiParam({ name: 'contactInfoId' })
  @ZodResponse({ status: 200, type: ContactResponseDto })
  @RequirePermissions(Permission.CONTACT_DELETE)
  async deleteInfo(
    @CurrentUser('id') userId: string,
    @CurrentWorkspace('workspaceId') workspaceId: string,
    @Param('contactId') contactId: string,
    @Param('contactInfoId') contactInfoId: string,
  ) {
    await this.contactsService.deleteInfo(
      userId,
      workspaceId,
      contactId,
      contactInfoId,
    );
    return this.contactsService.findById(userId, workspaceId, contactId);
  }
}
