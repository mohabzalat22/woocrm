import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from 'node:crypto';
import { whatsappConfig } from '../config/whatsapp.config';

const ALGORITHM = 'aes-256-gcm';

function encryptionKey(): Buffer {
  const configured = whatsappConfig.credentialEncryptionKey;

  if (!configured) {
    throw new Error('Credential encryption is not configured');
  }

  const key = /^[0-9a-f]{64}$/i.test(configured)
    ? Buffer.from(configured, 'hex')
    : Buffer.from(configured, 'base64');

  if (key.length !== 32) {
    throw new Error('CREDENTIAL_ENCRYPTION_KEY must encode exactly 32 bytes');
  }

  return key;
}
// both used for access token
export function encryptCredential(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, encryptionKey(), iv);
  const encrypted = Buffer.concat([
    cipher.update(value, 'utf8'),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return [iv, tag, encrypted]
    .map((part) => part.toString('base64url'))
    .join('.');
}

export function decryptCredential(value: string): string {
  const [iv, tag, encrypted] = value.split('.');

  if (!iv || !tag || !encrypted) {
    throw new Error('Invalid encrypted credential');
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    encryptionKey(),
    Buffer.from(iv, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
}

export function hashOAuthState(state: string): string {
  return createHash('sha256').update(state).digest('hex');
} // used to hash state to avoid csrf
