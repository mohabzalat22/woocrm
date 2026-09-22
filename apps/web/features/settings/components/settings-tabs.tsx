"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/ui/tabs";
import { UserSettingsForm } from "@/features/auth/components/user-settings-form";
import { TeamsSettings } from "@/features/settings/components/teams-settings";

export function SettingsTabs() {
  return (
    <Tabs
      defaultValue="general"
      orientation="vertical"
      className="min-w-0 flex-col gap-6 md:flex-row md:items-start"
    >
      <TabsList
        variant="line"
        className="h-auto w-full shrink-0 flex-col items-stretch justify-start gap-1 border-b pb-2 md:w-48 md:border-e md:border-b-0 md:pb-0 md:pe-4"
      >
        <TabsTrigger
          value="general"
          className="h-auto flex-none justify-start px-3 py-2 text-left"
        >
          General
        </TabsTrigger>
        <TabsTrigger
          value="teams"
          className="h-auto flex-none justify-start px-3 py-2 text-left"
        >
          Teams
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="min-w-0">
        <UserSettingsForm />
      </TabsContent>
      <TabsContent value="teams" className="min-w-0">
        <TeamsSettings />
      </TabsContent>
    </Tabs>
  );
}
