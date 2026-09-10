import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { SignInDto } from './dto/sign-in.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() dto: SignInDto) {
    const accessToken = await this.authService.signIn(dto.email, dto.password);
    return { accessToken };
  }
}
