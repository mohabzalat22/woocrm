"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Link2,
  Loader2,
  MessageCircle,
  Unplug,
} from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/ui/card";
import { useActiveWorkspace } from "@/features/workspaces/hooks/active-workspace";
import { useWhatsAppConnection } from "../hooks/use-whatsapp-connection";
import { whatsappApi } from "../services/whatsapp.service";

export function ChannelsSettings() {
  const { activeWorkspaceId } = useActiveWorkspace();
  const searchParams = useSearchParams();
  const [oauthResult, setOauthResult] = useState<string | null>(null);
  const { connection, disconnect } = useWhatsAppConnection(activeWorkspaceId);

  useEffect(() => {
    setOauthResult(searchParams.get("whatsapp"));
  }, [searchParams]);

  if (!activeWorkspaceId) {
    return (
      <Card className="max-w-3xl">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            Select a workspace to connect its WhatsApp Business account.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (connection.isLoading) {
    return (
      <Card className="max-w-3xl">
        <CardContent className="flex items-center gap-2 pt-6 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Loading WhatsApp connection...
        </CardContent>
      </Card>
    );
  }

  const data = connection.data;
  const workspaceId = activeWorkspaceId;
  const isConnected = data?.connected === true;
  const isExpired = data?.status === "EXPIRED";

  function connect() {
    window.location.assign(whatsappApi.getConnectUrl(workspaceId));
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="size-5 text-green-600" />
          WhatsApp
        </CardTitle>
        <CardDescription>
          Connect a WhatsApp Business account to this workspace.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {connection.isError && (
          <div
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            Unable to load the WhatsApp connection.
          </div>
        )}
        {/* TODO: use common alert styles from common directory */}
        {disconnect.isError && (
          <div
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            Unable to disconnect WhatsApp. Please try again.
          </div>
        )}

        {(oauthResult === "failed" || oauthResult === "invalid_state") && (
          <div
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            WhatsApp connection could not be completed. Please try again.
          </div>
        )}

        {oauthResult === "cancelled" && (
          <div className="rounded-lg border px-3 py-2 text-sm text-muted-foreground">
            WhatsApp connection was cancelled.
          </div>
        )}

        {isConnected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700">
              <CheckCircle2 className="size-4" />
              Connected
            </div>
            <div className="grid gap-3 rounded-lg border p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Business Account</p>
                <p className="font-medium">
                  {data.businessName ??
                    data.verifiedName ??
                    "WhatsApp Business"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Phone Number</p>
                <p className="font-medium">
                  {data.displayPhoneNumber ?? "Not provided by Meta"}
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => disconnect.mutate()}
              disabled={disconnect.isPending}
            >
              {disconnect.isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Unplug />
              )}
              Disconnect
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {isExpired ? (
                <AlertCircle className="size-4 text-amber-600" />
              ) : (
                <Link2 className="size-4" />
              )}
              {isExpired ? "Connection expired" : "Status: Not connected"}
            </div>
            <Button
              type="button"
              onClick={connect}
              disabled={connection.isFetching}
            >
              {connection.isFetching ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Link2 />
              )}
              {isExpired ? "Reconnect WhatsApp" : "Connect WhatsApp"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
