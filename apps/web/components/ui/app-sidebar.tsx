"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@repo/ui/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
} from "@repo/ui/ui/dropdown-menu";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WorkspaceDialog } from "@/common/components/workspace-dialog";
import {
  BarChart3,
  Building2,
  ChevronDown,
  Inbox,
  Kanban,
  Plus,
  Users,
} from "lucide-react";
import SettingsButton from "./settings-button";
import { useEffect, useState } from "react";
import { useWorkspaces } from "@/features/workspaces/hooks/use-workspaces";
import { useActiveWorkspace } from "@/features/workspaces/hooks/active-workspace";

const menuItems = [
  { label: "Inbox", href: "/inbox", icon: Inbox },
  { label: "Contacts", href: "/contacts", icon: Users },
  { label: "Pipeline", href: "/pipeline", icon: Kanban },
  { label: "Reports", href: "/reports", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const workspaces = useWorkspaces();
  const { activeWorkspaceId, clearWorkspace, selectWorkspace } =
    useActiveWorkspace();
  const [createWorkspaceOpenDialog, setCreateWorkspaceOpenDialog] =
    useState(false);
  const activeWorkspace = workspaces.data?.find(
    (workspace) => workspace.id === activeWorkspaceId,
  );

  useEffect(() => {
    if (
      !activeWorkspaceId ||
      !workspaces.data ||
      workspaces.data.some((workspace) => workspace.id === activeWorkspaceId)
    ) {
      return;
    }

    clearWorkspace();
  }, [activeWorkspaceId, clearWorkspace, workspaces.data]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-3 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 pb-1 text-2xl font-semibold tracking-tight text-primary group-data-[collapsible=icon]:hidden">
              wasel.com
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem className="my-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  title={activeWorkspace?.name ?? "Select Workspace"}
                  className="h-9 !bg-transparent"
                >
                  <Building2 />
                  <span className="group-data-[collapsible=icon]:hidden">
                    {activeWorkspace?.name ?? "Select Workspace"}
                  </span>
                  <ChevronDown className="ml-auto group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuLabel>Your workspaces</DropdownMenuLabel>
                {workspaces.isLoading && (
                  <DropdownMenuItem disabled>
                    Loading workspaces...
                  </DropdownMenuItem>
                )}
                {workspaces.isError && (
                  <DropdownMenuItem disabled>
                    Unable to load workspaces
                  </DropdownMenuItem>
                )}
                {!workspaces.isLoading &&
                  !workspaces.isError &&
                  workspaces.data?.length === 0 && (
                    <DropdownMenuItem disabled>
                      No workspaces yet
                    </DropdownMenuItem>
                  )}
                <DropdownMenuRadioGroup
                  value={activeWorkspaceId ?? undefined}
                  onValueChange={selectWorkspace}
                >
                  {workspaces.data?.map((workspace) => (
                    <DropdownMenuRadioItem
                      key={workspace.id}
                      value={workspace.id}
                    >
                      <Building2 />
                      <span className="truncate">{workspace.name}</span>
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => setCreateWorkspaceOpenDialog(true)}
                >
                  <Plus />
                  <span>Add workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <WorkspaceDialog
              mode="create"
              open={createWorkspaceOpenDialog}
              onOpenChange={setCreateWorkspaceOpenDialog}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-3 py-2">
          <SidebarMenu className="gap-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    title={item.label}
                    className="h-9 !bg-transparent"
                  >
                    <Link href={item.href}>
                      <Icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <SettingsButton />
      </SidebarFooter>
    </Sidebar>
  );
}
