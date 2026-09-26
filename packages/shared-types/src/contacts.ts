export const CONTACT_STATES = [
  "NEW",
  "LEAD",
  "CUSTOMER",
  "VIP",
  "IMPORTANT",
  "FOLLOWUP",
  "INTERESTED",
  "INACTIVE",
  "PARTNER",
] as const;

export type ContactState = (typeof CONTACT_STATES)[number];

export interface ContactInfo {
  id: string;
  identity: string;
  source: string;
}

export interface Contact {
  id: string;
  name: string;
  state: ContactState;
  contactInfos: ContactInfo[];
}

export interface ContactsPage {
  data: Contact[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ContactInfoInput {
  identity: string;
  source: string;
}

export interface CreateContactPayload {
  name: string;
  state?: ContactState;
  contactInfos?: ContactInfoInput[];
}

export interface UpdateContactPayload {
  name?: string;
  state?: ContactState;
  contactInfos?: ContactInfoInput[];
}
