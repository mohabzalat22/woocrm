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
    CurrentUserId: string,
    roleId: string,
    workspaceId: string,
  ): Promise<PermissionDto> {
    await this.checkMemberAndRole(CurrentUserId, roleId, workspaceId);

    const permission = await this.permissionsRepository.findByIdAndRoleId(
      id,
      roleId,
      workspaceId,
    );

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return permission;
  }

  async findAll(
    CurrentUserId: string,
    roleId: string,
    workspaceId: string,
  ): Promise<PermissionDto[] | []> {
    await this.checkMemberAndRole(CurrentUserId, roleId, workspaceId);

    return await this.permissionsRepository.findAllByRoleId(roleId, workspaceId);
  }

  async findAllByRoleId(roleId: string, workspaceId: string): Promise<PermissionDto[] | []> {
    return await this.permissionsRepository.findAllByRoleId(roleId, workspaceId);
  }

  async create(
    CurrentUserId: string,
    roleId: string,
    workspaceId: string,
    data: CreatePermissionInput,
  ): Promise<PermissionDto> {
    await this.checkMemberAndRole(CurrentUserId, roleId, workspaceId);

    return await this.permissionsRepository.create(roleId, workspaceId, data);
  }

  async updateById(
    id: string,
    CurrentUserId: string,
    roleId: string,
    workspaceId: string,
    data: UpdatePermissionInput,
  ): Promise<PermissionDto> {
    await this.checkMemberAndRole(CurrentUserId, roleId, workspaceId);

    const permission = await this.permissionsRepository.findByIdAndRoleId(
      id,
      roleId,
      workspaceId,
    );

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return await this.permissionsRepository.updateById(permission.id, workspaceId, data);
  }

  async deleteById(
    id: string,
    CurrentUserId: string,
    roleId: string,
    workspaceId: string,
  ): Promise<PermissionDto> {
    await this.checkMemberAndRole(CurrentUserId, roleId, workspaceId);

    const permission = await this.permissionsRepository.findByIdAndRoleId(
      id,
      roleId,
      workspaceId,
    );

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    return await this.permissionsRepository.deleteById(permission.id, workspaceId);
  }

  async assignPermissionToRole(
    permissionId: string,
    roleId: string,
    CurrentUserId: string,
    workspaceId: string,
  ): Promise<RolePermissionDto> {
    await this.checkMemberAndRole(CurrentUserId, roleId, workspaceId);

    const permission = await this.permissionsRepository.findById(permissionId, workspaceId);

    if (!permission) {
      throw new NotFoundException('Permission not found');
    }

    const alreadyAssigned = await this.permissionsRepository.findByIdAndRoleId(
      permissionId,
      roleId,
      workspaceId,
    );

    if (alreadyAssigned) {
      throw new ConflictException('Permission already assigned to this role');
    }

    return this.permissionsRepository.assignPermissionToRole(
      roleId,
      permissionId,
      workspaceId,
    );
  }

  async detachPermissionFromRole(
    permissionId: string,
    roleId: string,
    CurrentUserId: string,
    workspaceId: string,
  ): Promise<RolePermissionDto> {
    await this.checkMemberAndRole(CurrentUserId, roleId, workspaceId);

    const permission = await this.permissionsRepository.findByIdAndRoleId(
      permissionId,
      roleId,
      workspaceId,
    );

    if (!permission) {
      throw new NotFoundException('Permission is not assigned to this role');
    }

    return await this.permissionsRepository.detachPermissionFromRole(
      roleId,
      permissionId,
      workspaceId,
    );
  }

  private async checkMemberAndRole(
    CurrentUserId: string,
    roleId: string,
    workspaceId: string,
  ): Promise<void> {
    const member = await this.workspaceMembersService.findByUserId(
      CurrentUserId,
      CurrentUserId,
      workspaceId,
    );

    if (!member) {
      throw new NotFoundException('Member not found in this workspace');
    }

    const role = await this.rolesService.findById(roleId, workspaceId);

    if (!role) {
      throw new NotFoundException('Role not found in this workspace');
    }
  }
}
