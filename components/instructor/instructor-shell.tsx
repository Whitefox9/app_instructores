"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  CalendarDays,
  ClipboardCheck,
  House,
  LogOut,
  MapPin,
  MonitorPlay,
  UsersRound,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { institutionBrand } from "@/lib/config/brand";
import { demoAcademicSystem } from "@/lib/demo/academic-system";
import { roleProfiles } from "@/lib/mocks/navigation";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/instructor/inicio", label: "Inicio", icon: House },
  { href: "/instructor/agenda", label: "Horario", icon: CalendarDays },
  { href: "/instructor/mis-asignaciones", label: "Grupos", icon: UsersRound },
  { href: "/instructor/asistencia", label: "Asistencia", icon: ClipboardCheck },
  { href: "/instructor/perfil", label: "Perfil", icon: UserRound },
];

const { flagshipGroup } = demoAcademicSystem;

const notifications = [
  {
    id: "room-change",
    title: "Cambio de aula confirmado",
    detail: `El grupo ${flagshipGroup.number} fue trasladado al ${flagshipGroup.room}.`,
    time: "Hace 10 minutos",
    href: `/instructor/detalle-ficha/${flagshipGroup.number}`,
    icon: MapPin,
    unread: true,
  },
  {
    id: "attendance-pending",
    title: "Asistencia pendiente de completar",
    detail: "El grupo 3011450 tiene 2 estudiantes sin marcar.",
    time: "Hace 35 minutos",
    href: "/instructor/asistencia?ficha=3011450&origen=notificacion",
    icon: ClipboardCheck,
    unread: true,
  },
  {
    id: "virtual-schedule",
    title: "Horario virtual por confirmar",
    detail: "English Dot Works requiere validar el enlace de la próxima sesión.",
    time: "Ayer",
    href: "/instructor/agenda",
    icon: MonitorPlay,
    unread: false,
  },
] as const;

export function InstructorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const profile = roleProfiles.instructor;
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadNotificationIds, setUnreadNotificationIds] = useState<string[]>(
    notifications.filter((notification) => notification.unread).map((notification) => notification.id),
  );
  const unreadCount = unreadNotificationIds.length;

  return (
    <div className="instructor-shell min-h-screen pb-24 md:pb-0">
      <header className="relative bg-[linear-gradient(110deg,#d22020_0%,#b7191f_68%,#95131a_100%)] text-white shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/instructor/inicio" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/45 text-xs font-black tracking-wider">{institutionBrand.shortName}</div>
            <div className="min-w-0"><p className="truncate font-serif text-base font-bold sm:text-lg">{institutionBrand.name}</p><p className="text-xs text-white/75">{institutionBrand.productName} · Docente</p></div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/12 hover:text-white" aria-label={`Notificaciones${unreadCount ? `, ${unreadCount} sin leer` : ""}`} aria-expanded={notificationsOpen} aria-controls="instructor-notifications" onClick={() => setNotificationsOpen((current) => !current)}>
              <Bell className="h-5 w-5" />
              {unreadCount ? (
                <span className="absolute right-0 top-0 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[10px] font-black leading-none text-primary">
                  {unreadCount}
                </span>
              ) : null}
            </Button>
            <Link href="/instructor/perfil" className="hidden items-center gap-3 rounded-2xl px-2 py-1.5 hover:bg-white/10 sm:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/16 text-sm font-bold">{profile.initials}</div>
              <div><p className="text-sm font-bold">{profile.userName}</p><p className="text-xs text-white/75">{profile.userTitle}</p></div>
            </Link>
          </div>
        </div>
        {notificationsOpen ? (
          <div id="instructor-notifications" className="absolute right-4 top-[4.75rem] z-50 w-[calc(100%-2rem)] max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-2xl sm:right-6">
            <div className="flex items-center justify-between gap-4 border-b px-4 py-3.5">
              <div>
                <p className="font-bold">Notificaciones</p>
                <p className="mt-0.5 text-xs text-slate-500" aria-live="polite">
                  {unreadCount ? `${unreadCount} sin leer` : "Todo al día"}
                </p>
              </div>
              <button type="button" onClick={() => setNotificationsOpen(false)} className="flex size-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900" aria-label="Cerrar notificaciones">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[24rem] divide-y overflow-y-auto">
              {notifications.map((notification) => {
                const Icon = notification.icon;
                const unread = unreadNotificationIds.includes(notification.id);

                return (
                  <Link
                    key={notification.id}
                    href={notification.href}
                    onClick={() => {
                      setUnreadNotificationIds((current) =>
                        current.filter((id) => id !== notification.id),
                      );
                      setNotificationsOpen(false);
                    }}
                    className={cn(
                      "flex gap-3 px-4 py-4 transition-colors hover:bg-slate-50",
                      unread && "bg-red-50/70",
                    )}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-start gap-2">
                        <span className="text-sm font-bold leading-5">{notification.title}</span>
                        {unread ? (
                          <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" aria-label="Sin leer" />
                        ) : null}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-slate-600">
                        {notification.detail}
                      </span>
                      <span className="mt-1.5 block text-xs text-slate-500">{notification.time}</span>
                    </span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t p-3">
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                disabled={!unreadCount}
                onClick={() => setUnreadNotificationIds([])}
              >
                {unreadCount ? "Marcar todo como leído" : "No hay notificaciones pendientes"}
              </Button>
            </div>
          </div>
        ) : null}
        <nav className="mx-auto hidden max-w-6xl items-center gap-1 px-6 md:flex">
          {navigation.map((item) => { const active = pathname === item.href; const Icon = item.icon; return <Link key={item.href} href={item.href} className={cn("flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-bold transition-colors", active ? "border-white text-white" : "border-transparent text-white/72 hover:text-white")}><Icon className="h-4 w-4" />{item.label}</Link>; })}
          <Link href="/login" className="ml-auto flex items-center gap-2 px-3 py-3 text-sm text-white/72 hover:text-white"><LogOut className="h-4 w-4" /> Cerrar sesión</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border/80 bg-white/95 px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_30px_-22px_rgba(15,23,42,0.4)] backdrop-blur md:hidden">
        {navigation.map((item) => { const active = pathname === item.href; const Icon = item.icon; return <Link key={item.href} href={item.href} className={cn("flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold", active ? "bg-primary/8 text-primary" : "text-muted-foreground")}><Icon className="h-5 w-5" /><span className="truncate">{item.label}</span></Link>; })}
      </nav>
    </div>
  );
}
