import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ZodResponse } from 'nestjs-zod';
import { JwtAuthGuard } from '../common/guards/auth-guard';
import { UsersService } from './users.service';

import { CreateUserDto, UpdateUserDto, UserDto } from './dto/index';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get the authenticated user from the access token' })
  @ZodResponse({
    status: 200,
    description: 'Authenticated user identity',
    type: UserDto,
  })
  me(@CurrentUser() currentUser: UserDto) {
    return currentUser;
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update the authenticated user' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiOkResponse({ type: UserDto, description: 'Updated user' })
  async updateMe(
    @CurrentUser() currentUser: UserDto,
    @Body() data: UpdateUserDto,
  ) {
    return await this.userService.updateById(currentUser.id, data);
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ZodResponse({
    status: 201,
    description: 'Created user',
    type: UserDto,
  })
  async create(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Find a user by email' })
  @ApiParam({ name: 'email', example: 'user@example.com' })
  @ApiOkResponse({ type: UserDto, description: 'User, or null if not found' })
  async findByEmail(@Param('email') email: string) {
    return await this.userService.findByEmail(email);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by id' })
  @ApiParam({ name: 'id', example: '04916981-b958-4ba6-854c-d99c47f25cd3' })
  @ApiOkResponse({ type: UserDto, description: 'User, or null if not found' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async findById(@Param('id') id: string) {
    return await this.userService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by id' })
  @ApiParam({ name: 'id', example: '04916981-b958-4ba6-854c-d99c47f25cd3' })
  @ApiBadRequestResponse({ description: 'Validation failed' })
  @ApiOkResponse({ type: UserDto, description: 'Updated user' })
  async update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return await this.userService.updateById(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by id' })
  @ApiParam({ name: 'id', example: '04916981-b958-4ba6-854c-d99c47f25cd3' })
  @ApiOkResponse({ type: UserDto, description: 'Deleted user' })
  async delete(@Param('id') id: string) {
    return await this.userService.deleteById(id);
  }
}
