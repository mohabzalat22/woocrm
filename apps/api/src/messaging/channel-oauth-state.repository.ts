
import { Injectable } from '@nestjs/common';
import prisma from '@repo/database';
import {
  ChannelOAuthStateDto,
} from './dto';
import { CreateChannelOAuthStateInput } from './schemas';

@Injectable()
export class ChannelOAuthStateRepository {
  createOAuthState(
    data: CreateChannelOAuthStateInput,
  ): Promise<ChannelOAuthStateDto> {
    return prisma.channelOAuthState.create({
      data: {
        channel: data.channel,
        stateHash: data.stateHash,
        expiresAt: data.expiresAt,
        workspace: { connect: { id: data.workspaceId } },
        user: { connect: { id: data.userId } },
      },
    });
  }

  consumeOAuthState(stateHash: string): Promise<ChannelOAuthStateDto | null> {
    return prisma.$transaction(async (tx) => {
      const result = await tx.channelOAuthState.updateMany({
        where: {
          stateHash,
          consumedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { consumedAt: new Date() },
      });

      if (result.count !== 1) {
        return null;
      }

      return tx.channelOAuthState.findUnique({ where: { stateHash } });
    });
  }
}
