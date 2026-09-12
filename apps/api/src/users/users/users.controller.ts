import { JwtAuthGuard } from '@/common/guards/auth-guard';
import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Get, Request, Req, Param } from '@nestjs/common';
import { UsersService } from '../users.service';
import type { CreateUserInput } from '../schemas/create-user.schema';
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  me(@Req() req: Request) {
    return req.user;
  }

  @Patch('me')
  async updateMe(@Req() req: Request, @Body() data: Record<string, unknown>) {
    return await this.userService.updateById(req.user.id, data);
  }

  @Post()
  async create(@Body() data: CreateUserInput) {
    return await this.userService.create(data);
  }

  @Get(':id')
  async finById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Get('email/:email')
  async finByEmail(@Param('email') email: string) {
    return await this.userService.findByEmail(email);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Record<string, unknown>) {
    return await this.userService.updateById(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.userService.deleteById(id);
  }
}
