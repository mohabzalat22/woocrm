"use client";

import { UserPlus, Users } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/ui/tabs";
import { UserSettingsForm } from "@/features/auth/components/user-settings-form";

function TeamsSettings() {
  return (
    <div className="grid max-w-3xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Team members</CardTitle>
          <CardDescription>
            Invite people to your workspace and manage their access.
          </CardDescription>
          <CardAction>
            <Button type="button" variant="outline" disabled>
              <UserPlus />
              Invite member
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed px-6 py-12 text-center">
            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="size-5" aria-hidden="true" />
            </div>
            <p className="font-medium">No team members yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Team members and their roles will appear here once team
              management is connected.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

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
