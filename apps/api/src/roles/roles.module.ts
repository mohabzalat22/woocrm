import { Module } from '@nestjs/common';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';

@Module({
  providers: [RolesService, RolesRepository],
  exports: [RolesService, RolesRepository],
})
export class RolesModule {}
