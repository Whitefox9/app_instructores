"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, BookOpenText, CalendarDays, ClipboardCheck, House, LogOut, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { institutionBrand } from "@/lib/config/brand";
import { studentNotifications, studentProfile } from "@/lib/mocks/student";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/estudiante/inicio", label: "Inicio", icon: House },
  { href: "/estudiante/horario", label: "Horario", icon: CalendarDays },
  { href: "/estudiante/programa", label: "Programa", icon: BookOpenText },
  { href: "/estudiante/asistencia", label: "Asistencia", icon: ClipboardCheck },
  { href: "/estudiante/perfil", label: "Perfil", icon: UserRound },
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const unread = studentNotifications.filter((notification) => notification.unread).length;

  return (
    <div className="student-shell min-h-screen pb-24 md:pb-0">
      <header className="bg-[linear-gradient(110deg,#d22020_0%,#b7191f_68%,#95131a_100%)] text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/estudiante/inicio" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/45 text-xs font-black tracking-wider">
              {institutionBrand.shortName}
            </div>
            <div className="min-w-0">
              <p className="truncate font-serif text-base font-bold sm:text-lg">{institutionBrand.name}</p>
              <p className="text-xs text-white/75">{institutionBrand.productName}</p>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/12 hover:text-white" aria-label="Notificaciones">
              <Bell className="h-5 w-5" />
              {unread > 0 ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-white" /> : null}
            </Button>
            <Link href="/estudiante/perfil" className="hidden items-center gap-3 rounded-2xl px-2 py-1.5 hover:bg-white/10 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/16 text-sm font-bold">{studentProfile.initials}</div>
              <div>
                <p className="text-sm font-bold">{studentProfile.shortName}</p>
                <p className="text-xs text-white/75">Expediente {studentProfile.recordNumber}</p>
              </div>
            </Link>
          </div>
        </div>

        <nav className="mx-auto hidden max-w-6xl items-center gap-1 px-6 md:flex">
          {navigation.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className={cn("flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors", active ? "border-white text-white" : "border-transparent text-white/72 hover:text-white")}>
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <Link href="/login" className="ml-auto flex items-center gap-2 px-3 py-3 text-sm text-white/72 hover:text-white">
            <LogOut className="h-4 w-4" /> Cerrar sesión
          </Link>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border/80 bg-white/95 px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_30px_-22px_rgba(15,23,42,0.4)] backdrop-blur md:hidden">
        {navigation.map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href} className={cn("flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold", active ? "bg-primary/8 text-primary" : "text-muted-foreground")}>
              <Icon className="h-5 w-5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
