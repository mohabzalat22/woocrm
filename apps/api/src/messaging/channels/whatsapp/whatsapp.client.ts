// messaging/channels/whatsapp/whatsapp.client.ts
//
// Minimal wrapper around Meta's Graph API for WhatsApp Cloud.
// Docs: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages

import { whatsappConfig } from '../../config/whatsapp.config';

const GRAPH_BASE_URL = whatsappConfig.graphBaseUrl;

interface GraphApiResponse {
  messaging_product: 'whatsapp';
  contacts: { input: string; wa_id: string }[];
  messages: { id: string }[];
}

export class WhatsAppClient {
  private endpoint: string;

  constructor(
    private readonly accessToken: string,
    phoneNumberId: string,
  ) {
    this.endpoint = `${GRAPH_BASE_URL}/${phoneNumberId}/messages`;
  }

  private async post(body: Record<string, unknown>): Promise<GraphApiResponse> {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messaging_product: 'whatsapp', ...body }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`WhatsApp API error (${res.status}): ${errBody}`);
    }

    return res.json() as Promise<GraphApiResponse>;
  }

  async sendText(to: string, text: string): Promise<GraphApiResponse> {
    return this.post({
      to,
      type: 'text',
      text: { body: text, preview_url: false },
    });
  }

  async sendTemplate(
    to: string,
    template: {
      name: string;
      language: { code: string };
      components: unknown[];
    },
  ): Promise<GraphApiResponse> {
    return this.post({
      to,
      type: 'template',
      template,
    });
  }

  /** Marks an inbound message as read — optional, but improves the UX on the user's WhatsApp. */
  async markRead(messageId: string): Promise<void> {
    await fetch(this.endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        status: 'read',
        message_id: messageId,
      }),
    });
  }
}
