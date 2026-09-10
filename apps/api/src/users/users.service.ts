import { UserRepository } from './users.repository';
import { Injectable } from '@nestjs/common';
import type { CreateUserInput } from './schemas/create-user.schema';
import {
  UpdateUserDto,
  UserDto,
  UserWithPasswordDto,
} from './dto/index';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}
  async findById(id: string): Promise<UserDto | null> {
    return await this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    return await this.userRepository.findByEmail(email);
  }

  async findAll(): Promise<UserDto[] | null> {
    return await this.userRepository.findAll();
  }

  async create(data: CreateUserInput): Promise<UserDto | null> {
    return await this.userRepository.create(data);
  }

  async updateById(id: string, data: UpdateUserDto): Promise<UserDto | null> {
    return await this.userRepository.updateById(id, data);
  }

  async deleteById(id: string): Promise<UserDto | null> {
    return await this.userRepository.deleteById(id);
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPasswordDto | null> {
    return await this.userRepository.findByEmailWithPassword(email);
  }
}
