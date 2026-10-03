import { ConflictException, Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { ChannelOAuthCallbackDto } from './dto';
import { Public as PublicRoute } from '../common/decorators/public.decorator';
import { WhatsAppConnectionService } from './whatsapp-connection.service';

const STATE_COOKIE_SUFFIX = 'oauth_state';

@Controller('messaging/:channel/oauth')
export class ChannelOAuthController {
  constructor(
    private readonly whatsappConnectionService: WhatsAppConnectionService,
    private readonly configService: ConfigService,
  ) {}

  @Get('callback')
  @PublicRoute()
  async callback(
    @Query() query: ChannelOAuthCallbackDto,
    @Req() request: Request,
    @Res() response: Response,
    @Param('channel') channel: string,
  ) {
    const { state, code, error } = query;
    if (!channel) {
      throw new ConflictException("error selecting channel")
    }
    const STATE_COOKIE_NAME = `${channel}_${STATE_COOKIE_SUFFIX}`

    const webOrigin = this.configService.get<string>(
      'WEB_ORIGIN',
      'http://localhost:3001',
    );

    const redirect = (result: string) => {
      response.clearCookie(STATE_COOKIE_NAME, {
        path: `/api/messaging/${channel}/oauth`,
      });

      response.redirect(
        `${webOrigin}/settings?tab=channels&${channel}=${result}`,
      );
    };

    const cookieState = readCookie(request.headers.cookie, STATE_COOKIE_NAME);

    if (!state || !cookieState || state.length > 256 || state !== cookieState) {
      return redirect('invalid_state');
    }

    if (error || !code) {
      return redirect('cancelled');
    }

    try {
      await this.whatsappConnectionService.completeAuthorization(state, code); // use strategy pattern here
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
