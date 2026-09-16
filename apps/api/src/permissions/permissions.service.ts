import { PermissionsRepository } from './permissions.repository';
import { PermissionDto, RolePermissionDto } from './dto';
import { CreatePermissionInput } from './schemas/create-permission.schema';
import { UpdatePermissionInput } from './schemas/update-permission.schema';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RolesService } from '../roles/roles.service';
import { WorkspaceMembersService } from '../workspace-members/workspace-members.service';

@Injectable()
export class PermissionsService {
  constructor(
    private readonly permissionsRepository: PermissionsRepository,
    private readonly rolesService: RolesService,
    private readonly workspaceMembersService: WorkspaceMembersService,
  ) {}

  async findById(
    id: string,
    userId: string,
    roleId: string,
    workspaceId: string,
  ): Promise<PermissionDto> {
    await this.assertMemberAndRole(userId, roleId, workspaceId);

    const permission = await this.permissionsRepository.findByIdAndRoleId(
      id,
      roleId,
    );

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async findAll(
    userId: string,
    roleId: string,
    workspaceId: string,
  ): Promise<PermissionDto[] | []> {
    await this.assertMemberAndRole(userId, roleId, workspaceId);

    return await this.permissionsRepository.findAllByRoleId(roleId);
  }

  async findAllByRoleId(roleId: string): Promise<PermissionDto[] | []> {
    return await this.permissionsRepository.findAllByRoleId(roleId);
  }

  async create(
    userId: string,
    roleId: string,
    workspaceId: string,
    data: CreatePermissionInput,
  ): Promise<PermissionDto> {
    await this.assertMemberAndRole(userId, roleId, workspaceId);

    return await this.permissionsRepository.create(roleId, data);
  }

  async updateById(
    id: string,
    userId: string,
    roleId: string,
    workspaceId: string,
    data: UpdatePermissionInput,
  ): Promise<PermissionDto> {
    await this.assertMemberAndRole(userId, roleId, workspaceId);

    const permission = await this.permissionsRepository.findByIdAndRoleId(
      id,
      roleId,
    );

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return await this.permissionsRepository.updateById(permission.id, data);
  }

  async deleteById(
    id: string,
    userId: string,
    roleId: string,
    workspaceId: string,
  ): Promise<PermissionDto> {
    await this.assertMemberAndRole(userId, roleId, workspaceId);

    const permission = await this.permissionsRepository.findByIdAndRoleId(
      id,
      roleId,
    );

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return await this.permissionsRepository.deleteById(permission.id);
  }

  async assignPermissionToRole(
    permissionId: string,
    roleId: string,
    userId: string,
    workspaceId: string,
  ): Promise<RolePermissionDto> {
    await this.assertMemberAndRole(userId, roleId, workspaceId);

    const permission = await this.permissionsRepository.findById(permissionId);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const alreadyAssigned = await this.permissionsRepository.findByIdAndRoleId(
      permissionId,
      roleId,
    );

    if (alreadyAssigned) {
      throw new ConflictException('Permission already assigned to this role');
    }

    return this.permissionsRepository.assignPermissionToRole(
      roleId,
      permissionId,
    );
  }

  async detachPermissionFromRole(
    permissionId: string,
    roleId: string,
    userId: string,
    workspaceId: string,
  ): Promise<RolePermissionDto> {
    await this.assertMemberAndRole(userId, roleId, workspaceId);

    const permission = await this.permissionsRepository.findByIdAndRoleId(
      permissionId,
      roleId,
    );

    if (!permission) {
      throw new NotFoundException('Permission is not assigned to this role');
    }

    return await this.permissionsRepository.detachPermissionFromRole(
      roleId,
      permissionId,
    );
  }

  private async assertMemberAndRole(
    userId: string,
    roleId: string,
    workspaceId: string,
  ): Promise<void> {
    const member = await this.workspaceMembersService.findByUserId(
      userId,
      workspaceId,
    );

    if (!member) {
      throw new NotFoundException('Member not found in this workspace');
    }

    const role = this.rolesService.findById(roleId, workspaceId);

    if (!role) {
      throw new NotFoundException('Role not found in this workspace');
    }
  }
}
