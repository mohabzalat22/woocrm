import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request, Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import type { AuthResult } from './auth.service';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from './constants/auth.constants';
import {
  durationToMilliseconds,
  extractRefreshToken,
} from './utils/token-cookie.util';

import { AuthResponseDto, RegisterDto, SignInDto } from './dto/index';
@ApiTags('auth')
@Controller('auth')
@Public()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiConflictResponse({ description: 'Email is already registered' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ZodResponse({
    status: 201,
    description: 'Created user; tokens are set as HttpOnly cookies',
    type: AuthResponseDto,
  })
  async register(
    @Body() dto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.register(dto);
    this.setAuthCookies(response, result);
    return this.toPublicAuthResponse(result);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Sign in and receive secure auth cookies' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ZodResponse({
    status: 200,
    description: 'Signed-in user; tokens are set as HttpOnly cookies',
    type: AuthResponseDto,
  })
  async signIn(
    @Body() dto: SignInDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const result = await this.authService.signIn(dto.email, dto.password);
    this.setAuthCookies(response, result);
    return this.toPublicAuthResponse(result);
  }

  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({
    summary: 'Rotate the refresh token and issue a new access token',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token' })
  @ZodResponse({
    status: 200,
    description: 'Rotated auth cookies',
    type: AuthResponseDto,
  })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = extractRefreshToken(request);
    const user = request.user as { id: string };

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token cookie was not found');
    }

    const result = await this.authService.refresh(user.id, refreshToken);
    this.setAuthCookies(response, result);
    return this.toPublicAuthResponse(result);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  @UseGuards(RefreshTokenGuard)
  @ApiOperation({ summary: 'Revoke the refresh token and clear the cookie' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = request.user as { id: string };
    await this.authService.revokeRefreshToken(user.id);
    this.clearAuthCookies(response);
  }

  private toPublicAuthResponse(result: AuthResult) {
    return {
      user: result.user,
    };
  }

  private setAuthCookies(response: Response, result: AuthResult) {
    const secure = this.configService.get<string>('NODE_ENV') === 'production';

    const accessExpiresIn = this.configService.getOrThrow<string>(
      'JWT_ACCESS_EXPIRES_IN',
    );

    const refreshExpiresIn = this.configService.getOrThrow<string>(
      'JWT_REFRESH_EXPIRES_IN',
    );

    response.cookie(ACCESS_TOKEN_COOKIE, result.accessToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/api',
      maxAge: durationToMilliseconds(accessExpiresIn),
    });

    response.cookie(REFRESH_TOKEN_COOKIE, result.refreshToken, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/api/auth',
      maxAge: durationToMilliseconds(refreshExpiresIn),
    });
  }

  private clearAuthCookies(response: Response) {
    const secure = this.configService.get<string>('NODE_ENV') === 'production';

    response.clearCookie(ACCESS_TOKEN_COOKIE, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/api',
    });

    response.clearCookie(REFRESH_TOKEN_COOKIE, {
      httpOnly: true,
      secure,
      sameSite: 'lax',
      path: '/api/auth',
    });
  }
}
