import { UserRepository } from './users.repository';
import { ConflictException, Injectable } from '@nestjs/common';
import type { CreateUserInput } from './schemas/create-user.schema';
import type { UpdateUserInput } from './schemas/update-user.schema';
import { UserDto, UserWithPasswordDto } from './dto/index';
import * as bcrypt from 'bcrypt';
import { FindByEmailUserDto } from './dto/find-by-email-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async findById(id: string): Promise<UserDto | null> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<FindByEmailUserDto | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findAll(): Promise<UserDto[] | []> {
    return await this.userRepository.findAll();
  }

  async create(data: CreateUserInput): Promise<UserDto> {
    const exists = await this.userRepository.findByEmail(data.email);
    if (exists) {
      throw new ConflictException('User Already exists');
    }
    const password = await bcrypt.hash(data.password, 12);

    return await this.userRepository.create({
      ...data,
      password,
    });
  }

  async updateById(id: string, data: UpdateUserInput): Promise<UserDto> {
    const exists = await this.userRepository.findById(id);

    if (!exists) {
      throw new ConflictException('User doesnot exists');
    }

    const payload = { ...data };

    if (payload.password) {
      payload.password = await bcrypt.hash(payload.password, 12);
    }

    return await this.userRepository.updateById(id, payload);
  }

  async deleteById(id: string): Promise<UserDto> {
    const exists = await this.userRepository.findById(id);

    if (!exists) {
      throw new ConflictException('User doesnot exists');
    }

    return await this.userRepository.deleteById(id);
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPasswordDto | null> {
    return await this.userRepository.findByEmailWithPassword(email);
  }

  async findByIdWithRefreshTokenHash(
    id: string,
  ): Promise<{ id: string; refreshTokenHash: string | null } | null> {
    return await this.userRepository.findByIdWithRefreshTokenHash(id);
  }

  async updateRefreshTokenHash(
    id: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.userRepository.updateRefreshTokenHash(id, refreshTokenHash);
  }
}
