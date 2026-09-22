import { Module } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

@Module({
  providers: [RolesService, RolesRepository],
  controllers: [RolesController],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}
