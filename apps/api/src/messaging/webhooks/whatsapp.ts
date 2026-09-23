// messaging/channels/whatsapp/whatsapp.webhook.ts
//
// Express router for Meta's WhatsApp webhook:
// - GET  is the one-time verification handshake when you configure the webhook URL
// - POST is every inbound event (messages, statuses, etc.)

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { whatsappConfig } from '../config';
import { WhatsAppChannel } from '../channels/whatsapp/whatsapp.channel';

export function createWhatsAppWebhookRouter(
  channel: WhatsAppChannel,
  onIncomingMessage: (
    msg: ReturnType<WhatsAppChannel['parseIncoming']>,
  ) => Promise<void>,
): Router {
  const router = Router();

  // --- Verification handshake (Meta calls this once when you save the webhook URL) ---
  router.get('/webhooks/whatsapp', (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === whatsappConfig.webhookVerifyToken) {
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  });

  // --- Inbound events ---
  // NOTE: this route needs the *raw* request body for signature verification.
  // In your app bootstrap, mount this router BEFORE any express.json() body
  // parser that would consume the raw bytes, or configure express.json({ verify })
  // to stash rawBody — see wiring example.
  router.post('/webhooks/whatsapp', async (req: Request, res: Response) => {
    if (!verifySignature(req)) {
      return res.sendStatus(401);
    }

    // Acknowledge immediately — Meta expects a fast 200, retries on timeout/non-200
    res.sendStatus(200);

    const incoming = channel.parseIncoming(req.body);
    if (incoming) {
      await onIncomingMessage(incoming);
    }
  });

  return router;
}

function verifySignature(req: Request & { rawBody?: Buffer }): boolean {
  const signatureHeader = req.header('X-Hub-Signature-256');
  if (!signatureHeader || !req.rawBody) return false;
  if (!whatsappConfig.webhookAppSecret) return false;

  const expected =
    'sha256=' +
    crypto
      .createHmac('sha256', whatsappConfig.webhookAppSecret)
      .update(req.rawBody)
      .digest('hex');

  const signature = Buffer.from(signatureHeader);
  const expectedSignature = Buffer.from(expected);
  return (
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(signature, expectedSignature)
  );
}
