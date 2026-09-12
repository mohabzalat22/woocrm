import { Module } from '@nestjs/common';
import { UserRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersController } from './users/users.controller';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  providers: [UserRepository, UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
