"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BookOpenText,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  GraduationCap,
  Mail,
  MapPin,
  Search,
  Upload,
  UserRound,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  coordinatorAlerts,
  coordinatorClassrooms,
  coordinatorFaculties,
  coordinatorGroups,
  coordinatorImportBatches,
  coordinatorSchedule,
  coordinatorTeachers,
  coordinatorTeachingLoads,
} from "@/lib/mocks/coordinator-usal";
import { cn } from "@/lib/utils";

function progressWidth(value: number, maximum: number) {
  return `${Math.min(100, Math.round((value / maximum) * 100))}%`;
}

function alertVariant(severity: "alta" | "media" | "baja") {
  if (severity === "alta") return "danger" as const;
  if (severity === "media") return "warning" as const;
  return "secondary" as const;
}

export function CoordinatorDashboardView() {
  const upcoming = coordinatorSchedule.slice(0, 3);

  return (
    <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
      <Card>
        <CardHeader>
          <CardTitle>Actividad académica de hoy</CardTitle>
          <CardDescription>Sesiones, docentes y aulas que requieren una lectura rápida.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcoming.map((item) => (
            <div key={item.id} className="grid gap-3 rounded-2xl border border-border/80 bg-muted/25 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={item.status === "Confirmada" ? "success" : "warning"}>{item.status}</Badge>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Grupo {item.groupCode}</span>
                </div>
                <p className="mt-2 font-bold text-foreground">{item.subject}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.teacher} · {item.classroom}</p>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock3 className="h-4 w-4 text-primary" /> {item.time}
              </div>
            </div>
          ))}
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/coordinador/programacion">Abrir programación <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alertas prioritarias</CardTitle>
          <CardDescription>Situaciones que pueden afectar la operación del periodo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {coordinatorAlerts.map((alert) => (
            <Link key={alert.id} href={alert.href} className="block rounded-2xl border border-border/80 p-4 transition-colors hover:bg-muted/35">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-bold text-foreground">{alert.title}</p>
                    <Badge variant={alertVariant(alert.severity)}>{alert.severity}</Badge>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{alert.detail}</p>
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card className="xl:col-span-2">
        <CardHeader>
          <CardTitle>Facultades</CardTitle>
          <CardDescription>Distribución académica del campus activo.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {coordinatorFaculties.map((faculty) => (
            <div key={faculty.id} className="rounded-2xl border border-border/80 p-4">
              <Building2 className="h-6 w-6 text-primary" />
              <p className="mt-3 font-bold text-foreground">{faculty.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">Decanato: {faculty.dean}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div><p className="font-black">{faculty.programs}</p><p className="text-[11px] text-muted-foreground">Programas</p></div>
                <div><p className="font-black">{faculty.teachers}</p><p className="text-[11px] text-muted-foreground">Docentes</p></div>
                <div><p className="font-black">{faculty.students}</p><p className="text-[11px] text-muted-foreground">Estudiantes</p></div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export function CoordinatorTeachersView() {
  const [query, setQuery] = useState("");
  const [faculty, setFaculty] = useState("Todas");
  const facultyOptions = ["Todas", ...new Set(coordinatorTeachers.map((item) => item.faculty))];
  const visible = useMemo(() => coordinatorTeachers.filter((teacher) => {
    const matchesQuery = `${teacher.name} ${teacher.specialty} ${teacher.department}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (faculty === "Todas" || teacher.faculty === faculty);
  }), [faculty, query]);

  return (
    <div className="space-y-5">
      <Card>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-[1fr_280px]">
          <label className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar docente o especialidad" className="pl-9" />
          </label>
          <Select value={faculty} onChange={(event) => setFaculty(event.target.value)}>{facultyOptions.map((item) => <option key={item}>{item}</option>)}</Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 xl:grid-cols-2">
        {visible.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 font-black text-primary">{teacher.initials}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div><p className="font-bold text-foreground">{teacher.name}</p><p className="text-sm text-muted-foreground">{teacher.contractType}</p></div>
                    <Badge variant={teacher.availability === "Completa" ? "warning" : "success"}>{teacher.availability}</Badge>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-foreground">{teacher.specialty}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{teacher.department} · {teacher.faculty}</p>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: progressWidth(teacher.assignedHours, teacher.maximumHours) }} /></div>
                  <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>{teacher.assignedHours} de {teacher.maximumHours} horas</span><span>{teacher.groups} grupos</span></div>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{teacher.email}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CoordinatorGroupsView() {
  const [query, setQuery] = useState("");
  const visible = coordinatorGroups.filter((group) => `${group.code} ${group.subject} ${group.program} ${group.teacher}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-5">
      <Card><CardContent className="p-4"><label className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar grupo, asignatura o docente" className="pl-9" /></label></CardContent></Card>
      <div className="grid gap-4 xl:grid-cols-2">
        {visible.map((group) => (
          <Card key={group.id}>
            <CardHeader className="bg-slate-950 text-white">
              <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-bold uppercase tracking-[0.16em] text-sky-200">Grupo {group.code}</span><Badge variant={group.status === "Requiere atención" ? "warning" : "success"}>{group.status}</Badge></div>
              <CardTitle className="font-serif text-xl text-white">{group.subject}</CardTitle>
              <CardDescription className="text-white/70">{group.program}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-5">
              <p className="flex items-center gap-2 text-sm"><UserRound className="h-4 w-4 text-primary" />{group.teacher}</p>
              <p className="flex items-center gap-2 text-sm"><CalendarDays className="h-4 w-4 text-primary" />{group.schedule}</p>
              <p className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-primary" />{group.classroom}</p>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4"><span className="text-sm text-muted-foreground">{group.students}/{group.capacity} estudiantes · {group.modality}</span><Button asChild size="sm"><Link href={`/coordinador/grupos/${group.id}`}>Ver grupo <ArrowRight className="h-4 w-4" /></Link></Button></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function CoordinatorGroupDetailView({ groupId }: { groupId: string }) {
  const group = coordinatorGroups.find((item) => item.id === groupId);
  if (!group) return <Card><CardContent className="p-6">Grupo académico no encontrado.</CardContent></Card>;

  return (
    <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
      <Card><CardHeader><CardTitle>{group.subject}</CardTitle><CardDescription>Grupo {group.code} · {group.period}</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><p><strong>Programa:</strong> {group.program}</p><p><strong>Facultad:</strong> {group.faculty}</p><p><strong>Docente:</strong> {group.teacher}</p><p><strong>Horario:</strong> {group.schedule}</p><p><strong>Aula:</strong> {group.classroom}</p><p><strong>Matrícula:</strong> {group.students} de {group.capacity}</p></CardContent></Card>
      <Card><CardHeader><CardTitle>Estudiantes</CardTitle><CardDescription>Muestra inicial del listado matriculado.</CardDescription></CardHeader><CardContent className="space-y-3">{group.roster.length ? group.roster.map((student) => <div key={student.id} className="grid gap-2 rounded-2xl border border-border/80 p-4 sm:grid-cols-[1fr_auto] sm:items-center"><div><p className="font-bold">{student.name}</p><p className="text-sm text-muted-foreground">{student.documentNumber} · {student.email}</p></div><Badge variant="success">{student.enrollmentStatus}</Badge></div>) : <p className="text-sm text-muted-foreground">El listado completo estará disponible al conectar matrículas.</p>}</CardContent></Card>
    </div>
  );
}

export function CoordinatorClassroomsView() {
  return <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{coordinatorClassrooms.map((room) => <Card key={room.id}><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10"><Building2 className="h-5 w-5 text-primary" /></div><Badge variant={room.status === "Mantenimiento" ? "warning" : room.status === "Disponible" ? "success" : "secondary"}>{room.status}</Badge></div><p className="mt-4 text-lg font-bold">{room.name}</p><p className="mt-1 text-sm text-muted-foreground">{room.building}</p><div className="mt-4 space-y-2 text-sm"><p>Capacidad: <strong>{room.capacity}</strong></p><p>Próxima disponibilidad: <strong>{room.nextAvailable}</strong></p><p className="text-muted-foreground">{room.equipment.join(" · ")}</p></div></CardContent></Card>)}</div>;
}

export function CoordinatorScheduleView() {
  const [items, setItems] = useState(coordinatorSchedule);
  const confirm = (id: string) => setItems((current) => current.map((item) => item.id === id ? { ...item, status: "Confirmada" as const } : item));
  return <Card><CardContent className="space-y-3 p-4 sm:p-5">{items.map((item) => <div key={item.id} className="grid gap-3 rounded-2xl border border-border/80 p-4 lg:grid-cols-[1.4fr_1fr_1fr_auto] lg:items-center"><div><p className="font-bold">{item.subject}</p><p className="text-sm text-muted-foreground">Grupo {item.groupCode}</p></div><div><p className="text-sm font-semibold">{item.teacher}</p><p className="text-xs text-muted-foreground">{item.classroom}</p></div><div className="text-sm"><p>{item.day}</p><p className="font-semibold">{item.time}</p></div><div className="flex items-center gap-2"><Badge variant={item.status === "Confirmada" ? "success" : item.status === "Conflicto" ? "danger" : "warning"}>{item.status}</Badge>{item.status === "Pendiente" ? <Button size="sm" onClick={() => confirm(item.id)}>Confirmar</Button> : null}</div></div>)}</CardContent></Card>;
}

export function CoordinatorTeachingLoadView() {
  return <div className="grid gap-4 xl:grid-cols-2">{coordinatorTeachingLoads.map((load) => <Card key={load.id}><CardContent className="p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="font-bold">{load.teacher}</p><p className="text-sm text-muted-foreground">{load.faculty}</p></div><Badge variant={load.status === "Sobrecarga" ? "danger" : load.status === "Disponible" ? "success" : "secondary"}>{load.status}</Badge></div><div className="mt-5 h-2.5 overflow-hidden rounded-full bg-muted"><div className={cn("h-full rounded-full", load.assignedHours > load.maximumHours ? "bg-destructive" : "bg-primary")} style={{ width: progressWidth(load.assignedHours, load.maximumHours) }} /></div><div className="mt-3 flex items-center justify-between text-sm"><span>{load.assignedHours}/{load.maximumHours} horas</span><span>{load.groups} grupos</span></div></CardContent></Card>)}</div>;
}

export function CoordinatorImportView() {
  const [fileName, setFileName] = useState("");
  return <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]"><Card><CardHeader><CardTitle>Importar datos académicos</CardTitle><CardDescription>Carga archivos XLSX o CSV de docentes, estudiantes, grupos o aulas.</CardDescription></CardHeader><CardContent><label className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-8 text-center"><Upload className="h-8 w-8 text-primary" /><span className="mt-3 font-bold">Seleccionar archivo</span><span className="mt-1 text-xs text-muted-foreground">XLSX o CSV · máximo 10 MB</span><input type="file" accept=".xlsx,.csv" className="sr-only" onChange={(event) => setFileName(event.target.files?.[0]?.name ?? "")} /></label>{fileName ? <div className="mt-4 flex items-center gap-2 rounded-xl bg-muted p-3 text-sm"><CheckCircle2 className="h-4 w-4 text-primary" /><span className="truncate">{fileName}</span></div> : null}<Button className="mt-4 w-full" disabled={!fileName}>Validar archivo</Button></CardContent></Card><Card><CardHeader><CardTitle>Importaciones recientes</CardTitle><CardDescription>Historial del periodo académico activo.</CardDescription></CardHeader><CardContent className="space-y-3">{coordinatorImportBatches.map((batch) => <div key={batch.id} className="rounded-2xl border border-border/80 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><FileSpreadsheet className="h-5 w-5 text-primary" /><p className="font-bold">{batch.fileName}</p></div><Badge variant={batch.status === "Validado" ? "success" : "warning"}>{batch.status}</Badge></div><div className="mt-3 grid grid-cols-3 gap-2 text-center text-sm"><div><p className="font-black">{batch.records}</p><p className="text-xs text-muted-foreground">Registros</p></div><div><p className="font-black">{batch.validRecords}</p><p className="text-xs text-muted-foreground">Válidos</p></div><div><p className="font-black">{batch.issues}</p><p className="text-xs text-muted-foreground">Alertas</p></div></div></div>)}</CardContent></Card></div>;
}

export function CoordinatorTrackingView() {
  const records = [
    { id: "SEG-001", title: "Asistencia del grupo 2874901", detail: "Un registro docente pendiente de revisión académica.", owner: "Coordinación académica", status: "En revisión" },
    { id: "SEG-002", title: "Programación del grupo 2901220", detail: "Confirmar aula y horario definitivo.", owner: "Facultad de Economía y Empresa", status: "Pendiente" },
    { id: "SEG-003", title: "Carga docente del periodo", detail: "Distribución dentro de los límites definidos.", owner: "Vicerrectorado de Docencia", status: "Al día" },
  ];
  return <div className="grid gap-4">{records.map((record) => <Card key={record.id}><CardContent className="grid gap-3 p-5 sm:grid-cols-[auto_1fr_auto] sm:items-center"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">{record.status === "Al día" ? <CheckCircle2 className="h-5 w-5 text-primary" /> : <AlertTriangle className="h-5 w-5 text-primary" />}</div><div><p className="font-bold">{record.title}</p><p className="mt-1 text-sm text-muted-foreground">{record.detail}</p><p className="mt-2 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">{record.owner}</p></div><Badge variant={record.status === "Al día" ? "success" : "warning"}>{record.status}</Badge></CardContent></Card>)}</div>;
}
