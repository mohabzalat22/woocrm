import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ZodResponse } from 'nestjs-zod';
import { WhatsAppConnectionResponseDto } from './dto';
import { WhatsAppConnectionService } from './whatsapp-connection.service';

@Controller('workspaces/:workspaceId/messaging/whatsapp')
export class WhatsAppConnectionController {
  constructor(
    private readonly whatsAppConnectionService: WhatsAppConnectionService,
  ) {}

  @Get()
  @ZodResponse({ status: 200, type: WhatsAppConnectionResponseDto })
  getStatus(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.whatsAppConnectionService.getStatus(userId, workspaceId);
  }

  @Get('oauth/start')
  async startOAuth(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
    @Res() response: Response,
  ) {
    const url = await this.whatsAppConnectionService.createAuthorizationUrl(
      userId,
      workspaceId,
    );
    response.cookie(
      'whatsapp_oauth_state',
      new URL(url).searchParams.get('state'),
      {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 10 * 60 * 1000,
        path: '/api/messaging/whatsapp/oauth',
      },
    );
    response.redirect(url);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  disconnect(
    @CurrentUser('id') userId: string,
    @Param('workspaceId') workspaceId: string,
  ) {
    return this.whatsAppConnectionService.disconnect(userId, workspaceId);
  }
}
