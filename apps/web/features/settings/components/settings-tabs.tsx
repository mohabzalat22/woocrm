"use client";

import { useState } from "react";
import { cn } from "cn"; // fix: not a real package named "cn"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/ui/tabs";
import { UserSettingsForm } from "@/features/auth/components/user-settings-form";
import { TeamsSettings } from "@/features/settings/components/teams-settings";
import { ChannelsSettings } from "@/features/settings/components/channels-settings";

const TABS = [
  { id: "general", value: "general", label: "General" },
  { id: "teams", value: "teams", label: "Teams" },
  { id: "channels", value: "channels", label: "Channels" },
];

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      orientation="vertical"
      className="min-w-0 flex-col gap-6 md:flex-row md:items-start"
    >
      <TabsList
        variant="line"
        className="h-auto w-full shrink-0 flex-col items-stretch justify-start gap-1 border-b pb-2 md:w-48 md:border-e md:border-b-0 md:pb-0 md:pe-4"
      >
        {TABS.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.value}
            className={cn(
              "h-auto flex-none justify-start px-3 py-2 text-left",
              "data-[state=active]:bg-primary",
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="general" className="min-w-0">
        <UserSettingsForm />
      </TabsContent>
      <TabsContent value="teams" className="min-w-0">
        <TeamsSettings />
      </TabsContent>
      <TabsContent value="channels" className="min-w-0">
        <ChannelsSettings />
      </TabsContent>
    </Tabs>
  );
}
