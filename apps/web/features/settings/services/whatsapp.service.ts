import { request } from "@/common/lib/api";
import type { WhatsAppConnectionStatus } from "@repo/shared-types";

export const WHATSAPP_KEYS = {
  connection: (workspaceId: string) =>
    ["whatsapp-connection", workspaceId] as const,
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined — check the root .env");
}

export const whatsappApi = {
  getConnection: (workspaceId: string) =>
    request<WhatsAppConnectionStatus>(
      `workspaces/${encodeURIComponent(workspaceId)}/messaging/whatsapp`,
    ),

  disconnect: (workspaceId: string) =>
    request<void>(
      `workspaces/${encodeURIComponent(workspaceId)}/messaging/whatsapp`,
      { method: "DELETE" },
    ),

  getConnectUrl: (workspaceId: string) =>
    `${apiUrl}workspaces/${encodeURIComponent(workspaceId)}/messaging/whatsapp/oauth/start`,
};
