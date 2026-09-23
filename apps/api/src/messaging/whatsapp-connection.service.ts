import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import { WorkspaceContextService } from '../authorization/workspace-context.service';
import { whatsappConfig } from './config/whatsapp.config';
import {
  hashOAuthState,
  encryptCredential,
} from './security/credential-crypto';
import { MetaWhatsAppClient } from './channels/whatsapp/meta.client';
import { WhatsAppConnectionRepository } from './whatsapp-connection.repository';
import { randomBytes } from 'node:crypto';
import type { WhatsAppConnectionStatus } from '@repo/shared-types';

const OAUTH_STATE_TTL_MS = 10 * 60 * 1000;

@Injectable()
export class WhatsAppConnectionService {
  constructor(
    private readonly workspaceContext: WorkspaceContextService,
    private readonly whatsAppConnectionRepository: WhatsAppConnectionRepository,
    private readonly metaClient: MetaWhatsAppClient,
  ) {}

  async createAuthorizationUrl(
    userId: string,
    workspaceId: string,
  ): Promise<string> {
    await this.workspaceContext.requireMembership(userId, workspaceId);

    if (
      !whatsappConfig.appId ||
      !whatsappConfig.appSecret ||
      !whatsappConfig.redirectUri
    ) {
      throw new ServiceUnavailableException(
        'WhatsApp connection is not configured',
      );
    }

    const state = randomBytes(32).toString('base64url');
    await this.whatsAppConnectionRepository.createOAuthState({
      stateHash: hashOAuthState(state),
      userId,
      workspaceId,
      expiresAt: new Date(Date.now() + OAUTH_STATE_TTL_MS),
    });

    const params = new URLSearchParams({
      client_id: whatsappConfig.appId,
      redirect_uri: whatsappConfig.redirectUri,
      response_type: 'code',
      scope: whatsappConfig.oauthScopes.join(','),
      state,
    });

    return `${whatsappConfig.oauthAuthorizeUrl}?${params}`;
  }

  async completeAuthorization(state: string, code: string) {
    const oauthState =
      await this.whatsAppConnectionRepository.consumeOAuthState(
        hashOAuthState(state),
      );

    if (!oauthState) {
      throw new BadRequestException(
        'The WhatsApp connection request is invalid or expired',
      );
    }

    const shortLived = await this.metaClient.exchangeAuthorizationCode(code);
    const longLived = shortLived.access_token
      ? await this.metaClient.exchangeForLongLivedToken(shortLived.access_token)
      : shortLived;
    const token = longLived.access_token ?? shortLived.access_token;
    if (!token)
      throw new BadRequestException('Meta did not return an access token');

    const account = await this.metaClient.findWhatsAppAccount(token);
    const expiresIn = longLived.expires_in ?? shortLived.expires_in;
    const accessTokenExpiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 1000)
      : account.accessTokenExpiresAt;

    const oauthWorkspaceId = oauthState.workspaceId as string;

    await this.whatsAppConnectionRepository.upsert(oauthWorkspaceId, {
      metaUserId: account.metaUserId,
      metaBusinessAccountId: account.metaBusinessAccountId,
      whatsappBusinessAccountId: account.whatsappBusinessAccountId,
      phoneNumberId: account.phoneNumberId,
      displayPhoneNumber: account.displayPhoneNumber,
      verifiedName: account.verifiedName,
      businessName: account.businessName,
      encryptedAccessToken: encryptCredential(token),
      accessTokenExpiresAt,
    });

    return oauthState.workspaceId;
  }

  async getStatus(
    userId: string,
    workspaceId: string,
  ): Promise<WhatsAppConnectionStatus> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    const connection =
      await this.whatsAppConnectionRepository.findByWorkspaceId(workspaceId);

    if (!connection) {
      return {
        connected: false,
        status: null,
        businessName: null,
        verifiedName: null,
        displayPhoneNumber: null,
        phoneNumberId: null,
        whatsappBusinessAccountId: null,
      };
    }

    const expired =
      !!connection.accessTokenExpiresAt &&
      connection.accessTokenExpiresAt.getTime() <= Date.now();
    const status = expired ? 'EXPIRED' : connection.status;

    return {
      connected: status === 'ACTIVE',
      status,
      businessName: connection.businessName,
      verifiedName: connection.verifiedName,
      displayPhoneNumber: connection.displayPhoneNumber,
      phoneNumberId: connection.phoneNumberId,
      whatsappBusinessAccountId: connection.whatsappBusinessAccountId,
    };
  }

  async disconnect(userId: string, workspaceId: string): Promise<void> {
    await this.workspaceContext.requireMembership(userId, workspaceId);
    await this.whatsAppConnectionRepository.deleteByWorkspaceId(workspaceId);
  }
}
