import { PermissionsRepository } from './permissions.repository';
import { PermissionDto, RolePermissionDto } from './dto';
import { CreatePermissionInput } from './schemas/create-permission.schema';
import { UpdatePermissionInput } from './schemas/update-permission.schema';
import { RoleInput } from '../workspace-members/schemas/role.schema';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PermissionsService {
  constructor(private readonly permissionsRepository: PermissionsRepository) {}

  async findById(id: string): Promise<PermissionDto | null> {
    return await this.permissionsRepository.findById(id);
  }

  async findAll(): Promise<PermissionDto[] | []> {
    return await this.permissionsRepository.findAll();
  }

  async findAllForRole(role: RoleInput): Promise<PermissionDto[] | []> {
    return await this.permissionsRepository.findAllForRole(role);
  }

  async create(data: CreatePermissionInput): Promise<PermissionDto> {
    return await this.permissionsRepository.create(data);
  }

  async updateById(
    id: string,
    data: UpdatePermissionInput,
  ): Promise<PermissionDto> {
    return await this.permissionsRepository.updateById(id, data);
  }

  async deleteById(id: string): Promise<PermissionDto> {
    return await this.permissionsRepository.deleteById(id);
  }

  async assignPermissionToRole(
    role: RoleInput,
    permissionId: string,
  ): Promise<RolePermissionDto> {
    const permissionExists =
      await this.permissionsRepository.findById(permissionId);

    if (!permissionExists) {
      throw new NotFoundException("Permission Doesn't Exist");
    }

    return this.permissionsRepository.assignPermissionToRole(
      role,
      permissionId,
    );
  }

  async detachPermissionFromRole(
    role: RoleInput,
    permissionId: string,
  ): Promise<RolePermissionDto> {
    const permissionExists =
      await this.permissionsRepository.findById(permissionId);

    if (!permissionExists) {
      throw new NotFoundException("Permission Doesn't Exist");
    }

    return await this.permissionsRepository.detachPermissionFromRole(
      role,
      permissionId,
    );
  }
}
