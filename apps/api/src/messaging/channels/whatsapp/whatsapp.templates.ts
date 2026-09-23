// messaging/channels/whatsapp/whatsapp.templates.ts
//
// Mirrors the templates you've had approved in Meta Business Manager
// (WhatsApp Manager > Message Templates). Name + language must match exactly.

export interface WhatsAppTemplate {
  name: string;
  language: string;
  requiredParams: string[]; // order matters — maps positionally to {{1}}, {{2}}, ...
}

export const WHATSAPP_TEMPLATES: Record<string, WhatsAppTemplate> = {
  LEAD_FOLLOW_UP: {
    name: 'lead_follow_up',
    language: 'en_US',
    requiredParams: ['contact_name'],
  },
  APPOINTMENT_REMINDER: {
    name: 'appointment_reminder',
    language: 'en_US',
    requiredParams: ['contact_name', 'appointment_time'],
  },
};

/** Builds the `template` object Meta's /messages endpoint expects. */
export function buildTemplatePayload(
  templateKey: string,
  params: Record<string, string>,
) {
  const template = WHATSAPP_TEMPLATES[templateKey];
  if (!template) {
    throw new Error(`Unknown WhatsApp template key: ${templateKey}`);
  }

  const missing = template.requiredParams.filter((p) => !params[p]);
  if (missing.length > 0) {
    throw new Error(
      `Missing template params for "${templateKey}": ${missing.join(', ')}`,
    );
  }

  return {
    name: template.name,
    language: { code: template.language },
    components: [
      {
        type: 'body',
        parameters: template.requiredParams.map((p) => ({
          type: 'text',
          text: params[p],
        })),
      },
    ],
  };
}
