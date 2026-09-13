import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ZodResponse } from 'nestjs-zod';
import { AuthService } from './auth.service';

import { AccessTokenDto, RegisterDto, SignInDto, UserDto } from './dto/index';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiConflictResponse({ description: 'Email is already registered' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ZodResponse({
    status: 201,
    description: 'Created user',
    type: UserDto,
  })
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Sign in and receive an access token' })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ZodResponse({
    status: 200,
    description: 'JWT access token',
    type: AccessTokenDto,
  })
  async signIn(@Body() dto: SignInDto) {
    const accessToken = await this.authService.signIn(dto.email, dto.password);
    return { accessToken };
  }
}
