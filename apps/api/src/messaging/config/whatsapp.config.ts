const whatsappApiVersion = process.env.WHATSAPP_API_VERSION;
const metaApiVersion = process.env.META_GRAPH_API_VERSION;
const metaGraphBaseUrl = process.env.META_GRAPH_BASE_URL;
const metaBaseUrl = 'https://www.facebook.com';

export const whatsappConfig = {
  whatsappApiVersion,
  graphBaseUrl: `${metaGraphBaseUrl}/${whatsappApiVersion}`,
  oauthAuthorizeUrl: `${metaBaseUrl}/${metaApiVersion}/dialog/oauth`,
  appId: process.env.META_APP_ID,
  appSecret: process.env.META_APP_SECRET,
  redirectUri: process.env.META_REDIRECT_URI,
  oauthScopes: 'whatsapp_business_management,whatsapp_business_messaging'
    .split(',')
    .map((scope) => scope.trim())
    .filter(Boolean),
  credentialEncryptionKey: process.env.CREDENTIAL_ENCRYPTION_KEY,
  webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN,
  webhookAppSecret: process.env.META_APP_SECRET,
};
