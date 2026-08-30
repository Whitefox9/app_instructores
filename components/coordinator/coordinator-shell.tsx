"use client";

import Link from "next/link";
import { PropsWithChildren, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  BookOpenText,
  Building2,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  FileSpreadsheet,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { institutionBrand } from "@/lib/config/brand";
import { coordinatorAcademicContext } from "@/lib/mocks/coordinator-usal";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Resumen", href: "/coordinador/dashboard", icon: LayoutDashboard },
  { label: "Docentes", href: "/coordinador/docentes", icon: UserRound },
  { label: "Grupos", href: "/coordinador/grupos", icon: UsersRound },
  { label: "Aulas", href: "/coordinador/aulas", icon: Building2 },
  { label: "Programación", href: "/coordinador/programacion", icon: CalendarClock },
  { label: "Carga docente", href: "/coordinador/carga-docente", icon: ClipboardList },
  { label: "Importaciones", href: "/coordinador/importaciones", icon: FileSpreadsheet },
  { label: "Seguimiento", href: "/coordinador/seguimiento", icon: BookOpenText },
];

export function CoordinatorShell({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [campus, setCampus] = useState(coordinatorAcademicContext.campus);
  const pageLabel = useMemo(
    () => navItems.find((item) => pathname.startsWith(item.href))?.label ?? "Coordinación académica",
    [pathname],
  );

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,rgba(248,250,252,0.94)_0%,rgba(244,247,249,0.98)_100%)] pb-20 md:pb-0">
      <div className={cn("grid min-h-screen", sidebarCollapsed ? "xl:grid-cols-[78px_1fr]" : "xl:grid-cols-[232px_1fr]")}>
        <button
          type="button"
          aria-label="Cerrar navegación"
          className={cn("fixed inset-0 z-40 bg-slate-950/40 transition-opacity xl:hidden", mobileOpen ? "opacity-100" : "pointer-events-none opacity-0")}
          onClick={() => setMobileOpen(false)}
        />

        <aside className={cn("fixed inset-y-0 left-0 z-50 flex w-[232px] flex-col border-r border-border/80 bg-white px-3 py-4 shadow-xl transition-transform xl:sticky xl:top-0 xl:h-screen xl:translate-x-0 xl:shadow-none", sidebarCollapsed && "xl:w-[78px]", mobileOpen ? "translate-x-0" : "-translate-x-full")}>
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-primary px-3 py-3 text-primary-foreground">
            <Link href="/coordinador/dashboard" className={cn("min-w-0", sidebarCollapsed && "xl:hidden")}>
              <p className="text-xs font-black uppercase tracking-[0.18em]">{institutionBrand.shortName}</p>
              <p className="mt-1 truncate font-serif font-bold">Coordinación académica</p>
            </Link>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/15 hover:text-white xl:hidden" onClick={() => setMobileOpen(false)}><X className="h-4 w-4" /></Button>
            <Button variant="ghost" size="icon" className="hidden text-white hover:bg-white/15 hover:text-white xl:inline-flex" onClick={() => setSidebarCollapsed((current) => !current)} aria-label={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}>{sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}</Button>
          </div>

          <nav className="mt-4 space-y-1">
            {navItems.map((item) => {
              const active = pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)} title={sidebarCollapsed ? item.label : undefined} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors", sidebarCollapsed && "xl:justify-center xl:px-0", active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className={cn(sidebarCollapsed && "xl:hidden")}>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <Button asChild variant="ghost" className={cn("mt-auto", sidebarCollapsed ? "xl:px-0" : "justify-start")}><Link href="/login"><LogOut className="h-4 w-4" /><span className={cn(sidebarCollapsed && "xl:hidden")}>Cerrar sesión</span></Link></Button>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-col">
          <header className="sticky top-0 z-30 border-b border-border/80 bg-white/92 backdrop-blur-xl">
            <div className="flex flex-col gap-3 px-4 py-3 sm:px-6 xl:flex-row xl:items-center xl:justify-between xl:px-8">
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" className="xl:hidden" onClick={() => setMobileOpen(true)} aria-label="Abrir navegación"><Menu className="h-4 w-4" /></Button>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{coordinatorAcademicContext.period}</p>
                  <p className="mt-1 font-bold text-foreground">{pageLabel}</p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-[220px_1fr_auto] xl:w-[650px]">
                <Select value={campus} onChange={(event) => setCampus(event.target.value)} aria-label="Campus activo">
                  {coordinatorAcademicContext.campuses.map((item) => <option key={item}>{item}</option>)}
                </Select>
                <label className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" placeholder="Buscar docente, grupo o aula" />
                </label>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 xl:px-8 xl:py-6">{children}</main>
        </div>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-border/80 bg-white/95 px-1 pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-10px_30px_-22px_rgba(15,23,42,0.4)] backdrop-blur md:hidden">
        {navItems.slice(0, 4).map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return <Link key={item.href} href={item.href} className={cn("flex min-w-0 flex-col items-center gap-1 rounded-xl px-1 py-2 text-[10px] font-bold", active ? "bg-primary/8 text-primary" : "text-muted-foreground")}><Icon className="h-5 w-5" /><span className="truncate">{item.label}</span></Link>;
        })}
      </nav>
    </div>
  );
}
