"use client";

import { PropsWithChildren, useState } from "react";

import { RoleSidebar } from "@/components/layout/role-sidebar";
import { TopHeader } from "@/components/layout/top-header";
import { UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

type AppShellProps = PropsWithChildren<{
  role: UserRole;
}>;

export function AppShell({ role, children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={cn("min-h-screen", role === "instructor" && "instructor-shell")}>
      <div
        className={cn(
          "grid min-h-screen",
          sidebarCollapsed ? "lg:grid-cols-[88px_1fr]" : "lg:grid-cols-[268px_1fr]",
        )}
      >
        <div
          className={cn(
            "fixed inset-0 z-40 bg-slate-950/35 transition-opacity lg:hidden",
            sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          onClick={() => setSidebarOpen(false)}
        />
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 border-r border-border/80 bg-[hsl(var(--card)/0.9)] backdrop-blur-xl transition-all lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
            sidebarCollapsed ? "w-[88px]" : "w-[268px]",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <RoleSidebar
            role={role}
            collapsed={sidebarCollapsed}
            onNavigate={() => setSidebarOpen(false)}
            onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
          />
        </aside>
        <div className="flex min-h-screen flex-col">
          <TopHeader
            role={role}
            onOpenSidebar={() => setSidebarOpen(true)}
            sidebarCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((current) => !current)}
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
