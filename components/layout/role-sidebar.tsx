"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  BookOpenText,
  Building2,
  CalendarDays,
  ClipboardList,
  DoorOpen,
  Folders,
  GitBranchPlus,
  GraduationCap,
  House,
  LayoutDashboard,
  MapPinned,
  ScanSearch,
  School,
  Sheet,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { navigationByRole, roleProfiles } from "@/lib/mocks/navigation";
import { IconName, UserRole } from "@/lib/types";
import { cn } from "@/lib/utils";

const iconMap: Record<IconName, typeof LayoutDashboard> = {
  "layout-dashboard": LayoutDashboard,
  "building-2": Building2,
  "map-pinned": MapPinned,
  users: Users,
  "shield-check": ShieldCheck,
  "graduation-cap": GraduationCap,
  "book-open-text": BookOpenText,
  folders: Folders,
  school: School,
  "door-open": DoorOpen,
  "git-branch-plus": GitBranchPlus,
  "scan-search": ScanSearch,
  sheet: Sheet,
  house: House,
  "calendar-days": CalendarDays,
  "clipboard-list": ClipboardList,
};

type RoleSidebarProps = {
  role: UserRole;
  collapsed?: boolean;
  onNavigate?: () => void;
  onToggleCollapse?: () => void;
};

export function RoleSidebar({
  role,
  collapsed = false,
  onNavigate,
  onToggleCollapse,
}: RoleSidebarProps) {
  const pathname = usePathname();
  const profile = roleProfiles[role];
  const navigation = navigationByRole[role];
  const isInstructor = role === "instructor";

  return (
    <div
      className={cn(
        "flex h-full flex-col gap-5 p-4 lg:p-5",
        isInstructor && "bg-[#162742] text-white",
      )}
    >
      <div
        className={cn(
          "border-b px-2 pb-4",
          isInstructor ? "border-white/8" : "border-border/80",
        )}
      >
        <div className={cn("flex items-center", collapsed ? "justify-center" : "justify-between")}>
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl text-sm font-semibold",
                isInstructor ? "bg-white/12 text-white" : "bg-primary/10 text-primary",
              )}
            >
            {profile.initials}
          </div>
            {!collapsed ? (
              <div>
                <p
                  className={cn(
                    "text-xs uppercase tracking-[0.24em]",
                    isInstructor ? "text-white/60" : "text-muted-foreground",
                  )}
                >
                  App Instructores
                </p>
                <p className={cn("mt-1 text-base font-semibold", isInstructor ? "text-white" : "text-foreground")}>
                  {profile.label}
                </p>
              </div>
            ) : null}
          </div>
          {onToggleCollapse ? (
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "hidden lg:inline-flex",
                isInstructor
                  ? "text-white/70 hover:bg-white/10 hover:text-white"
                  : "",
              )}
              onClick={onToggleCollapse}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </Button>
          ) : null}
        </div>
      </div>

      <nav className="space-y-2">
        {navigation.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center rounded-[0.95rem] px-3 py-2.5 text-sm font-medium transition-all",
                collapsed ? "justify-center" : "justify-between",
                isActive
                  ? isInstructor
                    ? "bg-[#27467c] text-white"
                    : "bg-primary text-primary-foreground"
                  : isInstructor
                    ? "text-white/72 hover:bg-white/8 hover:text-white"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-4 w-4" />
                {!collapsed ? item.label : null}
              </span>
              {item.badge && !collapsed ? (
                <Badge variant={isActive ? "outline" : "secondary"} className="border-white/20 bg-white/10 text-current">
                  {item.badge}
                </Badge>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "mt-auto border-t px-2 pt-4",
          isInstructor ? "border-white/8" : "border-border/80",
        )}
      >
        <div className={cn("mb-4 flex items-center gap-3", collapsed && "justify-center")}>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/12 text-sm font-semibold text-white">
            {profile.initials}
          </div>
          {!collapsed ? (
            <div>
              <p className={cn("text-sm font-semibold", isInstructor ? "text-white" : "text-foreground")}>
                {profile.userName}
              </p>
              <p className={cn("text-xs", isInstructor ? "text-white/60" : "text-muted-foreground")}>
                {profile.userTitle}
              </p>
            </div>
          ) : null}
        </div>
        <Button
          asChild
          variant="ghost"
          className={cn(
            "w-full rounded-[0.95rem] px-3",
            collapsed ? "justify-center" : "justify-start",
            isInstructor ? "text-white/72 hover:bg-white/8 hover:text-white" : "",
          )}
        >
          <Link href="/login">Cerrar sesion</Link>
        </Button>
      </div>
    </div>
  );
}
