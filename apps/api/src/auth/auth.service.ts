import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './types/jwt-payload.interface';
import type { RegisterDto } from './dto/register.dto';
import type { UserDto } from './dto/user.dto';
import type { AuthResponse } from './schemas/auth-response.schema';
import * as bcrypt from 'bcrypt';
import { SystemRole } from '@repo/shared-types';
import type { JwtSignOptions } from '@nestjs/jwt';
export interface AuthResult extends AuthResponse {
  accessToken: string;
  refreshToken: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(data: RegisterDto): Promise<AuthResult> {
    const existingUser = await this.usersService.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const user = await this.usersService.create({
      email: data.email,
      name: data.name,
      password: data.password,
    });

    return await this.issueTokens(user);
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return await this.issueTokens({
      id: user.id,
      name: user.name,
      email: user.email,
      systemRole: user.systemRole,
    });
  }

  async refresh(userId: string, refreshToken: string): Promise<AuthResult> {
    const userWithToken =
      await this.usersService.findByIdWithRefreshTokenHash(userId);

    if (!userWithToken?.refreshTokenHash) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokenMatches = await bcrypt.compare(
      refreshToken,
      userWithToken.refreshTokenHash,
    );

    if (!tokenMatches) {
      await this.usersService.updateRefreshTokenHash(userId, null);
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('User no longer exists');

    return await this.issueTokens(user);
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await this.usersService.updateRefreshTokenHash(userId, null);
  }

  private async issueTokens(user: UserDto): Promise<AuthResult> {
    const basePayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      systemRole: user.systemRole as SystemRole,
    };

    const accessToken = await this.jwtService.signAsync(
      { ...basePayload, tokenType: 'access' } satisfies JwtPayload,
      {
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_ACCESS_EXPIRES_IN',
        ) as JwtSignOptions['expiresIn'],
        secret: this.configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      { ...basePayload, tokenType: 'refresh' } satisfies JwtPayload,
      {
        expiresIn: this.configService.getOrThrow<string>(
          'JWT_REFRESH_EXPIRES_IN',
        ) as JwtSignOptions['expiresIn'],
        secret: this.configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
      },
    );

    const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
    await this.usersService.updateRefreshTokenHash(user.id, refreshTokenHash);

    return { accessToken, refreshToken, user };
  }
}
