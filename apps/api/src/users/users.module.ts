import { Module } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  providers: [UserRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
