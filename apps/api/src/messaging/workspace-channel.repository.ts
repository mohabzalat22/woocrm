import { Injectable } from '@nestjs/common';
import prisma from '@repo/database';
import type { WorkspaceChannelSettingDto } from './dto/workspace-channel-setting.dto';

@Injectable()
export class WorkspaceChannelRepository {
  async findSetting(
    workspaceId: string,
  ): Promise<WorkspaceChannelSettingDto | null> {
    return prisma.workspaceChannelSetting.findUnique({
      where: { workspaceId },
    });
  }

  async createSetting(
    workspaceId: string,
    channel: string,
  ): Promise<WorkspaceChannelSettingDto> {
    return prisma.workspaceChannelSetting.create({
      data: { workspaceId, channel },
    });
  }
}
