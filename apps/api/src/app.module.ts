import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE, APP_FILTER } from '@nestjs/core';
import { resolve } from 'node:path';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';
import { ConfigModule } from '@nestjs/config';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { WorkspaceMembersModule } from './workspace-members/workspace-members.module';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { AuthorizationModule } from './authorization/authorization.module';
import { InvitationsModule } from './invitations/invitations.module';
import { MessagingModule } from './messaging/messaging.module';
import { ContactsModule } from './contacts/contacts.module';
import { InboxModule } from './inbox/inbox.module';
import { NotesModule } from './notes/notes.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions-filer';
@Module({
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ZodSerializerInterceptor,
    },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: resolve(process.cwd(), '../../.env'),
    }),
    UsersModule,
    AuthModule,
    AuthorizationModule,
    WorkspacesModule,
    WorkspaceMembersModule,
    PermissionsModule,
    RolesModule,
    InvitationsModule,
    MessagingModule,
    ContactsModule,
    InboxModule,
    NotesModule,
  ],
})
export class AppModule {}
