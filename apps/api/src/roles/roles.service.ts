import { Injectable, NotFoundException } from '@nestjs/common';
import { RoleDto } from './dto';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
  constructor(private readonly rolesRepository: RolesRepository) {}

  async findById(id: string, workspaceId: string): Promise<RoleDto> {
    const role = await this.rolesRepository.findById(id, workspaceId);

    if (!role) {
      throw new NotFoundException('Role not found in this workspace');
    }

    return role;
  }
}
