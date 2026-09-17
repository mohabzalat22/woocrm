import { Injectable } from '@nestjs/common';
import prisma from '@repo/database';
import type { CreateUserInput } from './schemas/create-user.schema';
import type { UpdateUserInput } from './schemas/update-user.schema';
import { UserDto, UserWithPasswordDto } from './dto/index';

@Injectable()
export class UserRepository {
  async findById(id: string): Promise<UserDto | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async findAll(): Promise<UserDto[] | []> {
    return await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async create(data: CreateUserInput): Promise<UserDto> {
    return await prisma.user.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async updateById(id: string, data: UpdateUserInput): Promise<UserDto> {
    return await prisma.user.update({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
      data,
    });
  }

  async deleteById(id: string): Promise<UserDto> {
    return await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPasswordDto | null> {
    return await prisma.user.findUnique({
      where: { email },
    });
  }
}
