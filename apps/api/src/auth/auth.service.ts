import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtPayload } from './types/jwt-payload.interface';
import type { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const password = await bcrypt.hash(data.password, 12);

    return await this.usersService.create({
      email: data.email,
      name: data.name,
      password,
    });
  }

  async signIn(email: string, password: string): Promise<string> {
    const user = await this.usersService.findByEmailWithPassword(email);

    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }
  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.findByEmail(payload.email);
  }
}
