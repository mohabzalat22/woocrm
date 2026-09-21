import { Injectable } from '@nestjs/common';
import prisma from '@repo/database';
import type { CreateUserInput } from './schemas/create-user.schema';
import type { UpdateUserInput } from './schemas/update-user.schema';
import { UserDto, UserWithPasswordDto } from './dto/index';
import { SystemRole } from '@repo/shared-types';
import { FindByEmailUserDto } from './dto/find-by-email-user.dto';

@Injectable()
export class UserRepository {
  async findById(id: string): Promise<UserDto | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        systemRole: true,
      },
    });
  }

  async findByEmail(email: string): Promise<FindByEmailUserDto | null> {
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
        systemRole: true,
      },
    });
  }

  async create(data: CreateUserInput): Promise<UserDto> {
    return await prisma.user.create({
      data: { ...data, systemRole: SystemRole.USER },
      select: {
        id: true,
        email: true,
        name: true,
        systemRole: true,
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
        systemRole: true,
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
        systemRole: true,
      },
    });
  }

  async findByEmailWithPassword(
    email: string,
  ): Promise<UserWithPasswordDto | null> {
    return await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        systemRole: true,
      },
    });
  }

  async findByIdWithRefreshTokenHash(
    id: string,
  ): Promise<{ id: string; refreshTokenHash: string | null } | null> {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        refreshTokenHash: true,
      },
    });
  }

  async updateRefreshTokenHash(
    id: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { refreshTokenHash },
    });
  }
}
