import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { WhatsAppOAuthCallbackDto } from './dto';
import { Public as PublicRoute } from '../common/decorators/public.decorator';
import { WhatsAppConnectionService } from './whatsapp-connection.service';

const STATE_COOKIE = 'whatsapp_oauth_state';

@Controller('messaging/whatsapp/oauth')
export class WhatsAppOAuthController {
  constructor(
    private readonly service: WhatsAppConnectionService,
    private readonly configService: ConfigService,
  ) {}

  @Get('callback')
  @PublicRoute()
  async callback(
    @Query() query: WhatsAppOAuthCallbackDto,
    @Req() request: Request,
    @Res() response: Response,
  ) {
    const { state, code, error } = query;
    const webOrigin = this.configService.get<string>(
      'WEB_ORIGIN',
      'http://localhost:3001',
    );
    const redirect = (result: string) => {
      response.clearCookie(STATE_COOKIE, {
        path: '/api/messaging/whatsapp/oauth',
      });
      response.redirect(
        `${webOrigin}/settings?tab=channels&whatsapp=${result}`,
      );
    };

    const cookieState = readCookie(request.headers.cookie, STATE_COOKIE);
    if (!state || !cookieState || state.length > 256 || state !== cookieState) {
      return redirect('invalid_state');
    }

    if (error || !code) {
      return redirect('cancelled');
    }

    try {
      await this.service.completeAuthorization(state, code);
      return redirect('connected');
    } catch {
      return redirect('failed');
    }
  }
}

function readCookie(header: string | undefined, name: string): string | null {
  const prefix = `${name}=`;
  const cookie = header
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(prefix));

  return cookie ? decodeURIComponent(cookie.slice(prefix.length)) : null;
}
