import { Injectable } from '@nestjs/common';
import { whatsappConfig } from '../../config/whatsapp.config';

interface TokenResponse {
  access_token?: string;
  token_type?: string;
  expires_in?: number;
}

interface WhatsAppBusinessAccount {
  id: string;
  name?: string;
}

interface PhoneNumber {
  id: string;
  display_phone_number?: string;
  verified_name?: string;
}

export interface ConnectedWhatsAppAccount {
  metaUserId: string;
  metaBusinessAccountId: string;
  whatsappBusinessAccountId: string;
  phoneNumberId: string;
  displayPhoneNumber: string | null;
  verifiedName: string | null;
  businessName: string | null;
  accessToken: string;
  accessTokenExpiresAt: Date | null;
}

@Injectable()
export class MetaWhatsAppClient {
  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${whatsappConfig.graphBaseUrl}${path}`, init);

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        'Meta API request failed (' + response.status + '): ' + body,
      );
    }

    return response.json() as Promise<T>;
  }

  async exchangeAuthorizationCode(code: string): Promise<TokenResponse> {
    this.requireOAuthConfig();

    const params = new URLSearchParams({
      client_id: whatsappConfig.appId!,
      client_secret: whatsappConfig.appSecret!,
      redirect_uri: whatsappConfig.redirectUri!,
      code,
    });

    return this.request<TokenResponse>(`/oauth/access_token?${params}`);
  }

  async exchangeForLongLivedToken(
    shortLivedToken: string,
  ): Promise<TokenResponse> {
    this.requireOAuthConfig();

    const params = new URLSearchParams({
      grant_type: 'fb_exchange_token',
      client_id: whatsappConfig.appId!,
      client_secret: whatsappConfig.appSecret!,
      fb_exchange_token: shortLivedToken,
    });

    return this.request<TokenResponse>(`/oauth/access_token?${params}`);
  }

  async findWhatsAppAccount(
    accessToken: string,
  ): Promise<ConnectedWhatsAppAccount> {
    this.requireOAuthConfig();

    const headers = { Authorization: 'Bearer ' + accessToken };
    const appAccessToken =
      whatsappConfig.appId + '|' + whatsappConfig.appSecret;
    const debugParams = new URLSearchParams({
      input_token: accessToken,
      access_token: appAccessToken,
    });
    const debug = await this.request<{
      data?: {
        user_id?: string;
        granular_scopes?: Array<{
          scope?: string;
          target_ids?: string[];
        }>;
      };
    }>('/debug_token?' + debugParams);

    const metaUserId = debug.data?.user_id;
    if (!metaUserId) {
      throw new Error('Meta did not return a user ID for this token');
    }

    const wabaIds = Array.from(
      new Set(
        (debug.data?.granular_scopes ?? [])
          .filter((scope) => scope.scope === 'whatsapp_business_management')
          .flatMap((scope) => scope.target_ids ?? []),
      ),
    );

    if (wabaIds.length === 0) {
      throw new Error(
        'Meta token has no WhatsApp Business Account permission or target',
      );
    }

    for (const wabaId of wabaIds) {
      const account = await this.request<WhatsAppBusinessAccount>(
        '/' + wabaId + '?fields=id,name',
        { headers },
      );
      const phoneNumbers = await this.request<{ data?: PhoneNumber[] }>(
        '/' +
          wabaId +
          '/phone_numbers?fields=id,display_phone_number,verified_name&limit=100',
        { headers },
      );
      const phone = phoneNumbers.data?.[0];

      if (phone) {
        return {
          metaUserId,
          metaBusinessAccountId: account.id,
          whatsappBusinessAccountId: account.id,
          phoneNumberId: phone.id,
          displayPhoneNumber: phone.display_phone_number ?? null,
          verifiedName: phone.verified_name ?? null,
          businessName: account.name ?? null,
          accessToken,
          accessTokenExpiresAt: null,
        };
      }
    }

    throw new Error(
      'No WhatsApp Business phone number is available to connect',
    );
  }

  private requireOAuthConfig(): void {
    if (
      !whatsappConfig.appId ||
      !whatsappConfig.appSecret ||
      !whatsappConfig.redirectUri
    ) {
      throw new Error('Meta OAuth is not configured');
    }
  }
}
