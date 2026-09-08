"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@repo/ui/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/ui/breadcrumb";
import { Separator } from "@repo/ui/ui/separator";

const pageLabels: Record<string, string> = {
  dashboard: "Dashboard",
  inbox: "Inbox",
  contacts: "Contacts",
  pipeline: "Pipeline",
  reports: "Reports",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const pageKey = pathname.split("/")[1] || "dashboard";
  const pageLabel = pageLabels[pageKey] ?? "Dashboard";
  const isDashboard = pageKey === "dashboard";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {isDashboard ? (
            <BreadcrumbItem>
              <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
            </BreadcrumbItem>
          ) : (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{pageLabel}</BreadcrumbPage>
              </BreadcrumbItem>
            </>
          )}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
