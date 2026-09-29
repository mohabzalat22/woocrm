import { SidebarInset, SidebarProvider } from "#/ui/components/sidebar";
import { TooltipProvider } from "#/ui/components/tooltip";
import { AppSidebar } from "@/components/ui/app-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { AuthGuard } from "@/common/guards/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <DashboardHeader />
            <main className="min-w-0 flex-1">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </TooltipProvider>
    </AuthGuard>
  );
}
