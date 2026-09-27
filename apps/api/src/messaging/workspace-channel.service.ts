import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Role } from '@repo/shared-types';
import { RolesRepository } from '../roles/roles.repository';
import { WorkspaceContextService } from '../authorization/workspace-context.service';
import { MessageChannelRegistry } from './registry/message-channel.registry';
import type { SetWorkspaceChannelDto } from './dto/set-workspace-channel.dto';
import type { WorkspaceChannelResponseDto } from './dto/workspace-channel-response.dto';
import type { WorkspaceChannelSettingDto } from './dto/workspace-channel-setting.dto';
import { WorkspaceChannelRepository } from './workspace-channel.repository';

@Injectable()
export class WorkspaceChannelService {
  constructor(
    private readonly repository: WorkspaceChannelRepository,
    private readonly workspaceContext: WorkspaceContextService,
    private readonly rolesRepository: RolesRepository,
    private readonly channelRegistry: MessageChannelRegistry,
  ) {}

  async getChannel(
    userId: string,
    workspaceId: string,
  ): Promise<WorkspaceChannelResponseDto | null> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    const setting = await this.repository.findSetting(workspaceId);
    return setting ? this.toResponse(setting) : null;
  }

  async setChannel(
    userId: string,
    workspaceId: string,
    data: SetWorkspaceChannelDto,
  ): Promise<WorkspaceChannelResponseDto> {
    const member = await this.workspaceContext.requireMembership(
      userId,
      workspaceId,
    );
    const role = await this.rolesRepository.findById(
      member.roleId,
      workspaceId,
    );
    if (!role || role.name !== Role.ADMIN.toUpperCase()) {
      throw new ForbiddenException(
        'Only workspace admins can set the messaging channel',
      );
    }

    const existing = await this.repository.findSetting(workspaceId);
    if (existing) throw new ConflictException('CHANNEL_ALREADY_LOCKED');

    this.channelRegistry.get(data.channel); // check if channel already exists

    try {
      return this.toResponse(
        await this.repository.createSetting(workspaceId, data.channel),
      );
    } catch (error: unknown) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException('CHANNEL_ALREADY_LOCKED');
      }
      throw error;
    }
  }

  async requireChannel(
    workspaceId: string,
    channel: string,
  ): Promise<WorkspaceChannelSettingDto> {
    const setting = await this.repository.findSetting(workspaceId);
    if (!setting) {
      throw new UnprocessableEntityException(
        'Workspace messaging channel is not configured',
      );
    }
    if (setting.channel !== channel) {
      throw new BadRequestException(
        'Messaging channel does not match the workspace channel',
      );
    }

    this.channelRegistry.get(channel);
    return setting;
  }

  private toResponse(
    setting: WorkspaceChannelSettingDto,
  ): WorkspaceChannelResponseDto {
    return {
      id: setting.id,
      workspaceId: setting.workspaceId,
      channel: setting.channel,
      lockedAt: setting.lockedAt.toISOString(),
    };
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    );
  }
}
