"use client";

import type { WhatsAppConnectionStatus } from "@repo/shared-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { WHATSAPP_KEYS, whatsappApi } from "../services/whatsapp.service";

export function useWhatsAppConnection(workspaceId: string | null) {
  const enabled = Boolean(workspaceId);
  const id = workspaceId ?? "";
  const queryClient = useQueryClient();

  const connection = useQuery({
    queryKey: WHATSAPP_KEYS.connection(id),
    queryFn: () => whatsappApi.getConnection(id),
    enabled,
    retry: false,
  });

  const disconnect = useMutation({
    mutationFn: () => whatsappApi.disconnect(id),
    onSuccess: () => {
      const disconnected: WhatsAppConnectionStatus = {
        connected: false,
        status: null,
        businessName: null,
        verifiedName: null,
        displayPhoneNumber: null,
        phoneNumberId: null,
        whatsappBusinessAccountId: null,
      };

      queryClient.setQueryData(WHATSAPP_KEYS.connection(id), disconnected);
    },
  });

  return { connection, disconnect };
}
